import React, { useState, useEffect } from 'react'
import { getAlbumInfo } from '../spotify'
import { catchErrors, dateToYMD } from '../utils'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import Track from '../components/Track'

export default function Album(): React.ReactNode {

    const [album, setAlbum] = useState<any>(null);
    const [tracks, setTracks] = useState<any>(null);

    const albumId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchData = async () => {
            console.log(albumId)
            const { album, tracks } = await getAlbumInfo(albumId);
            setAlbum(album.data);
            setTracks(tracks.data.items);
            // console.log(album.data, tracks.data);
        };
        catchErrors(fetchData());
    }, [albumId])



    return (
        <div>
            <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                {
                    !album ? <Loader /> :
                        <div className="flex flex-col md:flex-row gap-7">
                            <img className="w-52 h-52 rounded-lg" src={album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : album.images[0]?.url} alt={album.name} />
                            <div className="flex flex-col">
                                <p className="lg:text-4xl md:text-3xl text-2xl font-semibold my-1">{album.name}</p>
                                <p className="text-gray-400 text-medium text-lg mt-1 max-w-md">{album.label}</p>
                                <div className='text-green-500 mt-1 lg:text-base md:text-base text-sm'>
                                    {
                                        album.artists.map((artist: any, i: number) => (
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
                                        {album.total_tracks} songs
                                    </div> &nbsp;·&nbsp;
                                    <div className='text-sm font-light text-gray-400'>
                                        {dateToYMD(new Date(album.release_date))}
                                    </div>
                                </div>
                            </div>
                        </div>
                }

                <div>
                    <p className='lg:text-3xl md:text-2xl text-xl font-semibold mt-20'>Tracks</p>
                </div>

                {
                    album && !tracks ? <Loader /> :
                        <div className="flex flex-wrap gap-4 my-10">
                            {tracks && tracks.map((track: any, i: number) => (
                                <Track key={i} trackId={track.id} trackAlbum={album.name} trackArtists={track.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : album.images[0]?.url} trackName={track.name === "" ? "Unavailable" : track.name} tractAlbumId={album.id} />
                            ))}
                        </div>
                }

                <div className='mt-12'>
                    {
                        album &&
                        album.copyrights.map((cpy: { text: string, type: string }, id: number) => (
                            <p key={id}>{cpy.text}</p>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
