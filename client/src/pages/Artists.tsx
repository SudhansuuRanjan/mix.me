import { FunctionComponent, useEffect } from "react";
import { getTopArtists } from "../spotify";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import ArtistCard from "../components/ArtistCard";
import { useNavContext } from "../context/NavContext";

const Artists: FunctionComponent = (): React.ReactNode => {
    const [searchParams, setSearchParams] = useSearchParams({ duration: "short_term" });
    const { setNavTitle } = useNavContext();

    const { data, isError, isLoading, refetch } = useQuery({
        staleTime: 1000 * 60 * 20,
        queryKey: ['top-artists', searchParams.get('duration')],
        queryFn: async () => {
            const res = await getTopArtists(searchParams.get('duration') as string);
            return res.data;
        },
    });

    const handleChange = (e: any) => {
        setSearchParams(prev => {
            prev.set('duration', e.target.value);
            return prev;
        }, { replace: true });
    }

    useEffect(() => {
        document.title = `Top Artists • mix.me`;
        setNavTitle(`Top Artists`);
    }, [])

    return (
        <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
            <div className="flex justify-between items-start">
                <div data-aos="fade-right">
                    <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Artists</p>
                    <p className="text-gray-500 lg:text-base md:text-base text-xs">Your top artists</p>
                </div>
                <select onChange={handleChange} value={searchParams.get("duration") as string} name="term" id="term" className="bg-transparent cursor-pointer text-green-500 border px-2 py-1.5 rounded-full border-green-500 outline-none">
                    <option className="bg-gray-900 border-none p-1 text-white" value="short_term">Last 4 Weeks</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="medium_term">Last 6 Months</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="long_term">All Time</option>
                </select>
            </div>

            {isLoading ? <Loader />
                : isError ? <ErrorFallback refetch={refetch} />
                    : <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-4 my-10">
                        {data.items.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.items.map((artist: any, i: number) => (
                            <ArtistCard i={i} key={i} artist={artist} />
                        ))}
                    </div>}
        </div>
    );
}

export default Artists;