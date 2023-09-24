import { FunctionComponent, useEffect } from "react";
import { getTopTracks } from "../spotify";
import Loader from "../components/Loader";
import Track from "../components/Track";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ErrorFallback from '../components/ErrorFallback'

const Tracks: FunctionComponent = (): React.ReactNode => {
    const [searchParams, setSearchParams] = useSearchParams({ duration: "short_term" });

    const { data, isError, isLoading, refetch } = useQuery({
        staleTime: 1000 * 60 * 20,
        queryKey: ['top-tracks', searchParams.get('duration')],
        queryFn: async () => {
            const res = await getTopTracks(searchParams.get('duration') as string);
            return res.data.items;
        },
    });

    const getPlayableSong = () => {
        let idx = 0;
        while (idx < 50) {
            if (data.length !== 0 && data[idx].preview_url) {
                return data[idx].preview_url;
            } else {
                idx++;
            }
        }
    }

    const handleChange = (e: any) => {
        setSearchParams(prev => {
            prev.set('duration', e.target.value);
            return prev;
        }, { replace: true });
    }

    useEffect(() => {
        document.title = `Top Tracks • SpotiStat`;
    }, [])


    return (
        <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
            <div className="flex justify-between  items-center">
                <div>
                    <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Top Tracks</p>
                    <p className="text-gray-500 lg:text-base md:text-base text-xs">Your top tracks</p>
                </div>
                <select onChange={handleChange} value={searchParams.get("duration") as string} name="term" id="term" className="bg-transparent cursor-pointer text-green-500 border-none  outline-none">
                    <option className="bg-gray-900 border-none p-1 text-white" value="short_term">Last 4 Weeks</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="medium_term">Last 6 Months</option>
                    <option className="bg-gray-900 border-none p-1 text-white" value="long_term">All Time</option>
                </select>
            </div>

            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} />
                : <div>
                    <div className="my-5">
                        <audio autoPlay>
                            <source src={getPlayableSong()}></source>
                        </audio>
                    </div>

                    <div className="flex flex-wrap gap-7 my-10">
                        {data.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.map((track: any, i: number) => (
                            <Track key={i} trackId={track.id} trackAlbum={track.album.name} trackArtists={track.album.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={track.album.images[2]?.url} trackName={'#' + (i + 1) + " " + track.name} tractAlbumId={track.album.id} />
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}

export default Tracks;