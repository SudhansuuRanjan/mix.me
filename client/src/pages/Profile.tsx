import { FunctionComponent, useEffect, useState } from "react";
import { getUserInfo, logout, getLikedSongs } from "../spotify";
import Loader from "../components/Loader";
import Track from "../components/Track";
import { useQuery } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import TrackCard from "../components/TrackCard";
import ProfileCard from "../components/ProfileCard";
import ArtistCard from "../components/ArtistCard";
import PlaylistCard from "../components/PlaylistCard";
import Title from "../components/Title";
import Albums from "./Albums";
import { useNavContext } from "../context/NavContext";


const Profile: FunctionComponent = () => {
    const { setNavTitle } = useNavContext();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['profile'],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await getUserInfo();
            return {
                user: res.user,
                followedArtists: res.followedArtists,
                playlists: res.playlists,
                topArtists: res.topArtists,
                topTracks: res.topTracks.items
            };
        }
    });

    const [topGenres, setTopGenres] = useState(null);

    useEffect(() => {
        document.title = `🎧 mix.me • ${isLoading ? "Profile" : data?.user.display_name}`;
        setNavTitle(isLoading ? "Profile" : "🎧 mix.me · " + data?.user.display_name);
        if (data?.topArtists) {
            getTopGenres(data?.topArtists.items);
        }
    }, [data]);

    const getTopGenres = (artists: any) => {
        // get all genres freq in an array in sorted order
        const genres = artists.map((artist: any) => artist.genres).flat();
        const genresFreq = genres.reduce((acc: any, curr: any) => {
            acc[curr] ? acc[curr]++ : acc[curr] = 1;
            return acc;
        }, {});

        // sort genres based on freq
        const sortedGenres = Object.entries(genresFreq).sort((a: any, b: any) => b[1] - a[1]);
        setTopGenres(sortedGenres as any);
        return sortedGenres;
    }

    const { data: likedSongs, isLoading: likedSongsLoading, isError: likedSongsError, refetch: refetchLikedSongs } = useQuery({
        queryKey: ['liked-songs'],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await getLikedSongs(20, 0);
            return res.data.items;
        }
    })

    const totalPlaylists = data?.playlists ? data?.playlists.total : 0;

    return (
        <div className="w-full pb-16">
            {isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> : (
                <div className="m-auto w-full flex flex-col items-center justify-center">
                    {/* profile */}
                    <ProfileCard topGenres={topGenres} data={data} logout={logout} totalPlaylists={totalPlaylists} />


                    {/* Top Tracks */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <Title title="Top Tracks" subtitle="Your top tracks of all time" link="/tracks" />

                        <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-6 md:gap-7 gap-4 my-10">
                            {data?.topTracks && (data?.topTracks.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data?.topTracks.slice(0, 10).map((track: any, i: number) => (
                                <TrackCard key={i} track={track} i={i} />
                            )))}
                        </div>
                    </div>


                    {/* Top Artists */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <Title title="Top Artists" subtitle="Your top artists of all time" link="/artists" />

                        <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-6 md:gap-7 gap-4 my-10">
                            {data?.topArtists && (data?.topArtists.items.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data?.topArtists.items.slice(0, 10).map((artist: any, i: number) => (
                                <ArtistCard key={i} artist={artist} i={i} />
                            )))}
                        </div>

                    </div>

                    {/* Playlists */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <Title title="Playlists" subtitle="Your playlists" link="/playlists" />

                        <div className="grid lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr)] lg:gap-6 md:gap-7 gap-4 my-10">
                            {data?.playlists && (data?.playlists.items.length === 0 ? <p className="text-center w-full py-16">No items.</p> : data?.playlists.items.slice(0, 10).map((playlist: any, i: number) => (
                                <PlaylistCard key={i} playlist={playlist} i={i} />
                            )))}
                        </div>
                    </div>

                    {/* Playlists */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <Title title="Albums" subtitle="Your saved albums" link="/albums" />
                        <Albums />
                    </div>

                    {/* Liked Songs */}

                    <div className="m-auto w-full lg:px-16 md:px-16 px-5 my-16">
                        <Title title="Liked Songs" subtitle="Your favourite tracks" link="/liked" />

                        <div className="flex flex-wrap divide-y divide-gray-800 gap-5 my-10">
                            {likedSongsLoading ?
                                <Loader /> :
                                likedSongsError ?
                                    <ErrorFallback refetch={refetchLikedSongs} /> :
                                    (likedSongs.length === 0 ? <p className="text-center w-full py-16">No items.</p> : likedSongs.slice(0, 10).map((recent: any, i: number) => (
                                        <Track key={i} trackId={recent.track.id} trackAlbum={recent.track.album.name} trackArtists={recent.track.album.artists} trackDuration={recent.track.duration_ms} trackPlayedAt={recent.played_at} trackImage={recent.track.album.images[1].url} trackName={recent.track.name} tractAlbumId={recent.track.album.id} />
                                    )))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;