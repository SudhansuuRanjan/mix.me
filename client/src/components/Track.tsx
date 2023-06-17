import React from 'react'
import { formatDuration, getRelativeTime } from '../utils'
import { Link } from 'react-router-dom'

export default function Track({ trackId, trackImage, trackName, trackArtists, trackAlbum, trackDuration, trackPlayedAt, tractAlbumId }: { trackId: string, trackImage: string, trackName: string, trackArtists: any, trackAlbum: string, trackDuration: number, trackPlayedAt: string, tractAlbumId: string }) {

    return (
        <div className="w-[100%] flex items-center justify-between">
            <div className="flex items-center lg:gap-5 md:gap-4 gap-2">
                <Link to={trackName ? `/track/${trackId}` : ""} className='lg:h-16 md:h-16 h-12 lg:w-16 md:w-16 w-12 bg-gray-900'>
                    <img className="lg:h-16 md:h-16 h-12 lg:w-16 md:w-16 w-12" src={trackImage} alt={trackName} />
                </Link>

                <div>
                    <Link to={trackName ? `/track/${trackId}` : ""}><p className="lg:text-base md:text-base text-sm font-semibold lg:w-[27rem] md:w-[24rem] w-[13rem] truncat mb-1">{trackName}</p></Link>
                    <div className='flex flex-col lg:w-[27rem] md:w-[24rem] w-[13rem] truncat'>
                        <span className="text-sm text-gray-400">By {trackArtists.map((artist: any, i: number) => (
                            <React.Fragment key={artist.id}>
                                {i > 0 && ', '}
                                <Link className="hover:underline text-gray-400 hover:text-green-500" to={`/artist/${artist.id}`}>
                                    {artist.name}
                                </Link>
                            </React.Fragment>
                        ))}</span>
                        {/* &nbsp;·&nbsp;  */}
                        <Link className="hover:underline hover:text-green-500 lg:block md:block hidden" to={trackName ? `/album/${tractAlbumId}` : ""}>
                            <div className='text-sm hover:underline text-gray-500 hover:text-green-500 lg:w-[27rem] md:w-[24rem] w-[14rem] truncat'>{trackAlbum}</div></Link>
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-3'>
                <div className="text-sm text-gray-500 flex items-end justify-start flex-col">
                    <p>{formatDuration(trackDuration)}</p>
                    <p className='lg:block md:block hidden'>{trackPlayedAt && getRelativeTime(trackPlayedAt)}</p>
                </div>
            </div>
        </div>
    )
}
