import { FunctionComponent, useEffect } from "react";
import { getPlaylists } from "../spotify";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import PlaylistCard from "../components/PlaylistCard";

const Playlists: FunctionComponent = () => {

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['playlists'],
        queryFn: async () => {
            const res = await getPlaylists();
            return res.data;
        },
    });

    useEffect(() => {
        document.title = `Playlists • SpotiStat`;
    }, [])

    return (
        <div className="m-auto w-full flex flex-col items-center justify-center">
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} />
                : <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
                    <div data-aos="fade-right" className="flex justify-between">
                        <div>
                            <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Playlists</p>
                            <p className="text-gray-500 lg:text-base md:text-base text-xs">Your playlists</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                        {data.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.items.map((playlist: any, i: number) => (
                            <PlaylistCard key={i} playlist={playlist} />
                        ))}
                    </div>
                </div>}
        </div>
    );
}

export default Playlists;