import { FunctionComponent, useState, useEffect } from "react";
import { getTopArtists } from "../spotify";
import { catchErrors } from "../utils";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
type TimeRange = "short_term" | "medium_term" | "long_term";

const Artists: FunctionComponent = (): React.ReactNode => {
    document.title = `Top Artists • SpotiStat`;
    const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
    const [topArtists, setTopArtists] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getTopArtists(timeRange);
            // console.log(data.items);
            setTopArtists(data.items);
        };
        catchErrors(fetchData());
    }, [timeRange])

    const handleChange = (e: any) => {
        setTimeRange(e.target.value);
        setTopArtists(null);
    }



    return (
        <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
            <div className="flex justify-between  items-center">
                <div>
                    <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Artists</p>
                    <p className="text-gray-500 lg:text-base md:text-base text-xs">Your top artists</p>
                </div>
                <select onChange={handleChange} name="term" id="term" className="bg-transparent text-gray-300 border-none  outline-none">
                    <option className="bg-gray-900 border-none p-1 text-white" value="short_term">Last 4 Weeks</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="medium_term">Last 6 Months</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="long_term">All Time</option>
                </select>
            </div>

            {!topArtists ? <Loader /> : <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                {topArtists.length === 0 ? <p className="text-center w-full py-16">No items.</p> : topArtists.map((artist: any, i: number) => (
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