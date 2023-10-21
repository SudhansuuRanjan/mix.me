import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserDetails, followUserOrArtist, unfollowUserOrArtist, doesUserFollowArtistorUser } from "../spotify";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorFallback from "../components/ErrorFallback";
import { formatWithCommas } from "../utils";
import PlaylistCard from "../components/PlaylistCard";
import { useEffect } from "react";

const User = () => {
    const [searchParams] = useSearchParams({ user_id: "" });

    let userID = searchParams.get('user_id') as string;

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['user', userID],
        staleTime: Infinity,
        queryFn: async () => {
            const res = await getUserDetails(userID);
            return res;
        },
        onSuccess: (data) => {
            console.log(data);
        }
    });

    const { data: userFollows, isLoading: userFollowsLoading, refetch: userFollowsRefetch } = useQuery({
        queryKey: ['user-follows', userID],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await doesUserFollowArtistorUser(userID, "user");
            return res.data[0];
        },
    });

    const handleFollow = useMutation({
        mutationFn: async () => userFollows ? await unfollowUserOrArtist(userID, "user") : await followUserOrArtist(userID, "user"),
        onSuccess: () => {
            userFollowsRefetch();
        }
    })

    useEffect(() => {
        document.title = `${isLoading ? "User" : data?.profile.display_name} • mix.me`;
    },[])

    return (
        <div>
            {
                isLoading ? <Loader /> :
                    isError ? <ErrorFallback refetch={refetch} /> :
                        <div className="m-auto w-full lg:px-24 md:px-12 px-6 pb-10 my-16 text-white">
                            <div className="flex items-center justify-center flex-col">
                                <img data-aos="zoom-in" src={data.profile.images.length !== 0 ? data.profile.images[1].url : "https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg"} alt={data.profile.display_name} className="lg:h-52 md:h-48 w-36 lg:w-52 md:w-48 h-36 rounded-full" />
                                <a data-aos="fade-up" href={data.profile.external_urls.spotify} target="_blank" className="lg:text-5xl md:text-4xl text-3xl font-bold my-7 hover:text-green-500">{data.profile.display_name}</a>

                                <div className="flex gap-2 items-center">
                                    <p className="text-blue-500 lg:text-2xl md:text-2xl text-xl font-bold">{formatWithCommas(data.profile.followers.total)}</p>
                                    <p className="text-gray-500">FOLLOWERS</p>
                                </div>

                                <div data-aos="fade-up" className="my-7">
                                    <button onClick={() => handleFollow.mutate()} className="text-white border px-9 py-2.5 rounded-full text-sm hover:text-black hover:bg-white">
                                        {
                                            !userFollowsLoading && userFollows ? 'FOLLOWING' : 'FOLLOW'
                                        }
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="pt-8">
                                    <p data-aos="fade-up" className="lg:text-3xl text-2xl font-bold">User Playlists</p>
                                </div>

                                <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                                    { data.playlists.length === 0 ? <p className="text-lg font-semibold py-16 text-center">No Playlists Found</p> :  
                                    data.playlists.items.map((playlist: any, i: number) => (
                                        <PlaylistCard key={i} playlist={playlist} i={i} />
                                    ))}
                                </div>
                            </div>

                        </div>
            }
        </div>
    )
}

export default User;