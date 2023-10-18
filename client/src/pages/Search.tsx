import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { search } from "../spotify";
import PlaylistCard from "../components/PlaylistCard";
import Track from "../components/Track";
import ArtistCard from "../components/ArtistCard";
import AlbumCard from "../components/AlbumCard";
import Loader from "../components/Loader";
import ErrorFallback from "../components/ErrorFallback";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams({ search: "", type: "track" });
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    let type = searchParams.get("type") as string;
    let query = searchParams.get("search") as string;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => {
            prev.set('search', e.target.value);
            return prev;
        }, { replace: true });
    }

    const changeType = (type: string) => {
        setSearchParams(prev => {
            prev.set('type', type);
            return prev;
        }, { replace: true });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const res = await search(query, type);
            setData(res.data);
            // console.log(res.data);
            setLoading(false);
        } catch (error) {
            // console.log(error);
            setLoading(false);
            setError(true);
        }
    }

    useEffect(() => {
        document.title = `Search • SpotiStat`;
        if (query) {
            handleSubmit(new Event('submit') as any);
        }
    }, []);

    return (
        <div className="w-full">
            <div className="m-auto w-full flex flex-col items-center justify-center">
                <form onSubmit={handleSubmit} className="lg:pt-16 md:pt-16 pt-14 flex flex-col lg:w-[38rem] md:w-[32rem] w-[90%] gap-6">
                    <div className="flex gap-6">
                        <input value={searchParams.get("search") as string} onChange={onChange} type="text" placeholder="Search" className="w-full h-12 px-5 pr-10 shadow-lg rounded-2xl text-sm bg-gray-800 focus:outline-none border-gray-700 border" />
                        <button className="text-white bg-green-600 hover:bg-green-700 px-8 h-12 rounded-2xl">
                            Search
                        </button>
                    </div>
                    <div className="flex items-center justify-center lg:gap-6 md:gap-5 gap-2 mt-3">
                        <button onClick={() => changeType("track")} className={`border rounded-full text-white px-5 py-1.5 lg:text-base md:text-base text-sm ${type === "track" ? "bg-green-500 bg-opacity-70 border-green-500" : "border-gray-500"}`}>
                            Songs
                        </button>

                        <button onClick={() => changeType("playlist")} className={`border rounded-full text-white px-5 py-1.5 lg:text-base md:text-base text-sm ${type === "playlist" ? "bg-green-500 bg-opacity-70 border-green-500" : "border-gray-500"}`}>
                            Playlists
                        </button>

                        <button onClick={() => changeType("artist")} className={`border rounded-full text-white px-5 py-1.5 lg:text-base md:text-base text-sm  ${type === "artist" ? "bg-green-500 bg-opacity-70 border-green-500" : "border-gray-500"}`}>
                            Artists
                        </button>

                        <button onClick={() => changeType("album")} className={`border rounded-full text-white px-5 py-1.5 lg:text-base md:text-base text-sm ${type === "album" ? "bg-green-500 bg-opacity-70 border-green-500" : "border-gray-500"}`}>
                            Albums
                        </button>
                    </div>
                </form>

                <div className="m-auto w-full lg:px-16 md:px-16 px-5 pt-5">
                    {
                        error ? <ErrorFallback refetch={() => { }} /> :
                            loading ? <Loader /> :
                                <div className="flex flex-col gap-6 mt-16 pb-20">
                                    {
                                        type === "track" &&
                                        <div className="flex flex-wrap gap-5"> {data?.tracks?.items.map((track: any) => (
                                            <Track key={track.id} trackId={track.id} trackImage={track.album.images[0].url} trackName={track.name} trackArtists={track.artists} trackAlbum={track.album.name} trackDuration={track.duration_ms} trackPlayedAt={track.played_at} tractAlbumId={track.album.id} />
                                        ))}
                                        </div>
                                    }
                                    {
                                        type === "playlist" && <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                                            {data?.playlists?.items.map((playlist: any, i: number) => (
                                                <PlaylistCard key={playlist.id} i={i} playlist={playlist} />
                                            ))}
                                        </div>
                                    }
                                    {
                                        type === "artist" && <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                                            {data?.artists?.items.map((artist: any, i: number) => (
                                                <ArtistCard key={artist.id} artist={artist} i={i} />
                                            ))}
                                        </div>
                                    }
                                    {
                                        type === "album" && <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-8 md:gap-7 gap-6 my-10">
                                            {data?.albums?.items.map((album: any) => (
                                                <AlbumCard key={album.id} album={album} />
                                            ))}
                                        </div>
                                    }
                                </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Search