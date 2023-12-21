import { FunctionComponent, useEffect, useState, useRef } from "react";
import { getTopTracks } from "../spotify";
import Loader from "../components/Loader";
import PlayableTrack from "../components/PlayableTrack";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ErrorFallback from '../components/ErrorFallback'
import { useNavContext } from "../context/NavContext";
import AudioPlayer from 'react-h5-audio-player';

const Tracks: FunctionComponent = (): React.ReactNode => {
    const playerRef = useRef<any>(null);
    const [searchParams, setSearchParams] = useSearchParams({ duration: "short_term" });
    const { setNavTitle } = useNavContext();

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

    const { data, isError, isLoading, refetch } = useQuery({
        staleTime: 1000 * 60 * 20,
        queryKey: ['top-tracks', searchParams.get('duration')],
        queryFn: async () => {
            const res = await getTopTracks(searchParams.get('duration') as string);
            return res.data.items;
        },
    });

    const handleChange = (e: any) => {
        setSearchParams(prev => {
            prev.set('duration', e.target.value);
            return prev;
        }, { replace: true });
    }

    useEffect(() => {
        document.title = `Top Tracks • mix.me`;
        setNavTitle(`Top Tracks`);
    }, [])


    return (
        <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
            <div className="flex justify-between items-start">
                <div data-aos="fade-right">
                    <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Tracks</p>
                    <p className="text-gray-500 lg:text-base md:text-base text-xs">Your top tracks</p>
                </div>
                <select onChange={handleChange} value={searchParams.get("duration") as string} name="term" id="term" className="bg-transparent cursor-pointer text-green-500 border p-2 rounded-full border-green-500 outline-none">
                    <option className="bg-gray-900 border-none p-1 text-white" value="short_term">Last 4 Weeks</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="medium_term">Last 6 Months</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="long_term">All Time</option>
                </select>
            </div>

            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} />
                : <div>
                    <div>
                        <AudioPlayer
                            ref={playerRef}
                            src={data[currentTrack].preview_url}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => {
                                if (currentTrack < data.length - 1) {
                                    setCurrentTrack(currentTrack + 1);
                                } else {
                                    setCurrentTrack(0);
                                }
                            }}
                            className="hidden"
                        />
                    </div>


                    <div className="flex flex-wrap my-10">
                        {data.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.map((track: any, i: number) => (
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
        </div>
    );
}

export default Tracks;