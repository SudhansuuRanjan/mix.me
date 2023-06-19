import { FunctionComponent, useState, useEffect } from "react";
import { getTopTracks } from "../spotify";
import Loader from "../components/Loader";
import { catchErrors } from "../utils";
import Track from "../components/Track";

type TimeRange = "short_term" | "medium_term" | "long_term";

const Tracks: FunctionComponent = (): React.ReactNode => {
    document.title = `Top Tracks • SpotiStat`;
    const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
    const [topTracks, setTopTracks] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getTopTracks(timeRange);
            // console.log(data.items);
            setTopTracks(data.items);
        };
        catchErrors(fetchData());
    }, [timeRange]);

    const getPlayableSong = () => {
        let idx = 0;
        while (idx < 50) {
            if (topTracks[idx].preview_url) {
                return topTracks[idx].preview_url;
            } else {
                idx++;
            }
        }
    }

    const handleChange = (e: any) => {
        setTimeRange(e.target.value);
        setTopTracks(null);
    }


    return (
        <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
            <div className="flex justify-between  items-center">
                <div>
                    <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Tracks</p>
                    <p className="text-gray-500 lg:text-base md:text-base text-xs">Your top tracks</p>
                </div>
                <select onChange={handleChange} name="term" id="term" className="bg-transparent cursor-pointer text-gray-300 border-none  outline-none">
                    <option className="bg-gray-900 border-none p-1 text-white" value="short_term">Last 4 Weeks</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="medium_term">Last 6 Months</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="long_term">All Time</option>
                </select>
            </div>

            {!topTracks ? <Loader /> : <div>
                <div className="my-5">
                    <audio autoPlay>
                        <source src={getPlayableSong()}></source>
                    </audio>
                </div>

                <div className="flex flex-wrap gap-7 my-10">
                    {topTracks.map((track: any, i: number) => (
                        <Track key={i} trackId={track.id} trackAlbum={track.album.name} trackArtists={track.album.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={track.album.images[2]?.url} trackName={'#' + (i + 1) + " " + track.name} tractAlbumId={track.album.id} />
                    ))}
                </div>
            </div>
            }
        </div>
    );
}

export default Tracks;