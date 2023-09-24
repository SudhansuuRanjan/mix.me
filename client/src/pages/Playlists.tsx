import { FunctionComponent, useEffect } from "react";
import { getPlaylists } from "../spotify";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'

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
                    <div className="flex justify-between">
                        <div>
                            <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Playlists</p>
                            <p className="text-gray-500 lg:text-base md:text-base text-xs">Your playlists</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                        {data.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data.items.map((playlist: any, i: number) => (
                            <div key={i}>
                                <Link to={`/playlist/${playlist.id}`}>
                                    <div className="track-card bg-gray-950 rounded-md">
                                        <img height={400} width={400} src={playlist.images.length !== 0 ? playlist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-md" alt="Album Cover" />
                                    </div>
                                </Link>
                                <p className="text-base font-semibold mt-2">{(playlist.name ? playlist.name : 'Playlist Unavailable')}</p>
                                <p className="text-xs text-green-500 my-1">By <a className="underline text-green-500" target="_blank" href={playlist.owner.external_urls.spotify}>{playlist.owner.display_name.length > 16 ? playlist.owner.display_name.substring(0, 16) + ".." : playlist.owner.display_name}</a></p>
                                <p className="text-sm text-gray-500">{playlist.tracks.total} TRACKS</p>
                            </div>
                        ))}
                    </div>
                </div>}
        </div>
    );
}

export default Playlists;