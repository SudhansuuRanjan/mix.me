import { FunctionComponent, useEffect } from "react";
import { getRecentlyPlayed } from "../spotify";
import Loader from "../components/Loader";
import Track from "../components/Track";
import '../App.css'
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'


const Recent: FunctionComponent = () => {
    
    const { data, isError, isLoading, refetch } = useQuery({
        staleTime: 1000 * 60 * 3,
        queryKey: ['recently-played'],
        queryFn: async () => {
            const res = await getRecentlyPlayed();
            return res.data;
        },
    });

    useEffect(() => {
        document.title = `Recent • SpotiStat`;
    }, []);

    const getPlayableSong = () => {
        let idx = 0;
        while (idx < 10) {
            if (data.items.length !== 0 && data.items[idx].track.preview_url) {
                return data.items[idx].track.preview_url;
            } else {
                idx++;
            }
        }
    }

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

                    <div className="flex flex-wrap gap-5 my-10">
                        <audio autoPlay loop>
                            <source src={getPlayableSong()}></source>
                        </audio>
                        {data.items.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.items.map((recent: any, i: number) => (
                            <Track key={i} trackId={recent.track.id} trackAlbum={recent.track.album.name} trackArtists={recent.track.album.artists} trackDuration={recent.track.duration_ms} trackPlayedAt={recent.played_at} trackImage={recent.track.album.images[1].url} trackName={recent.track.name} tractAlbumId={recent.track.album.id} />
                        ))}
                    </div>
                </div>}
        </div>
    );
}

export default Recent;