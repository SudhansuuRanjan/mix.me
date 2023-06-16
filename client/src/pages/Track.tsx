import { FunctionComponent, useState, useEffect } from "react";
import { formatDuration, getYear, parsePitchClass, catchErrors } from '../utils';
import { getTrackInfo } from '../spotify';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import React from "react";

const Track: FunctionComponent = () => {

    const [track, setTrack] = useState<any>(null);
    const [audioFeatures, setAudioFeatures] = useState<any>(null);
    const [audioAnalysis, setAudioAnalysis] = useState<any>(null);

    // get track id from url
    const trackId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTrackInfo(trackId);
            // console.log(data);
            setTrack(data.track);
            setAudioFeatures(data.audioFeatures);
            setAudioAnalysis(data.audioAnalysis);
        };
        catchErrors(fetchData());
    }, [trackId]);

    return (
        <div>
            {!track ? <Loader /> : <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                <div className="flex lg:gap-10 md:gap-7 gap-5">
                    <div>
                        <img className="lg:h-56 md:h-56 h-32 lg:w-56 md:w-56 w-32" src={track.album.images[0].url} alt="Album Artwork" />
                    </div>
                    <div>
                        <p className="lg:text-4xl md:text-3xl text-2xl font-bold">{track.name}</p>
                        <p className="lg:text-xl text-xl font-semibold text-gray-400 lg:my-3 md:my-2 my-1">By {track.album.artists.map((artist: any, i: number) => (
                            <React.Fragment key={artist.id}>
                                {i > 0 && ', '}
                                <Link className="hover:underline text-gray-400 hover:text-green-500" to={`/artist/${artist.id}`}>
                                    {artist.name}
                                </Link>
                            </React.Fragment>
                        ))}</p>
                        <p className="text-gray-400 lg:text-base md:text-base text-sm mb-4"><Link className="hover:underline hover:text-green-500" to={`/album/${track.album.id}`}>{track.album.name}</Link> &nbsp;·&nbsp; {getYear(track.album.release_date)}</p>
                        <a href={track.album.external_urls.spotify}
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

                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">{formatDuration(audioFeatures.duration_ms)}</div>
                                <div>Duration</div>
                            </div>
                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">{parsePitchClass(audioFeatures.key)}</div>
                                <div>Key</div>
                            </div>
                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                   {audioFeatures.mode === 1 ? 'Major' : 'Minor'} 
                                </div>
                                <div>
                                    Modality
                                </div>
                            </div>
                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {audioFeatures.time_signature}
                                </div>
                                <div>
                                    Time Signature
                                </div>
                            </div>
                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {Math.round(audioFeatures.tempo)}
                                    </div>
                                <div>
                                    Tempo (BPM)
                                    </div>
                            </div>

                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                   {track.popularity}%
                                    </div>
                                <div>
                                    Popularity
                                    </div>
                            </div>

                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {audioAnalysis.bars.length}
                                    </div>
                                <div>
                                    Bars
                                    </div>
                            </div>

                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {audioAnalysis.beats.length}
                                    </div>
                                <div>
                                    Beats
                                    </div>
                            </div>

                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {audioAnalysis.sections.length}
                                    </div>
                                <div>
                                    Sections
                                    </div>
                            </div>

                            <div className="py-5 px-4 border border-b-gray-500 border-r-gray-500 border-t-0 border-l-0">
                                <div className="text-3xl font-bold">
                                    {audioAnalysis.segments.length}
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