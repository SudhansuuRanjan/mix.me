import React, { useEffect, useState, useRef } from 'react'
import { getAlbumInfo, doesUserSavedAlbums, saveAlbums, removeAlbums } from '../spotify'
import Loader from '../components/Loader'
import { Link, useParams } from 'react-router-dom'
import PlayableTrack from '../components/PlayableTrack'
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import { dateToYMD } from '../utils'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useNavContext } from '../context/NavContext'
import AudioPlayer from 'react-h5-audio-player';

export default function Album(): React.ReactNode {
    const playerRef = useRef<any>(null);
    const { albumId }: any = useParams();
    const { setNavTitle } = useNavContext();

    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        const audio = playerRef.current.audio.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['album', albumId],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await getAlbumInfo(albumId);
            return { album: res.album.data, tracks: res.tracks.data.items };
        }
    })

    const { data: userSavedAlbum, refetch: refetchFollowing } =
        useQuery({
            queryKey: ["user", albumId],
            staleTime: 1000 * 60 * 60 * 24,
            queryFn: async () => {
                const res2 = await doesUserSavedAlbums([albumId]);
                return res2.data[0];
            }
        })


    useEffect(() => {
        document.title = `${isLoading ? "Album" : data?.album.name} • mix.me`;
        setNavTitle(`${isLoading ? "Album" : data?.album.name}`);
    }, [data?.album])

    const handleSaveAlbum = async () => {
        try {
            await saveAlbums(albumId);
            refetchFollowing();
            // refetchAlbums();
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveAlbum = async () => {
        try {
            await removeAlbums(albumId);
            refetchFollowing()
            // refetchAlbums();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 mb-24 text-white">
                {
                    isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> :
                        <div className="flex flex-col md:flex-row gap-7">
                            <AudioPlayer
                                ref={playerRef}
                                src={data?.tracks[currentTrack].preview_url}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => {
                                    if (currentTrack < data?.tracks.length - 1) {
                                        setCurrentTrack(currentTrack + 1);
                                    } else {
                                        setCurrentTrack(0);
                                    }
                                }}
                                className="hidden"
                            />

                            <div className='w-52 h-52 relative bg-gray-950 group'>
                                <img data-aos="zoom-in" height={500} width={500} className="w-52 h-52 rounded-lg" src={data?.album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : data?.album.images[0]?.url} alt={data?.album.name} />

                                {/* <div className={`absolute group-hover:hidden inset-0 bg-black bg-opacity-30 ${isPlaying ? 'flex' : 'hidden'} items-center justify-center`}>
                                    <div className="flex items-end justify-center space-x-1 h-[3.5rem]">
                                        <div className="music-bar-sm"></div>
                                        <div className="music-bar-sm"></div>
                                        <div className="music-bar-sm"></div>
                                        <div className="music-bar-sm"></div>
                                        <div className="music-bar-sm"></div>
                                    </div>
                                </div>

                                <div className={`absolute ${isPlaying && `hidden group-hover:flex`} flex bg-black inset-0 bg-opacity-40 items-center justify-center`}>
                                    <button className="p-6 flex justify-center items-center h-full w-full m-auto text-white" onClick={togglePlay}>{isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}</button>
                                </div> */}
                            </div>

                            <div data-aos="fade-left" className="flex flex-col">
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
                                <div className='flex items-center flex-wrap'>
                                    <div>
                                        {userSavedAlbum ? <AiFillHeart onClick={handleRemoveAlbum} className="text-pink-500 cursor-pointer" size={24} /> : <AiOutlineHeart onClick={handleSaveAlbum} className="text-pink-500 cursor-pointer" size={24} />}
                                    </div>&nbsp;·&nbsp;
                                    <div className='text-sm font-light text-gray-400'>
                                        {data?.album.total_tracks} songs
                                    </div> &nbsp;·&nbsp;
                                    <div className='text-sm font-light text-gray-400'>
                                        {dateToYMD(new Date(data?.album.release_date))}
                                    </div>
                                </div>
                                <a target='_blank' href={data?.album.external_urls.spotify} className="lg:text-sm md:text-sm text-xs bg-[#1db954] hover:bg-[#197e3d] w-fit rounded-full px-5 py-1.5 text-black font-medium focus:outline-none mt-4">Play on Spotify</a>
                            </div>
                        </div>

                }

                <div data-aos="fade-up">
                    <p className='lg:text-3xl md:text-2xl text-xl font-semibold mt-20'>Tracks</p>
                </div>

                {
                    !isLoading &&
                    <div className="flex flex-wrap divide-y divide-gray-800 gap-5 my-10">
                        {data?.tracks.map((track: any, i: number) => (
                            <PlayableTrack key={i}
                                pauseTrack={togglePlay}
                                currenltyPlaying={currentTrack === i}
                                isPlaying={isPlaying}
                                setCurrentlyPlaying={() => {
                                    setCurrentTrack(i);
                                    togglePlay();
                                    setIsPlaying(true);
                                }}
                                trackId={track.id} trackAlbum={data.album.name} trackArtists={track.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={data.album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : data.album.images[0]?.url} trackName={track.name === "" ? "Unavailable" : track.name} tractAlbumId={data.album.id} />
                        ))}
                    </div>
                }

                <div data-aos="fade-up" className='mt-12'>
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
