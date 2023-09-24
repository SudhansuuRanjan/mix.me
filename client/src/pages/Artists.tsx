import { FunctionComponent, useEffect } from "react";
import { getTopArtists } from "../spotify";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'

const Artists: FunctionComponent = (): React.ReactNode => {
    const [searchParams, setSearchParams] = useSearchParams({ duration: "short_term" });

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
        document.title = `Top Artists • SpotiStat`;
    }, [])

    return (
        <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
            <div className="flex justify-between  items-center">
                <div>
                    <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Artists</p>
                    <p className="text-gray-500 lg:text-base md:text-base text-xs">Your top artists</p>
                </div>
                <select onChange={handleChange} value={searchParams.get("duration") as string} name="term" id="term" className="bg-transparent text-green-500 border-none  outline-none">
                    <option className="bg-gray-900 border-none p-1 text-white" value="short_term">Last 4 Weeks</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="medium_term">Last 6 Months</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="long_term">All Time</option>
                </select>
            </div>

            {isLoading ? <Loader />
                : isError ? <ErrorFallback refetch={refetch} />
                    : <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                        {data.items.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.items.map((artist: any, i: number) => (
                            <Link key={i} to={`/artist/${artist.id}`}>
                                <div>
                                    <div className="artist-card aspect-square overflow-hidden rounded-full">
                                        <img src={artist.images[1] ? artist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-full" alt="Album Cover" />
                                    </div>
                                    <p className="text-lg text-center font-semibold mt-3">{i + 1 + ". " + (artist.name ? artist.name : 'Artist Unavailable')}</p>
                                    <p className="text-xs mt-2 text-center text-gray-500">{artist.genres.length > 0 ? artist.genres.map((genre: any, i: number) => (
                                        genre + (i < artist.genres.length - 1 ? ", " : "")
                                    )) : 'Unavailable'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>}
        </div>
    );
}

export default Artists;