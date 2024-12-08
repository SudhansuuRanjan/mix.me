import { FunctionComponent, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPlaylist, doesUserFollowPlaylist, followPlaylist, unfollowPlaylist, getUser, deletePlaylist } from "../spotify";
import { formatWithCommas } from "../utils";
import Loader from "../components/Loader";
import PlayableTrack from "../components/PlayableTrack";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import { QueryClient } from "@tanstack/react-query";
import { useNavContext } from "../context/NavContext";


const Playlist: FunctionComponent = () => {
    const playerRef = useRef<any>(null);
    const { setNavTitle } = useNavContext();
    const navigate = useNavigate();
    const queryClient = new QueryClient();
    const { playlistId } = useParams() as { playlistId: string };

    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        const audio = playerRef.current.audio.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };


    const { data, isLoading: playListLoading, isError, refetch } = useQuery({
        queryKey: ['playlist', playlistId],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await getPlaylist(playlistId);
            return { playlist: res.data, tracks: res.data.tracks.items };
        }
    })

    const { data: userData, isLoading, refetch: refetchFollowing } =
        useQuery({
            queryKey: ["user", playlistId],
            staleTime: 1000 * 60 * 60 * 24,
            queryFn: async () => {
                const res1 = await getUser();
                const userId = res1.data.id;
                const res2 = await doesUserFollowPlaylist(playlistId, userId);
                return { user: res1.data, following: res2.data[0] }
            }
        })

    useEffect(() => {
        document.title = `${playListLoading ? "Playlist" : data?.playlist.name} • mix.me`;
        setNavTitle(`${playListLoading ? "Playlist" : data?.playlist.name}`);
    }, [data?.playlist])

    const handleFollowPlaylist = async () => {
        try {
            await followPlaylist(playlistId);
            refetchFollowing()
        } catch (error) {
            console.log(error);
        }
    };

    const handleUnfollowPlaylist = async () => {
        try {
            await unfollowPlaylist(playlistId);
            refetchFollowing()
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">

                {
                    playListLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> :
                        <div className="flex flex-col md:flex-row gap-7">
                            {/* {data.tracks.length > 0 && <AudioPlayer
                                ref={playerRef}
                                src={data?.tracks[currentTrack].track.preview_url}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => {
                                    if (currentTrack < data?.tracks.length - 1) {
                                        setCurrentTrack(currentTrack + 1);
                                    } else {
                                        setCurrentTrack(0);
                                    }
                                }}
                                className="hidden"
                            />} */}


                            <div className="flex flex-col gap-3">
                                <div className="flex lg:flex-row md:flex-row flex-col gap-4">
                                    <div className="w-fit h-fit bg-gray-950 rounded-md relative group">
                                        {data?.playlist.images && <img data-aos="zoom-in" height={500} width={500} className="w-52 h-52 rounded-lg" src={ data?.playlist.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : data?.playlist.images[0]?.url} alt={data?.playlist.name} />}
                                        {/* <div className={`absolute group-hover:hidden inset-0 bg-black bg-opacity-30 ${isPlaying ? 'flex' : 'hidden'} items-center justify-center`}>
                                            <div className="flex items-end justify-center space-x-1 h-[3.5rem]">
                                                <div className="music-bar-sm"></div>
                                                <div className="music-bar-sm"></div>
                                                <div className="music-bar-sm"></div>
                                                <div className="music-bar-sm"></div>
                                                <div className="music-bar-sm"></div>
                                            </div>
                                        </div>
                                        <div className={`absolute ${isPlaying && `hidden group-hover:flex`} flex bg-black inset-0 bg-opacity-40 items-center justify-center`}>
                                            <button className="p-6 flex justify-center items-center h-full m-auto w-full text-white" onClick={togglePlay}>{isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}</button>
                                        </div> */}
                                    </div>
                                    <div data-aos="fade-left" className="flex flex-col">
                                        <p className="lg:text-4xl md:text-3xl text-2xl font-semibold my-1">{data?.playlist.name}</p>
                                        <p dangerouslySetInnerHTML={{ __html: data?.playlist.description }} className="text-gray-400 lg:text-base md:text-base text-sm mt-1 max-w-md"></p>

                                        <div className="flex items-center text-white my-2 flex-wrap">
                                            <div>
                                                {userData?.following ? <AiFillHeart onClick={handleUnfollowPlaylist} className="text-pink-500 cursor-pointer" size={24} /> : <AiOutlineHeart onClick={handleFollowPlaylist} className="text-pink-500 cursor-pointer" size={24} />}
                                            </div>&nbsp;·&nbsp;
                                            <Link to={`/user?user_id=${data?.playlist.owner.id}`} className="text-green-500 hover:underline text-sm">By {data?.playlist.owner.display_name}</Link> &nbsp;·&nbsp;
                                            <p className="text-gray-200 hover:text-gray-400 text-sm font-medium">{formatWithCommas(data?.playlist.followers.total)} Likes</p> &nbsp;·&nbsp;
                                            <p className="text-gray-200 hover:text-gray-400 text-sm font-medium">{data?.playlist.tracks.total} Songs</p>
                                            &nbsp;·&nbsp;
                                            <p className="text-blue-500 hover:text-gray-400 text-sm font-medium">({data?.playlist.public ? "public" : "private"})</p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3">
                                            <Link target="_blank" to={"https://open.spotify.com/playlist/" + data?.playlist.id}><button className="bg-green-500 hover:bg-green-600 text-black rounded-full text-xs px-4 py-1.5">Play on Spotify</button></Link>
                                            <Link to={`/recommendations/${data?.playlist.id}`}>
                                                <button className="bg-gray-800 hover:bg-gray-700 text-white rounded-full text-xs px-4 py-1.5">Get Recomendations</button>
                                            </Link>
                                            {!isLoading && data?.playlist && userData?.user.id === data?.playlist.owner.id && <button onClick={async () => {
                                                if (confirm("Are you sure you want to delete this playlist?")) {
                                                    await deletePlaylist(playlistId);
                                                    navigate('/playlists');
                                                    queryClient.invalidateQueries(['playlists']);
                                                }
                                            }} className="text-red-500 px-4 py-1.5 -ml-1">
                                                <FaTrash size={18} />
                                            </button>}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                }


                {
                    !playListLoading && <>
                        <div data-aos="fade-up">
                            <p className="lg:text-3xl text-2xl font-semibold mt-12">Tracks</p>
                        </div>
                        <div className="flex flex-wrap divide-y divide-gray-800 gap-5 my-10">
                            {data?.tracks.map((track: any, i: number) => (
                                <PlayableTrack setCurrentlyPlaying={() => {
                                    setCurrentTrack(i);
                                    togglePlay();
                                    setIsPlaying(true);
                                }}
                                    pauseTrack={togglePlay}
                                    isPlaying={isPlaying}
                                    currenltyPlaying={currentTrack === i}
                                    key={i}
                                    trackId={track.track.id}
                                    trackAlbum={track.track.album.name} trackArtists={track.track.album.artists}
                                    trackDuration={track.track.duration_ms}
                                    trackPlayedAt={""}
                                    trackImage={track.track.album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : track.track.album.images[1]?.url} trackName={track.track.name === "" ? "Unavailable" : track.track.name} tractAlbumId={track.track.album.id} />
                            ))}
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default Playlist;