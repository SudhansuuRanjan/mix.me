import { FunctionComponent, useState, useEffect } from "react";
import { getTopArtists } from "../spotify";
import { catchErrors } from "../utils";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
type TimeRange = "short_term" | "medium_term" | "long_term";

const Artists: FunctionComponent = (): React.ReactNode => {
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



    return (
        <div className="m-auto w-full lg:px-24 md:px-16 px-6 py-12 pb-32 text-white">
            <div className="flex justify-between  items-center">
                <div>
                    <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Artists</p>
                    <p className="text-gray-500 lg:text-base md:text-base text-sm">Your top artists</p>
                </div>
                <div className="flex lg:gap-6 md:gap-5 gap-2 lg:text-base md:text-base text-sm">
                    <button onClick={() => {
                        setTimeRange("short_term");
                        setTopArtists(null);
                    }} className={`text-gray-500 hover:text-white ${timeRange === 'short_term' && 'underline text-white'}`}>Last 4 Weeks</button>
                    <button onClick={() => {
                        setTimeRange("medium_term");
                        setTopArtists(null);
                    }} className={`text-gray-500 hover:text-white ${timeRange === 'medium_term' && 'underline text-white'}`}>Last 6 Months</button>
                    <button onClick={() => {
                        setTimeRange("long_term");
                        setTopArtists(null);
                    }} className={`text-gray-500 hover:text-white ${timeRange === 'long_term' && 'underline text-white'}`}>All Time</button>
                </div>
            </div>

            {!topArtists ? <Loader /> : <div className="flex flex-wrap lg:gap-8 md:gap-8 gap-5 my-10 justify-center">
                {topArtists && topArtists.map((artist: any, i: number) => (
                    <Link key={i} to={`/artist/${artist.id}`}>
                        <div className="lg:w-44 md:w-44 w-32">
                            <div className="artist-card">
                                <img src={artist.images[1] ? artist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="lg:h-44 md:h-44 h-32 lg:w-44 md:w-44 w-32 rounded-full" alt="Album Cover" />
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