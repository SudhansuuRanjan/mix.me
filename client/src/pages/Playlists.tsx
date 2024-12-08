import { FunctionComponent, useEffect, useState } from "react";
import { getPlaylists, getUser } from "../spotify";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import PlaylistCard from "../components/PlaylistCard";
import { useNavContext } from "../context/NavContext";

const Playlists: FunctionComponent = () => {
    const [filter, setFilter] = useState("all");
    const { setNavTitle } = useNavContext();

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['playlists'],
        queryFn: async () => {
            const res = await getPlaylists();
            return res.data;
        },
    });

    const { data: userData } =
        useQuery({
            queryKey: ["user"],
            staleTime: 1000 * 60 * 60 * 24,
            queryFn: async () => {
                const user = await getUser();
                return user.data;
            }
        })

    const filteredPlaylists = !isLoading && data?.items?.length > 0
        ? data.items
            .filter((playlist: any) => playlist !== null && playlist !== undefined) // Remove invalid entries
            .filter((playlist: any) => {
                if (filter === "all") {
                    return true;
                } else if (filter === "spotify") {
                    // Apply the filter logic for Spotify playlists
                    return playlist.owner.display_name === "Spotify";
                } else if (filter === "user") {
                    // Apply the filter logic for user-created playlists
                    return playlist.owner.id === userData?.id;
                }
            })
        : [];

    useEffect(() => {
        document.title = `Playlists • mix.me`;
        setNavTitle(`Playlists`);
    }, [])

    return (
        <div className="m-auto w-full flex flex-col items-center justify-center">
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} />
                : <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
                    <div data-aos="fade-right" className="flex justify-between">
                        <div>
                            <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Playlists</p>
                            <p className="text-gray-500 lg:text-base md:text-base text-xs">Your playlists</p>
                        </div>

                        {/* <div>
                            <button className="lg:text-base md:text-base text-xs bg-[#1db954] hover:bg-[#1ed760] rounded-full px-5 py-2 text-white font-semibold focus:outline-none">Create Playlist</button>
                        </div> */}
                    </div>

                    <div data-aos="fade-right" className="flex text-sm font-medium mt-5 gap-2">
                        <button onClick={() => setFilter("all")} className={`px-4 py-1.5 rounded-full ${filter === "all" ? "bg-green-500 text-black" : "bg-gray-700 font-normal text-white bg-opacity-40"
                            }`}>
                            All
                        </button>
                        <button onClick={() => setFilter("spotify")} className={`px-4 py-1.5 rounded-full ${filter === "spotify" ? "bg-green-500 text-black" : "bg-gray-700 font-normal text-white bg-opacity-40"
                            }`} >
                            By Spotify
                        </button>
                        <button onClick={() => setFilter("user")} className={`px-4 py-1.5 rounded-full ${filter === "user" ? "bg-green-500 text-black" : "bg-gray-700 font-normal text-white bg-opacity-40"
                            }`}>
                            By You
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-4 my-10 transition-transform delay-75 ease-in-out">
                        {filteredPlaylists.length === 0 ? (
                            <p className="text-center w-full py-16">No items.</p>
                        ) : (
                            filteredPlaylists.map((playlist: any, i: number) => (
                                <PlaylistCard key={i} playlist={playlist} />
                            ))
                        )}
                    </div>
                </div>}
        </div>
    );
}

export default Playlists;