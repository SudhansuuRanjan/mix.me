import { getLikedAlbums } from "../spotify"
import { useQuery } from "@tanstack/react-query"
import AlbumCard from "../components/AlbumCard"
import Loader from "../components/Loader"
import ErrorFallback from "../components/ErrorFallback"

let refetchAlbums : Function;

const LikedAlbums = () => {

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['likedAlbums'],
        queryFn: async () => {
            const res = await getLikedAlbums(50, 0);
            return res.data.items;
        },
    });

    refetchAlbums = refetch;

    return (
        <div className="m-auto w-full flex flex-col items-center justify-center">
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} />
                : <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
                    <div data-aos="fade-right" className="flex justify-between">
                        <div>
                            <p className="lg:text-2xl md:text-2xl text-xl font-semibold">Albums</p>
                            <p className="text-gray-500 lg:text-base md:text-base text-xs">Your saved playlists</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                        {
                          data.length > 0 &&  data?.map((item: any) => (
                                <AlbumCard key={item.album.id} album={item.album} />
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default LikedAlbums;
export { refetchAlbums };