import React from 'react'
import { formatDuration, getRelativeTime } from '../utils'
import { Link } from 'react-router-dom'

type PlayableTrackProps = {
    trackId: string,
    trackImage: string,
    trackName: string,
    trackArtists: any,
    trackAlbum: string,
    trackDuration: number,
    trackPlayedAt: string,
    tractAlbumId: string,
    currenltyPlaying: boolean,
    setCurrentlyPlaying: any,
    pauseTrack: any,
    isPlaying: boolean
}

export default function PlayableTrack({ trackId, trackImage, trackName, trackArtists, trackAlbum, trackDuration, trackPlayedAt, tractAlbumId }: PlayableTrackProps) {

    return (
        <div data-aos="fade-up" className="w-[100%] flex items-center justify-between pt-5">
            <div className="flex items-center lg:gap-5 md:gap-4 gap-2">
                <div className='relative lg:h-24 md:h-20 h-14 lg:w-24 md:w-20 w-14 bg-gray-900 group'>
                    <img loading='lazy' className="lg:h-24 md:h-20 h-14 lg:w-24 md:w-20 w-14" src={trackImage ? trackImage : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} alt={trackName} />
                    {/* <div className={`absolute ${currenltyPlaying ? 'flex' : 'hidden group-hover:flex'} bg-black inset-0 bg-opacity-50 items-center justify-center`}>
                        <button className='text-white w-full h-full flex items-center justify-center'>{currenltyPlaying && isPlaying ? <FaPause className="lg:text-3xl md:text-2xl text-xl text-green-400" onClick={pauseTrack} /> : <FaPlay onClick={setCurrentlyPlaying} className="lg:text-3xl md:text-2xl text-xl" />}</button>
                    </div> */}
                </div>

                <div>
                    <Link to={trackAlbum !== "" ? `/track/${trackId}` : ""}><p className="lg:text-lg md:text-lg font-semibold lg:w-[27rem] md:w-[24rem] w-[13rem] truncate">{trackAlbum ? trackName : "Not Available"}</p></Link>
                    <div className='flex flex-col lg:w-[27rem] md:w-[24rem] w-[13rem] truncat'>
                        <span className="text-sm text-gray-400">By {trackArtists.map((artist: any, i: number) => (
                            <React.Fragment key={artist.id}>
                                {i > 0 && ', '}
                                <Link className="hover:underline text-gray-400 hover:text-green-500" to={`/artist/${artist.id}`}>
                                    {trackAlbum ? artist.name : "Not Available"}
                                </Link>
                            </React.Fragment>
                        ))}</span>
                        {/* &nbsp;·&nbsp;  */}
                        <Link className="hover:underline hover:text-green-500 lg:block md:block hidden" to={trackAlbum ? `/album/${tractAlbumId}` : ""}>
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
