import React, { useEffect } from 'react'
import { getAlbumInfo } from '../spotify'
import Loader from '../components/Loader'
import { Link, useParams } from 'react-router-dom'
import Track from '../components/Track'
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import { dateToYMD } from '../utils'

export default function Album(): React.ReactNode {
    const { albumId }: any = useParams();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['album', albumId],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await getAlbumInfo(albumId);
            return { album: res.album.data, tracks: res.tracks.data.items };
        }
    })

    useEffect(() => {
        document.title = `${isLoading ? "Album" : data?.album.name} • SpotiStat`;
    }, [data?.album])

    return (
        <div>
            <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                {
                    isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> :
                        <div className="flex flex-col md:flex-row gap-7">
                            <img className="w-52 h-52 rounded-lg" src={data?.album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : data?.album.images[0]?.url} alt={data?.album.name} />
                            <div className="flex flex-col">
                                <p className="lg:text-4xl md:text-3xl text-2xl font-semibold my-1">{data?.album.name}</p>
                                <p className="text-gray-400 text-medium text-lg mt-1 max-w-md">{data?.album.label}</p>
                                <div className='text-green-500 mt-1 lg:text-base md:text-base text-sm'>
                                    {
                                        data?.album.artists.map((artist: any, i: number) => (
                                            <React.Fragment key={artist.id}>
                                                {i > 0 && ', '}
                                                <Link className="hover:underline text-green-500 hover:text-green-500" to={`/artist/${artist.id}`}>
                                                    {artist.name}
                                                </Link>
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                                <div className='flex items-center'>
                                    <div className='text-sm font-light text-gray-400'>
                                        {data?.album.total_tracks} songs
                                    </div> &nbsp;·&nbsp;
                                    <div className='text-sm font-light text-gray-400'>
                                        {dateToYMD(new Date(data?.album.release_date))}
                                    </div>
                                </div>
                            </div>
                        </div>
                }

                <div>
                    <p className='lg:text-3xl md:text-2xl text-xl font-semibold mt-20'>Tracks</p>
                </div>

                {
                    isLoading ? <Loader /> :
                        <div className="flex flex-wrap gap-4 my-10">
                            {data?.tracks.map((track: any, i: number) => (
                                <Track key={i} trackId={track.id} trackAlbum={data.album.name} trackArtists={track.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={data.album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : data.album.images[0]?.url} trackName={track.name === "" ? "Unavailable" : track.name} tractAlbumId={data.album.id} />
                            ))}
                        </div>
                }

                <div className='mt-12'>
                    {
                        !isLoading && data?.album.copyrights.map((cpy: { text: string, type: string }, id: number) => (
                            <p key={id}>{cpy.text}</p>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
