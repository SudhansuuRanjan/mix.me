import { FunctionComponent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserInfo, logout, getLikedSongs } from "../spotify";
import { catchErrors } from "../utils";
import Loader from "../components/Loader";
import Track from "../components/Track";


const Profile: FunctionComponent = () => {
    const [user, setUser] = useState<any>(null);
    const [followedArtists, setFollowedArtists] = useState<any>(null);
    const [likedSongs, setLikedSongs] = useState<any>(null);
    const [playlists, setPlaylists] = useState<any>(null);
    const [topArtists, setTopArtists] = useState<any>(null);
    const [topTracks, setTopTracks] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { user, followedArtists, playlists, topArtists, topTracks } = await getUserInfo();
            setUser(user);
            document.title = `${user.display_name} • SpotiStat`;
            setFollowedArtists(followedArtists);
            setPlaylists(playlists);
            setTopArtists(topArtists);
            setTopTracks(topTracks.items);
            // console.log(user, followedArtists, playlists, topArtists, topTracks);
        };
        catchErrors(fetchData());
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getLikedSongs(20, 0);
            // console.log(data);
            setLikedSongs(data.items);
        };
        catchErrors(fetchData());
    }, []);

    const totalPlaylists = playlists ? playlists.total : 0;

    return (
        <div className="w-full pb-16">
            {!user ? <Loader /> : (
                <div className="m-auto w-full flex flex-col items-center justify-center">
                    {/* profile */}
                    <div className="m-auto mt-16 flex flex-col items-center justify-center">
                        <div>
                            <img src={user.images[0].url} className="lg:h-44 h-36 w-36 lg:w-44 rounded-full" alt="Avatar" />
                        </div>
                        <div className="text-center">
                            <a href={`https://open.spotify.com/user/${user.id}`} target="_blank"><p className="lg:text-5xl md:text-4xl text-3xl font-bold my-3 hover:text-green-500">{user.display_name}</p></a>
                            <div className="flex justify-center gap-6 items-center mt-3">
                                <div>
                                    <p className="text-xl font-semibold text-green-500">{user.followers.total}</p>
                                    <p className="text-sm text-gray-500">FOLLOWERS</p>
                                </div>

                                <div>
                                    <p className="text-xl font-semibold text-green-500">{followedArtists && followedArtists.artists.items.length}</p>
                                    <p className="text-sm text-gray-500">FOLLOWING</p>
                                </div>

                                <div>
                                    <p className="text-xl font-semibold text-green-500">{totalPlaylists}</p>
                                    <p className="text-sm text-gray-500">PLAYLISTS</p>
                                </div>
                            </div>

                            <div className="my-10">
                                <button onClick={logout} className="text-white border px-9 py-2.5 rounded-full text-sm hover:text-black hover:bg-white">
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Top Tracks */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <div className="flex justify-between">
                            <div>
                                <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Tracks</p>
                                <p className="text-gray-400">Your top tracks of all time</p>
                            </div>
                            <Link to="/tracks">
                                <button className="text-white border px-5 py-2 rounded-full text-xs hover:text-black hover:bg-white">
                                    SEE MORE
                                </button>
                            </Link>
                        </div>

                        <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                            {topTracks && topTracks.slice(0, 15).map((track: any, i: number) => (
                                <div key={i}>
                                    <div className="">
                                        <Link to={track.name ? `/track/${track.id}` : ''}>
                                            <div className="track-card aspect-square overflow-hidden">
                                                <img loading='lazy' src={track.album.images[1] ? track.album.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className=" rounded-md" alt="Album Cover" />
                                            </div>
                                        </Link>
                                        <Link to={track.name ? `/track/${track.id}` : ''} className="text-base font-semibold mt-2">{i + 1 + ". " + (track.name ? track.name : 'Track Unavailable')}</Link>
                                        <p className="text-sm">{track.artists.length > 0 ? track.artists.map((artist: any, i: number) => (
                                            <span key={i}>
                                                <Link className="text-gray-400 hover:text-green-500 hover:underline" to={`/artist/${artist.id}`}>{artist.name}</Link>
                                                {
                                                    (i < track.artists.length - 1 ? ", " : "")
                                                }
                                            </span>
                                        )) : 'Unavailable'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>


                    {/* Top Artists */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-2xl font-semibold">Top Artists</p>
                                <p className="text-gray-400">Your top artists of all time</p>
                            </div>
                            <Link to="/artists">
                                <button className="text-white border px-6 py-2 rounded-full text-xs hover:text-black hover:bg-white">
                                    SEE MORE
                                </button>
                            </Link>
                        </div>

                        <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                            {topArtists && topArtists.items.slice(0, 15).map((artist: any, i: number) => (
                                <Link key={i} to={`/artist/${artist.id}`}>
                                    <div>
                                        <div className="artist-card aspect-square overflow-hidden rounded-full">
                                            <img loading='lazy' src={artist.images[1] ? artist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-full" alt="Album Cover" />
                                        </div>
                                        <p className="text-lg text-center font-semibold mt-3">{i + 1 + ". " + (artist.name ? artist.name : 'Artist Unavailable')}</p>
                                        <p className="text-xs mt-2 text-center text-gray-500">{artist.genres.length > 0 ? artist.genres.map((genre: any, i: number) => (
                                            genre + (i < artist.genres.length - 1 ? ", " : "")
                                        )) : 'Unavailable'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                    </div>

                    {/* Playlists */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-2xl font-semibold">Playlists</p>
                                <p className="text-gray-400">Your playlists</p>
                            </div>
                            <Link to="/playlists">
                                <button className="text-white border px-6 py-2 rounded-full text-xs hover:text-black hover:bg-white">
                                    SEE MORE
                                </button>
                            </Link>
                        </div>

                        <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                            {playlists && playlists.items.slice(0, 10).map((playlist: any, i: number) => (
                                <div key={i}>
                                    <Link to={`/playlist/${playlist.id}`}>
                                        <div className="track-card">
                                            <img loading='lazy' src={playlist.images.length !== 0 ? playlist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-md" alt="Album Cover" />
                                        </div>
                                    </Link>
                                    <p className="text-base font-semibold mt-2">{(playlist.name ? playlist.name : 'Playlist Unavailable')}</p>
                                    <p className="text-xs text-green-500 my-1">By <a className="underline hover:text-blue-400" target="_blank" href={playlist.owner.external_urls.spotify}>{playlist.owner.display_name}</a></p>
                                    <p className="text-sm text-gray-500">{playlist.tracks.total} TRACKS</p>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-2xl font-semibold">Liked Songs</p>
                                <p className="text-gray-400">Your favoutite tracks</p>
                            </div>
                            <Link to="/liked">
                                <button className="text-white border px-6 py-2 rounded-full text-xs hover:text-black hover:bg-white">
                                    SEE MORE
                                </button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-5 my-10">
                            {likedSongs && likedSongs.slice(0, 10).map((recent: any, i: number) => (
                                <Track key={i} trackId={recent.track.id} trackAlbum={recent.track.album.name} trackArtists={recent.track.album.artists} trackDuration={recent.track.duration_ms} trackPlayedAt={recent.played_at} trackImage={recent.track.album.images[2].url} trackName={recent.track.name} tractAlbumId={recent.track.album.id} />
                            ))}
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Profile;