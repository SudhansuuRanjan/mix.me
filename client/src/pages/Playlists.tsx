import { FunctionComponent, useState, useEffect } from "react";
import { getPlaylists } from "../spotify";
import { catchErrors } from "../utils";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";


const Playlists: FunctionComponent = () => {
    const [playlists, setPlaylists] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPlaylists();
            setPlaylists(res.data);
            // console.log(res.data);
        };
        catchErrors(fetchData());
    }, []);


    return (
        <div className="m-auto w-full flex flex-col items-center justify-center">
            {playlists.length == 0 ? <Loader/> : <div className="m-auto w-full px-24 my-16 text-white">
                <div className="flex justify-between">
                    <div>
                        <p className="text-3xl font-semibold">Playlists</p>
                        <p className="text-gray-400">Your playlists</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-10 my-10">
                    {playlists && playlists.items.map((playlist: any, i: number) => (
                        <div key={i} className="lg:w-52 md:w-48 w-36">
                            <Link to={`/playlist/${playlist.id}`}>
                                <div className="track-card">
                                    <img src={playlist.images[0].url ? playlist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="lg:h-52 md:h-48 h-36 lg:w-52 md:w-48 w-36 rounded-md" alt="Album Cover" />
                                </div>
                            </Link>
                            <p className="text-base font-semibold mt-2">{(playlist.name ? playlist.name : 'Playlist Unavailable')}</p>
                            <p className="text-xs text-green-500 my-1">By <a className="underline text-green-500" target="_blank" href={playlist.owner.external_urls.spotify}>{playlist.owner.display_name}</a></p>
                            <p className="text-sm text-gray-500">{playlist.tracks.total} TRACKS</p>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    );
}

export default Playlists;