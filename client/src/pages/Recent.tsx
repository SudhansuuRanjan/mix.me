import { FunctionComponent, useState, useEffect } from "react";
import { catchErrors } from "../utils";
import { getRecentlyPlayed } from "../spotify";
import Loader from "../components/Loader";
import Track from "../components/Track";
import '../App.css'


const Recent: FunctionComponent = () => {
    const [recentlyPlayed, setRecentlyPlayed] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getRecentlyPlayed();
            // console.log(data);
            setRecentlyPlayed(data);
        };
        catchErrors(fetchData());
    }, []);

    return (
        <div>
            {!recentlyPlayed ? <Loader /> : <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                <div className="flex justify-between">
                    <div>
                        <p className="text-3xl font-bold">Recent streams</p>
                        <p className="text-gray-400">Your recently played tracks</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-5 my-10">
                    {recentlyPlayed.items.map((recent: any, i: number) => (
                        <Track key={i} trackId={recent.track.id} trackAlbum={recent.track.album.name} trackArtists={recent.track.album.artists} trackDuration={recent.track.duration_ms} trackPlayedAt={recent.played_at} trackImage={recent.track.album.images[2].url} trackName={recent.track.name} tractAlbumId={recent.track.album.id} />
                    ))}
                </div>
            </div>}
        </div>
    );
}

export default Recent;