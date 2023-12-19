import { FunctionComponent, useEffect, useState, useRef } from "react";
import { getArtist, doesUserFollowArtistorUser, followUserOrArtist, unfollowUserOrArtist, getArtistTopTracks, search } from "../spotify";
import Loader from "../components/Loader";
import { formatWithCommas } from "../utils";
import Track from "../components/Track";
import PlayableTrack from "../components/PlayableTrack";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import AlbumCard from "../components/AlbumCard";
import PlaylistCard from "../components/PlaylistCard";
import { useNavContext } from "../context/NavContext";
import AudioPlayer from 'react-h5-audio-player';


const Artist: FunctionComponent = () => {
    const playerRef = useRef<any>(null);
    const { artistId }: any = useParams();
    const { setNavTitle } = useNavContext();
    const [filter, setFilter] = useState("album");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
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

    const { data: artist, isLoading: artistLoading, isError: artistError, refetch: artistRefetch } = useQuery({
        queryKey: ['artist', artistId],
        staleTime: Infinity,
        queryFn: async () => {
            const res = await getArtist(artistId);
            return res.data;
        },
    });

    const { data: userFollows, isLoading: userFollowsLoading, refetch: userFollowsRefetch } = useQuery({
        queryKey: ['user-follows', artistId],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await doesUserFollowArtistorUser(artistId, "artist");
            return res.data[0];
        },
    });

    const { data: topTracks, isLoading: artistTopTracksLoading, isError: artistTopTracksError, refetch: topTracksRefetch } = useQuery({
        queryKey: ['artist-top-tracks', artistId],
        staleTime: Infinity,
        queryFn: async () => {
            const res = await getArtistTopTracks(artistId);
            return res.data.tracks;
        }
    })

    const getArtistItems = async (type: string, artistName: string) => {
        setLoading(true);
        try {
            const res = await search(artistName, type);
            setData(res.data);
            // console.log(res.data);
            setLoading(false);
        } catch (error) {
            // console.log(error);
            setLoading(false);
            setError(true);
        }
    }
    useEffect(() => {
        document.title = `${artistLoading ? "Artist" : artist.name} • mix.me`;
        setNavTitle(artistLoading ? "Artist" : artist.name);
        if (artist) {
            getArtistItems(filter, artist.name);
        }
    }, [artist, filter]);

    const handleFollow = useMutation({
        mutationFn: async () => userFollows ? await unfollowUserOrArtist(artistId, "artist") : await followUserOrArtist(artistId, "artist"),
        onSuccess: () => {
            userFollowsRefetch();
        }
    })

    return (
        <div>
            {artistLoading ? <Loader /> : artistError ? <ErrorFallback refetch={artistRefetch} /> :
                <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                    <div className="flex items-center justify-center flex-col">
                        <img data-aos="zoom-in" src={artist.images[0].url} alt={artist.name} className="lg:h-64 md:h-52 w-48 lg:w-64 md:w-52 h-48 rounded-full" />
                        <a data-aos="fade-up" href={artist.external_urls.spotify} target="_blank" className="lg:text-6xl md:text-5xl text-4xl font-bold my-7 hover:text-green-500">{artist.name}</a>
                        <div data-aos="fade-up" className="mb-7">
                            <button onClick={() => handleFollow.mutate()} className="text-white border px-9 py-2.5 rounded-full text-sm hover:text-black hover:bg-white">
                                {
                                    !userFollowsLoading && userFollows ? 'FOLLOWING' : 'FOLLOW'
                                }
                            </button>
                        </div>
                        <div data-aos="fade-in" className="flex flex-wrap justify-center mt-4 gap-24">
                            <div className="flex flex-col items-center">
                                <p className="text-blue-500 lg:text-3xl md:3xl text-2xl font-black">{formatWithCommas(artist.followers.total)}</p>
                                <p className="text-gray-500">FOLLOWERS</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-blue-500 lg:text-3xl md:3xl text-2xl font-bold">{artist.popularity}%</p>
                                <p className="text-gray-500">POPULARITY</p>
                            </div>
                        </div>
                        <div data-aos="fade-in" className="my-10">
                            <div>
                                <p className="text-blue-500 lg:text-2xl md:2xl text-xl text-center font-bold">{artist.genres.length > 0 ? artist.genres.map((genre: any, i: number) => (
                                    genre + (i < artist.genres.length - 1 ? ', ' : '')
                                )) : 'Unavailable'}</p>
                                <p className="text-gray-500 text-center">GENRES</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <p data-aos="fade-up" className="lg:text-3xl text-2xl font-bold">Top Tracks</p>
                    </div>

                    {
                        artistTopTracksLoading ? <Loader /> : artistTopTracksError ? <ErrorFallback refetch={topTracksRefetch} /> : <div>
                            <div>
                                <AudioPlayer
                                    ref={playerRef}
                                    src={topTracks[currentTrack].preview_url}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => {
                                        if (currentTrack < topTracks.length - 1) {
                                            setCurrentTrack(currentTrack + 1);
                                        } else {
                                            setCurrentTrack(0);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </div>

                            <div className="flex flex-wrap gap-7 my-10">
                                {topTracks.map((track: any, i: number) => (
                                    <PlayableTrack
                                        pauseTrack={togglePlay}
                                        currenltyPlaying={currentTrack === i}
                                        isPlaying={isPlaying}
                                        setCurrentlyPlaying={() => {
                                            setCurrentTrack(i);
                                            togglePlay();
                                            setIsPlaying(true);
                                        }} key={i} trackId={track.id} trackAlbum={track.album.name} trackArtists={track.album.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={track.album.images[1]?.url} trackName={'#' + (i + 1) + " " + track.name} tractAlbumId={track.album.id} />
                                ))}
                            </div>
                        </div>
                    }


                    <div data-aos="fade-up" className="pt-10">
                        <p className="text-3xl font-extrabold">Discography</p>

                        <div className="flex text-sm font-medium mt-5 gap-2">
                            <button onClick={() => setFilter("album")} className={`px-4 py-1.5 rounded-full ${filter === "album" ? "bg-green-500 text-black" : "bg-gray-700 font-normal text-white bg-opacity-40"
                                }`}>
                                Albums
                            </button>
                            <button onClick={() => setFilter("playlist")} className={`px-4 py-1.5 rounded-full ${filter === "playlist" ? "bg-green-500 text-black" : "bg-gray-700 font-normal text-white bg-opacity-40"
                                }`} >
                                Playlists
                            </button>
                            <button onClick={() => setFilter("track")} className={`px-4 py-1.5 rounded-full ${filter === "track" ? "bg-green-500 text-black" : "bg-gray-700 font-normal text-white bg-opacity-40"
                                }`}>
                                Tracks
                            </button>
                        </div>
                    </div>

                    <div className="m-auto w-full py-10">
                        {
                            error ? <ErrorFallback refetch={() => { }} /> :
                                loading ? <Loader /> :
                                    <div className="mb-24 mt-8">
                                        {
                                            filter === "track" && data?.tracks?.items.length === 0 ? <div className="text-center text-green-500 w-full py-16">No items.</div> : <div className="flex flex-wrap gap-5"> {data?.tracks?.items.map((track: any) => (
                                                <Track key={track.id} trackId={track.id} trackImage={track.album.images[1].url} trackName={track.name} trackArtists={track.artists} trackAlbum={track.album.name} trackDuration={track.duration_ms} trackPlayedAt={track.played_at} tractAlbumId={track.album.id} />
                                            ))}
                                            </div>
                                        }
                                        {
                                            filter === "playlist" && data?.playlists?.items.length === 0 ? <div className="text-center text-green-500 w-full py-16">No items.</div> : <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6">
                                                {data?.playlists?.items.slice(0, 20).map((playlist: any, i: number) => (
                                                    <PlaylistCard key={playlist.id} i={i} playlist={playlist} />
                                                ))}
                                            </div>
                                        }
                                        {
                                            filter === "album" && data?.albums?.items.length === 0 ? <div className="text-center text-green-500 w-full py-16">No items.</div> : <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6">
                                                {data?.albums?.items.slice(0, 20).map((album: any) => (
                                                    <AlbumCard key={album.id} album={album} />
                                                ))}
                                            </div>
                                        }
                                    </div>
                        }
                    </div>

                </div>
            }
        </div>
    );
}

export default Artist;