import { FunctionComponent, useState, useEffect, useRef } from "react";
import { catchErrors } from "../utils";
import { getLikedSongs } from "../spotify";
import Loader from "../components/Loader";
import PlayableTrack from "../components/PlayableTrack";
import '../App.css'
import { useNavContext } from "../context/NavContext";
import AudioPlayer from 'react-h5-audio-player';

const LikedSongs: FunctionComponent = () => {
    const playerRef = useRef<any>(null);
    const { setNavTitle } = useNavContext();
    const [likedSongs, setLikedSongs] = useState<any>(null);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);
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

    useEffect(() => {
        document.title = "Liked Songs • mix.me";
        setNavTitle(`Liked Songs`);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getLikedSongs(20, 0);
            setLikedSongs(data.items);
            // console.log(data.items);
            setTotal(data.total);
        };
        catchErrors(fetchData());
    }, []);

    const handleScroll = () => {
        if (typeof window !== 'undefined') {
            // Calculate the distance from the top to the bottom of the page
            const pageHeight = document.documentElement.scrollHeight;
            // Calculate the current position of the bottom of the viewport
            const bottomOfViewport = window.innerHeight + window.scrollY;

            // Check if we have reached the bottom of the page
            if (bottomOfViewport >= pageHeight - 100) {
                // Increment the current page number
                setCurrentPage((prevPage) => prevPage + 1);
            }
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    useEffect(() => {
        if (currentPage * 20 + 20 < total) {
            const fetchData = async () => {
                const { data } = await getLikedSongs(20, currentPage * 20);
                setLikedSongs((prevSongs: any) => [...prevSongs, ...data.items]);
            };
            catchErrors(fetchData());
        }
    }, [currentPage]);

    return (
        <div>
            {!likedSongs ? (
                <Loader />
            ) : (
                <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
                    <div data-aos="fade-right" className="flex justify-between">
                        <div>
                            <p className="lg:text-2xl md:text-2xl text-xl font-semibold">
                                Liked Songs
                            </p>
                            <p className="text-gray-500 lg:text-base md:text-base text-xs">Your favourite tracks</p>
                        </div>
                    </div>

                    <div>
                        <AudioPlayer
                            ref={playerRef}
                            src={likedSongs[currentTrack].track.preview_url}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => {
                                if (currentTrack < likedSongs.length - 1) {
                                    setCurrentTrack(currentTrack + 1);
                                } else {
                                    setCurrentTrack(0);
                                }
                            }}
                            className="hidden"
                        />
                    </div>

                    <div className="flex flex-wrap my-10">
                        {likedSongs.length === 0 ? <p className="text-center w-full py-16">No items.</p> : likedSongs.map((recent: any, i: number) => (
                            <PlayableTrack
                                pauseTrack={togglePlay}
                                currenltyPlaying={currentTrack === i}
                                isPlaying={isPlaying}
                                setCurrentlyPlaying={() => {
                                    setCurrentTrack(i);
                                    togglePlay();
                                    setIsPlaying(true);
                                }}
                                key={i}
                                trackId={recent.track.id}
                                trackAlbum={recent.track.album.name}
                                trackArtists={recent.track.album.artists}
                                trackDuration={recent.track.duration_ms}
                                trackPlayedAt={recent.played_at}
                                trackImage={recent.track.album.images.length !== 0 ? recent.track.album.images[1].url : "https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg"}
                                trackName={recent.track.name}
                                tractAlbumId={recent.track.album.id}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikedSongs;
