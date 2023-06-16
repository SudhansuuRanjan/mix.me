import { FunctionComponent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPlaylist, doesUserFollowPlaylist, followPlaylist, unfollowPlaylist, getUser, deletePlaylist } from "../spotify";
import { catchErrors, formatWithCommas } from "../utils";
import Loader from "../components/Loader";
import Track from "../components/Track";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaTrash } from "react-icons/fa";


const Playlist: FunctionComponent = () => {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [playlist, setPlaylist] = useState<any>(null);
    const [tracks, setTracks] = useState<any>(null);
    const playlistId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getPlaylist(playlistId);
            setPlaylist(data);
            setTracks(data.tracks.items);
            // console.log(data);
        };

        catchErrors(fetchData());
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getUser();
            const userId = data.id;
            const { data: following } = await doesUserFollowPlaylist(playlistId, userId);
            setIsFollowing(following[0]);
        };

        catchErrors(fetchData());
    }, []);

    const handleFollowPlaylist = async () => {
        try {
            await followPlaylist(playlistId);
            setIsFollowing(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUnfollowPlaylist = async () => {
        try {
            await unfollowPlaylist(playlistId);
            setIsFollowing(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">

                {
                    !playlist ? <Loader /> :
                        <div className="flex flex-col md:flex-row gap-7">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4">
                                    <img className="w-52 h-52 rounded-lg" src={playlist.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : playlist.images[0]?.url} alt={playlist.name} />
                                    <div className="flex flex-col">
                                        <p className="text-4xl font-semibold my-1">{playlist.name}</p>
                                        <p className="text-gray-400 text-medium text-sm mt-1 max-w-md">{playlist.description}</p>
                                        <div className="flex items-center text-white my-2">
                                            <div>
                                                {isFollowing ? <AiFillHeart onClick={handleUnfollowPlaylist} className="text-pink-500 cursor-pointer" size={24} /> : <AiOutlineHeart onClick={handleFollowPlaylist} className="text-pink-500 cursor-pointer" size={24} />}
                                            </div>&nbsp;·&nbsp;
                                            <a href="" className="text-green-500 hover:underline text-sm">By {playlist.owner.display_name}</a> &nbsp;·&nbsp;
                                            <p className="text-gray-200 hover:text-gray-400 text-sm font-medium">{formatWithCommas(playlist.followers.total)} Likes</p> &nbsp;·&nbsp;
                                            <p className="text-gray-200 hover:text-gray-400 text-sm font-medium">{playlist.tracks.total} Songs</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Link target="_blank" to={"https://open.spotify.com/playlist/" + playlist.id}><button className="bg-green-500 hover:bg-green-600 text-white rounded-full text-sm px-4 py-1.5">Play on Spotify</button></Link>
                                            <Link to={`/recommendations/${playlist.id}`}>
                                                <button className="bg-gray-800 hover:bg-gray-700 text-white rounded-full text-sm px-4 py-1.5">Get Recomendations</button>
                                            </Link>
                                            <button onClick={async () => {
                                                if(confirm("Are you sure you want to delete this playlist?")){
                                                    await deletePlaylist(playlistId);
                                                    navigate('/playlists');
                                                }
                                            }} className="text-red-500 px-4 py-1.5 -ml-2">
                                                <FaTrash size={18}/>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                }



                <div>
                    <p className="text-3xl font-semibold mt-16">Tracks</p>
                </div>
                {
                    !tracks ? <Loader /> :
                        <div className="flex flex-wrap gap-4 my-10">
                            {tracks.map((track: any, i: number) => (
                                <Track key={i} trackId={track.track.id} trackAlbum={track.track.album.name} trackArtists={track.track.album.artists} trackDuration={track.track.duration_ms} trackPlayedAt={""} trackImage={track.track.album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : track.track.album.images[2]?.url} trackName={track.track.name === "" ? "Unavailable" : track.track.name} tractAlbumId={track.track.album.id} />
                            ))}
                        </div>
                }
            </div>
        </div>
    );
}

export default Playlist;