import { FunctionComponent, useEffect, useState, useRef } from "react";
import { formatDuration, getYear, parsePitchClass } from '../utils';
import { getTrackInfo } from '../spotify';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import { useNavContext } from "../context/NavContext";
import AudioPlayer from 'react-h5-audio-player';
import { FaPlay, FaPause } from "react-icons/fa";

const Track: FunctionComponent = () => {
    const playerRef = useRef<any>(null);
    const { trackId }: any = useParams();
    const { setNavTitle } = useNavContext();
    const [isPlaying, setIsPlaying] = useState(false);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['track', trackId],
        staleTime: Infinity,
        queryFn: async () => {
            const res = await getTrackInfo(trackId);
            return { track: res.track, audioFeatures: res.audioFeatures, audioAnalysis: res.audioAnalysis };
        }
    })

    useEffect(() => {
        document.title = `${isLoading ? "Track" : data?.track.name} • mix.me`;
        setNavTitle(`${isLoading ? "Track" : data?.track.name}`);
    }, [data?.track]);

    const getPlayableSong = () => {
        let idx = 0;
        while (idx < 10) {
            if (data?.track.preview_url) {
                // console.log(topTracks[idx].preview_url);
                return data?.track.preview_url;
            } else {
                idx++;
            }
        }
    }

    const togglePlay = () => {
        const audio = playerRef.current.audio.current;
        if (isPlaying) {
            audio.pause();
            localStorage.setItem('playerState', JSON.stringify({ isPlaying: false }));
        } else {
            audio.play();
            localStorage.setItem('playerState', JSON.stringify({ isPlaying: true }));
        }
    };


    return (
        <div>
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> :
                <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                    <div className="flex lg:flex-row md:flex-row flex-col lg:gap-10 md:gap-7 gap-5">
                        {/* <audio loop autoPlay>
                            <source src={getPlayableSong()}></source>
                        </audio> */}
                        <div className="relative w-fit h-fit group">
                            <img data-aos="zoom-in" className="lg:h-56 md:h-56 h-56 lg:w-56 md:w-56 w-56" src={data?.track.album.images[0].url} alt="Album Artwork" />
                            <div className={`absolute group-hover:hidden inset-0 bg-black bg-opacity-30 ${isPlaying ? 'flex' : 'hidden'} items-center justify-center`}>
                                <div className="flex items-end justify-center space-x-1.5 h-[3.5rem]">
                                    <div className="music-bar-sm"></div>
                                    <div className="music-bar-sm"></div>
                                    <div className="music-bar-sm"></div>
                                    <div className="music-bar-sm"></div>
                                    <div className="music-bar-sm"></div>
                                </div>
                            </div>
                            <div className={`absolute ${isPlaying && `hidden group-hover:flex`} flex bg-black inset-0 bg-opacity-40 items-center justify-center`}>
                                <button className="p-6 text-white" onClick={togglePlay}>{isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}</button>
                            </div>
                        </div>
                        <div data-aos="fade-left">
                            <p className="lg:text-4xl md:text-3xl text-2xl font-bold">{data?.track.name} {data?.track.explicit && <span className="text-blue-500 text-lg font-medium px-1.5 py-1 bg-blue-600 bg-opacity-30 rounded-md">E</span>}</p>
                            <p className="lg:text-xl md:text-xl text-lg font-semibold text-gray-400 lg:my-3 md:my-2 my-1">By {data?.track.album.artists.map((artist: any, i: number) => (
                                <React.Fragment key={artist.id}>
                                    {i > 0 && ', '}
                                    <Link className="hover:underline text-gray-400 hover:text-green-500" to={`/artist/${artist.id}`}>
                                        {artist.name}
                                    </Link>
                                </React.Fragment>
                            ))}</p>
                            <p className="text-gray-400 lg:text-base md:text-base text-sm mb-4"><Link className="hover:underline hover:text-green-500" to={`/album/${data?.track.album.id}`}>{data?.track.album.name}</Link> &nbsp;·&nbsp; {getYear(data?.track.album.release_date)}</p>
                            <a href={data?.track.album.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer">
                                <button className="px-6 py-2 bg-green-500 text-black text-sm rounded-full hover:bg-green-600">
                                    PLAY ON SPOTIFY
                                </button>
                            </a>
                        </div>
                    </div>

                    <div>
                        <AudioPlayer
                            ref={playerRef}
                            autoPlay={localStorage.getItem('playerState') ? JSON.parse(localStorage.getItem('playerState')!).isPlaying : false}
                            src={getPlayableSong()}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            loop={true}
                            className="hidden"
                        />
                    </div>


                    <div className="py-20">
                        <h3 className="pb-3 text-left text-2xl font-semibold text-green-500">Audio Analysis</h3>
                        <div className="grid text-gray-300 w-full mb-0 text-center border border-t-gray-500 border-l-gray-500 border-b-0 border-r-0 lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)]">

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">{formatDuration(data?.audioFeatures.duration_ms)}</div>
                                <div className="text-gray-400">Duration</div>
                            </div>
                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">{parsePitchClass(data?.audioFeatures.key)}</div>
                                <div className="text-gray-400">Key</div>
                            </div>
                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.mode === 1 ? 'Major' : 'Minor'}
                                </div>
                                <div className="text-gray-400">
                                    Modality
                                </div>
                            </div>
                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.time_signature}
                                </div>
                                <div className="text-gray-400">
                                    Time Signature
                                </div>
                            </div>
                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {Math.round(data?.audioFeatures.tempo)}
                                </div>
                                <div className="text-gray-400">
                                    Tempo (BPM)
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.track.popularity}%
                                </div>
                                <div className="text-gray-400">
                                    Popularity
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioAnalysis.bars.length}
                                </div>
                                <div className="text-gray-400">
                                    Bars
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioAnalysis.beats.length}
                                </div>
                                <div className="text-gray-400">
                                    Beats
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioAnalysis.sections.length}
                                </div>
                                <div className="text-gray-400">
                                    Sections
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioAnalysis.segments.length}
                                </div>
                                <div className="text-gray-400">
                                    Segments
                                </div>
                            </div>
                        </div>

                        <h3 className="pb-3 text-left text-2xl font-semibold text-green-500 mt-20">Audio Features</h3>

                        <div className="grid text-gray-300 w-full mb-0 text-center border border-t-gray-500 border-l-gray-500 border-b-0 border-r-0 lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)]">
                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.acousticness.toFixed(2)}
                                </div>
                                <div className="text-gray-400">
                                    Acousticness
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.danceability.toFixed(2)}
                                </div>
                                <div className="text-gray-400">
                                    Danceability
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.energy.toFixed(2)}
                                </div>
                                <div className="text-gray-400">
                                    Energy
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.loudness.toFixed(2)}
                                </div>
                                <div className="text-gray-400">
                                    Loudness
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.instrumentalness.toFixed(4)}
                                </div>
                                <div className="text-gray-400">
                                    Instrumentalnes
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.mode}
                                </div>
                                <div className="text-gray-400">
                                    Mode
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.liveness}
                                </div>
                                <div className="text-gray-400">
                                    Liveness
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.key}
                                </div>
                                <div className="text-gray-400">
                                    Key
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.speechiness.toFixed(3)}
                                </div>
                                <div className="text-gray-400">
                                    Speechiness
                                </div>
                            </div>

                            <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {data?.audioFeatures.valence.toFixed(3)}
                                </div>
                                <div className="text-gray-400">
                                    Valence
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default Track;