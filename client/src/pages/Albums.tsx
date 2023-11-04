import { getLikedAlbums } from "../spotify"
import { useQuery } from "@tanstack/react-query"
import AlbumCard from "../components/AlbumCard"
import Loader from "../components/Loader"
import ErrorFallback from "../components/ErrorFallback"

const Albums = () => {

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["likedAlbums"],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await getLikedAlbums(10, 0);
            return res.data.items
        }
    })

    return (
        <div>
            {
                isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> : (
                    <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                        {
                            data.length === 0 ? <p className="text-center w-full text-green-500 py-16">No items.</p> : data?.map((item: any) => (
                                <AlbumCard key={item.album.id} album={item.album} />
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Albums