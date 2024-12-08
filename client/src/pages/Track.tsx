import { FunctionComponent, useEffect } from "react";
import { getYear } from '../utils';
import { getTrackInfo } from '../spotify';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import { useNavContext } from "../context/NavContext";

const Track: FunctionComponent = () => {
    const { trackId }: any = useParams();
    const { setNavTitle } = useNavContext();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['track', trackId],
        staleTime: Infinity,
        queryFn: async () => {
            const res = await getTrackInfo(trackId);
            return { track: res.track };
        }
    })

    useEffect(() => {
        document.title = `${isLoading ? "Track" : data?.track.name} • mix.me`;
        setNavTitle(`${isLoading ? "Track" : data?.track.name}`);
    }, [data?.track]);


    return (
        <div>
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> :
                <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                    <div className="flex lg:flex-row md:flex-row flex-col lg:gap-10 md:gap-7 gap-5">
                        <div className="relative w-fit h-fit group">
                            <img data-aos="zoom-in" className="lg:h-56 md:h-56 h-56 lg:w-56 md:w-56 w-56" src={data?.track.album.images[0].url} alt="Album Artwork" />
                        </div>
                        <div data-aos="fade-left">
                            <p className="lg:text-4xl md:text-3xl text-2xl font-bold">{data?.track.name} {data?.track.explicit && <span className="text-blue-500 text-lg font-medium px-1.5 py-1 bg-blue-600 bg-opacity-30 rounded-md">E</span>}</p>
                            <p className="lg:text-xl md:text-xl text-lg font-semibold text-gray-400 lg:my-3 md:my-2 my-1">By {data?.track.album.artists.map((artist: any, i: number) => (
                                <React.Fragment key={artist.id}>
                                    {i > 0 && ', '}
                                    <Link className="hover:underline text-gray-400 hover:text-green-500" to={`/artist/${artist.id}`}>
                                        {artist.name}
                                    </Link>
                                </React.Fragment>
                            ))}</p>
                            <p className="text-gray-400 lg:text-base md:text-base text-sm mb-4"><Link className="hover:underline hover:text-green-500" to={`/album/${data?.track.album.id}`}>{data?.track.album.name}</Link> &nbsp;·&nbsp; {getYear(data?.track.album.release_date)}</p>
                            <a href={data?.track.album.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer">
                                <button className="px-6 py-2 bg-green-500 text-black text-sm rounded-full hover:bg-green-600">
                                    PLAY ON SPOTIFY
                                </button>
                            </a>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default Track;