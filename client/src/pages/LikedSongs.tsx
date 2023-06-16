import { FunctionComponent, useState, useEffect } from "react";
import { catchErrors } from "../utils";
import { getLikedSongs } from "../spotify";
import Loader from "../components/Loader";
import Track from "../components/Track";
import '../App.css'


const LikedSongs: FunctionComponent = () => {
    const [likedSongs, setLikedSongs] = useState<any>(null);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getLikedSongs(20, 0);
            // console.log(data);
            setLikedSongs(data.items);
            setTotal(data.total);
        };
        catchErrors(fetchData());
    }, []);

    const handleScroll = () => {
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (isAtBottom) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        // Add scroll event listener when the component is mounted
        window.addEventListener('scroll', handleScroll);
        return () => {
            // Clean up the scroll event listener when the component is unmounted
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Cleanup function
    useEffect(() => {
        if (currentPage * 20 + 20 < total) {
            const fetchData = async () => {
                const { data } = await getLikedSongs(20, currentPage * 20);
                // console.log(data);
                setLikedSongs((prevSongs: any) => [...prevSongs, ...data.items]);
            };
            catchErrors(fetchData());
        }
    }, [currentPage]);

    return (
        <div>
            {!likedSongs ? <Loader /> : <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                <div className="flex justify-between">
                    <div>
                        <p className="lg:text-3xl md:text-3xl text-2xl font-bold">Liked Songs</p>
                        <p className="text-gray-400">Your favourite tracks</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-5 my-10">
                    {likedSongs.map((recent: any, i: number) => (
                        <Track key={i} trackId={recent.track.id} trackAlbum={recent.track.album.name} trackArtists={recent.track.album.artists} trackDuration={recent.track.duration_ms} trackPlayedAt={recent.played_at} trackImage={recent.track.album.images[2].url} trackName={recent.track.name} tractAlbumId={recent.track.album.id} />
                    ))}
                </div>
            </div>}
        </div>
    );
}

export default LikedSongs;