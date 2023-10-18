import { FunctionComponent, useEffect } from "react";
import { formatDuration, getYear, parsePitchClass } from '../utils';
import { getTrackInfo } from '../spotify';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'


const Track: FunctionComponent = () => {
    const { trackId }: any = useParams();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['track', trackId],
        staleTime: Infinity,
        queryFn: async () => {
            const res = await getTrackInfo(trackId);
            return { track: res.track, audioFeatures: res.audioFeatures, audioAnalysis: res.audioAnalysis };
        }
    })

    useEffect(() => {
        document.title = `${isLoading ? "Track" : data?.track.name} • SpotiStat`;
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

    return (
        <div>
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> : <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                <div className="flex lg:flex-row md:flex-row flex-col lg:gap-10 md:gap-7 gap-5">
                    <audio loop autoPlay>
                        <source src={getPlayableSong()}></source>
                    </audio>
                    <div>
                        <img data-aos="zoom-in" className="lg:h-56 md:h-56 h-56 lg:w-56 md:w-56 w-56" src={data?.track.album.images[0].url} alt="Album Artwork" />
                    </div>
                    <div data-aos="fade-left">
                        <p className="lg:text-4xl md:text-3xl text-2xl font-bold">{data?.track.name}</p>
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
                            <button className="px-6 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600">
                                PLAY ON SPOTIFY
                            </button>
                        </a>
                    </div>
                </div>


                <div className="my-16">
                    <div className="grid text-gray-300 w-full mb-0 text-center border border-t-gray-500 border-l-gray-500 border-b-0 border-r-0 lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)]">

                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">{formatDuration(data?.audioFeatures.duration_ms)}</div>
                            <div>Duration</div>
                        </div>
                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">{parsePitchClass(data?.audioFeatures.key)}</div>
                            <div>Key</div>
                        </div>
                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {data?.audioFeatures.mode === 1 ? 'Major' : 'Minor'}
                            </div>
                            <div>
                                Modality
                            </div>
                        </div>
                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {data?.audioFeatures.time_signature}
                            </div>
                            <div>
                                Time Signature
                            </div>
                        </div>
                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {Math.round(data?.audioFeatures.tempo)}
                            </div>
                            <div>
                                Tempo (BPM)
                            </div>
                        </div>

                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {data?.track.popularity}%
                            </div>
                            <div>
                                Popularity
                            </div>
                        </div>

                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {data?.audioAnalysis.bars.length}
                            </div>
                            <div>
                                Bars
                            </div>
                        </div>

                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {data?.audioAnalysis.beats.length}
                            </div>
                            <div>
                                Beats
                            </div>
                        </div>

                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {data?.audioAnalysis.sections.length}
                            </div>
                            <div>
                                Sections
                            </div>
                        </div>

                        <div data-aos="zoom-in" className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                            <div className="text-3xl font-bold">
                                {data?.audioAnalysis.segments.length}
                            </div>
                            <div>
                                Segments
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default Track;