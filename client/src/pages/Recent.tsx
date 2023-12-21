import { FunctionComponent, useEffect, useState, useRef } from "react";
import { getRecentlyPlayed } from "../spotify";
import Loader from "../components/Loader";
import PlayableTrack from "../components/PlayableTrack";
import '../App.css'
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import { useNavContext } from "../context/NavContext";
import AudioPlayer from 'react-h5-audio-player';


const Recent: FunctionComponent = () => {
    const playerRef = useRef<any>(null);
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
        staleTime: 1000 * 60 * 3,
        queryKey: ['recently-played'],
        queryFn: async () => {
            const res = await getRecentlyPlayed();
            return res.data;
        },
    });

    useEffect(() => {
        document.title = `Recent • mix.me`;
        setNavTitle(`Recently Played`);
    }, []);

    return (
        <div>
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} />
                : <div className="m-auto w-full lg:px-24 md:px-12 px-6 mt-8 mb-16 text-white">
                    <div data-aos="fade-right" className="flex justify-between">
                        <div>
                            <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Recent streams</p>
                            <p className="text-gray-500 lg:text-base md:text-base text-xs">Your recently played tracks</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap my-10">
                        <div>
                            <AudioPlayer
                                ref={playerRef}
                                src={data.items[currentTrack].track.preview_url}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => {
                                    if (currentTrack < data.items.length - 1) {
                                        setCurrentTrack(currentTrack + 1);
                                    } else {
                                        setCurrentTrack(0);
                                    }
                                }}
                                className="hidden"
                            />
                        </div>
                        {data.items.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.items.map((recent: any, i: number) => (
                            <PlayableTrack
                                pauseTrack={togglePlay}
                                currenltyPlaying={currentTrack === i}
                                isPlaying={isPlaying}
                                setCurrentlyPlaying={() => {
                                    setCurrentTrack(i);
                                    togglePlay();
                                    setIsPlaying(true);
                                }} key={i} trackId={recent.track.id} trackAlbum={recent.track.album.name} trackArtists={recent.track.album.artists} trackDuration={recent.track.duration_ms} trackPlayedAt={recent.played_at} trackImage={recent.track.album.images[1].url} trackName={recent.track.name} tractAlbumId={recent.track.album.id} />
                        ))}
                    </div>
                </div>}
        </div>
    );
}

export default Recent;