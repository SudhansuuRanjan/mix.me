import { FunctionComponent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { catchErrors, formatDuration, getRelativeTime } from "../utils";
import { getRecentlyPlayed } from "../spotify";
import Loader from "../components/Loader";
import React from "react";
import '../App.css'

const Recent: FunctionComponent = () => {

    const [recentlyPlayed, setRecentlyPlayed] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getRecentlyPlayed();
            console.log(data);
            setRecentlyPlayed(data);
        };
        catchErrors(fetchData());
    }, []);

    return (
        <div>
            {!recentlyPlayed ? <Loader /> : <div className="m-auto w-full px-24 my-16 text-white">
                <div className="flex justify-between">
                    <div>
                        <p className="text-3xl font-bold">Recent streams</p>
                        <p className="text-gray-400">Your recently played tracks</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-7 my-10">
                    {recentlyPlayed && recentlyPlayed.items.map((recent: any, i: number) => (
                        <div key={i} className="w-[100%] flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <Link to={`/track/${recent.track.id}`}>
                                    <img className="h-12 w-12" src={recent.track.album.images[2].url} alt={recent.track.name} />
                                </Link>

                                <div>
                                    <Link to={`/track/${recent.track.id}`}><p className="text-base font-semibold mt-2">{recent.track.name}</p></Link>
                                    <p className="text-sm text-gray-400 my-1">By {recent.track.album.artists.map((artist: any, i: number) => (
                                        <React.Fragment key={artist.id}>
                                            {i > 0 && ', '}
                                            <Link className="hover:underline text-gray-400 hover:text-green-500" to={`/artist/${artist.id}`}>
                                                {artist.name}
                                            </Link>
                                        </React.Fragment>
                                    ))} &nbsp;·&nbsp; <Link className="hover:underline hover:text-green-500" to={`/album/${recent.track.album.id}`}>{recent.track.album.name}</Link></p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 flex items-end flex-col">
                                <p>{formatDuration(recent.track.duration_ms)}</p>
                                <p>{getRelativeTime(recent.played_at)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    );
}

export default Recent;