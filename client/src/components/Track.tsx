import React from 'react'
import { formatDuration, getRelativeTime } from '../utils'
import { Link } from 'react-router-dom'

export default function Track({ trackId, trackImage, trackName, trackArtists, trackAlbum, trackDuration, trackPlayedAt, tractAlbumId }: { trackId: string, trackImage: string, trackName: string, trackArtists: any, trackAlbum: string, trackDuration: number, trackPlayedAt: string, tractAlbumId: string }) {

    return (
        <div className="w-[100%] flex items-center justify-between">
            <div className="flex items-center lg:gap-5 md:gap-4 gap-3">
                <Link to={trackName ? `/track/${trackId}` : ""} className='h-16 w-16 bg-gray-900'>
                    <img className="h-16 w-16" src={trackImage} alt={trackName} />
                </Link>

                <div>
                    <Link to={trackName ? `/track/${trackId}` : ""}><p className="text-base font-semibold mt-2">{trackName}</p></Link>
                    <div className='flex flex-col'>
                        <p className="text-sm text-gray-400">By {trackArtists.map((artist: any, i: number) => (
                            <React.Fragment key={artist.id}>
                                {i > 0 && ', '}
                                <Link className="hover:underline text-gray-400 hover:text-green-500" to={`/artist/${artist.id}`}>
                                    {artist.name}
                                </Link>
                            </React.Fragment>
                        ))}</p>
                        {/* &nbsp;·&nbsp;  */}
                        <Link className="hover:underline hover:text-green-500" to={trackName ? `/album/${tractAlbumId}` : ""}>
                            <div className='text-sm hover:underline text-gray-500 hover:text-green-500 lg:w-[27rem] md:w-[24rem] w-[14rem] truncat'>{trackAlbum}</div></Link>
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-3'>
                <div className="text-sm text-gray-500 flex items-end justify-start flex-col w-20">
                    <p>{formatDuration(trackDuration)}</p>
                    <p>{trackPlayedAt && getRelativeTime(trackPlayedAt)}</p>
                </div>
            </div>
        </div>
    )
}
