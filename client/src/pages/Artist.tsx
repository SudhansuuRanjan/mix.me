import { FunctionComponent, useState, useEffect } from "react";
import { getArtist, doesUserFollowArtist, followArtist, unfollowArtist, getArtistTopTracks, getArtistAlbums } from "../spotify";
import Loader from "../components/Loader";
import { catchErrors, formatWithCommas } from "../utils";
import Track from "../components/Track";
import { Link, useParams } from "react-router-dom";


const Artist: FunctionComponent = () => {
    const [artist, setArtist] = useState<any>(null);
    const [userFollows, setUserFollows] = useState<boolean>(false);
    const [topTracks, setTopTracks] = useState<any>(null);
    const [albums, setAlbums] = useState<any>(null);
    const { artistId } : any = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getArtist(artistId);
            document.title = `${data.name} • SpotiStat`;
            // console.log(data);
            setArtist(data);
        };
        catchErrors(fetchData());
    }, [artistId]);

    useEffect(() => {
        const fetchArtistTopTracks = async () => {
            const { data } = await getArtistTopTracks(artistId);
            setTopTracks(data.tracks);
            // console.log(data.tracks);
        }
        catchErrors(fetchArtistTopTracks());
    }, [artistId])

    useEffect(() => {
        const fetchUserFollows = async () => {
            const { data } = await doesUserFollowArtist(artistId);
            setUserFollows(data[0]);
        }
        catchErrors(fetchUserFollows());
    }, [artistId])

    useEffect(() => {
        const fetchArtistAlbums = async () => {
            const { data } = await getArtistAlbums(artistId);
            setAlbums(data.items);
            // console.log(data.items);
        }
        catchErrors(fetchArtistAlbums());
    }, [artistId])

    const handleFollow = async () => {
        try {
            if (userFollows) {
                await unfollowArtist(artistId);
                setUserFollows(false);
            } else {
                await followArtist(artistId);
                setUserFollows(true);
            }
        } catch (error) {
            console.log(error);
        }
        return;
    }

    const getPlayableSong = () => {
        let idx = 0;
        while (idx < 10) {
            if (topTracks[idx].preview_url) {
                // console.log(topTracks[idx].preview_url);
                return topTracks[idx].preview_url;
            } else {
                idx++;
            }
        }
    }


    return (
        <div>
            {!artist ? <Loader /> :
                <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                    <div className="flex items-center justify-center flex-col">
                        <img src={artist.images[0].url} alt={artist.name} className="lg:h-64 md:h-52 w-48 lg:w-64 md:w-52 h-48 rounded-full" />
                        <a href={artist.external_urls.spotify} target="_blank" className="lg:text-6xl md:text-5xl text-4xl font-bold my-7 hover:text-green-500">{artist.name}</a>
                        <div className="mb-7">
                            <button onClick={handleFollow} className="text-white border px-9 py-2.5 rounded-full text-sm hover:text-black hover:bg-white">
                                {
                                    userFollows ? 'FOLLOWING' : 'FOLLOW'
                                }
                            </button>
                        </div>
                        <div className="flex flex-wrap justify-center mt-4 gap-24">
                            <div className="flex flex-col items-center">
                                <p className="text-blue-500 lg:text-3xl md:3xl text-2xl font-bold">{formatWithCommas(artist.followers.total)}</p>
                                <p className="text-gray-500">FOLLOWERS</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-blue-500 lg:text-3xl md:3xl text-2xl font-bold">{artist.popularity}%</p>
                                <p className="text-gray-500">POPULARITY</p>
                            </div>
                        </div>
                        <div className="my-10">
                            <div>
                                <p className="text-blue-500 lg:text-2xl md:2xl text-xl text-center font-bold">{artist.genres.length > 0 ? artist.genres.map((genre: any, i: number) => (
                                    genre + (i < artist.genres.length - 1 ? ', ' : '')
                                )) : 'Unavailable'}</p>
                                <p className="text-gray-500 text-center">GENRES</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <p className="lg:text-3xl text-2xl font-bold">Top Tracks</p>
                    </div>

                    {!topTracks ? <Loader /> : <div>
                        <div className="my-5">
                            <audio autoPlay loop>
                                <source src={getPlayableSong()}></source>
                            </audio>
                        </div>

                        <div className="flex flex-wrap gap-7 my-10">
                            {topTracks.map((track: any, i: number) => (
                                <Track key={i} trackId={track.id} trackAlbum={track.album.name} trackArtists={track.album.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={track.album.images[2]?.url} trackName={'#' + (i + 1) + " " + track.name} tractAlbumId={track.album.id} />
                            ))}
                        </div>
                    </div>
                    }


                    <div className="pt-10">
                        <p className="text-3xl font-extrabold">Albums</p>
                    </div>
                    <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                        {albums && albums.map((album: any, i: number) => (
                            <div key={i}>
                                <Link to={`/album/${album.id}`}>
                                    <div className="track-card">
                                        <img src={album.images[1].url ? album.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-md" alt="Album Cover" />
                                    </div>
                                </Link>
                                <p className="text-base font-semibold mt-2">{(album.name ? album.name : 'Playlist Unavailable')}</p>
                                <p className="text-xs text-green-500 my-1">By {
                                    album.artists.map((artist: any, i: number) => (
                                        <span key={i}>
                                            <Link className="hover:underline text-green-500" to={`/artist/${artist.id}`}>
                                                {artist.name}
                                            </Link>
                                            {(i < album.artists.length - 1 ? ', ' : '')}
                                        </span>
                                    ))
                                }</p>
                                <p className="text-sm text-gray-500">{album.total_tracks} {
                                    album.total_tracks > 1 ? 'SONGS' : 'SONG'
                                }</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}

export default Artist;