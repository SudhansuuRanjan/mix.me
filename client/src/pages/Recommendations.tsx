import { FunctionComponent, useEffect } from "react";
import { getRecommendationsForTracks, getPlaylist, getUser, createPlaylist, addTracksToPlaylist } from "../spotify";
import Track from "../components/Track";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import ErrorFallback from '../components/ErrorFallback'
import Loader from "../components/Loader";
import { QueryClient } from "@tanstack/react-query";


const Recommendations: FunctionComponent = () => {
    const queryClient = new QueryClient();
    const navigate = useNavigate();
    const { playlistId } = useParams() as { playlistId: string };


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['recommendations', playlistId],
        queryFn: async () => {
            const { data } = await getPlaylist(playlistId);
            const { data: recommendations } = await getRecommendationsForTracks(data.tracks.items);
            return { playlist: data, recommendations: recommendations.tracks };
        }
    })

    const { mutate: createPlaylistMutation, data: newPlaylist } = useMutation({
        mutationFn: async () => {
            const { data: user } = await getUser();
            const userId = user.id;
            const { data: playlst } = await createPlaylist(userId, prompt("Enter a name for your new playlist") ?? `Recommended Songs for ${data?.playlist.name}`);
            const playlstId = playlst.id;
            const trackUris = data?.recommendations.map(({ uri }: any) => uri);
            await addTracksToPlaylist(playlstId, trackUris);
            return playlstId;
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['playlists']);
            alert("Playlist created successfully!");
            navigate(`/playlist/${data}`);
        }
    });

    useEffect(() => {
        document.title = `${isLoading ? "Recommendations" : data?.playlist.name} • mix.me`;
    }, [data?.playlist])

    return (
        <div>
            <div className="m-auto w-full lg:px-24 md:px-16 px-6 pt-8 py-12 pb-32 text-white">
                {
                    isLoading ? <Loader /> : isError ? <ErrorFallback refetch={refetch} /> :
                        <div>
                            <div className="flex justify-between items-start lg:flex-row md:flex-row flex-col gap-6">
                                <p className="text-2xl font-semibold">Recommendations based on <Link to={`/playlist/${data?.playlist.id}`} className="text-green-500 hover:underline">{data?.playlist.name}</Link></p>
                                <button onClick={() => createPlaylistMutation()} className="text-white bg-green-600 hover:bg-white hover:text-black rounded-full px-4 py-2 text-xs font-light">SAVE TO SPOTIFY</button>
                            </div>
                            <div>
                                {newPlaylist && <p className="text-gray-200 mt-5">Playlist created successfully! <Link to={`/playlist/${newPlaylist}`} className="text-green-500 hover:underline">Open in Spotify</Link></p>}
                            </div>
                            <div className="flex flex-wrap gap-4 my-10">
                                {data?.recommendations.map((track: any, i: number) => (
                                    <Track key={i} trackId={track.id} trackAlbum={track.album.name} trackArtists={track.album.artists} trackDuration={track.duration_ms} trackPlayedAt={""} trackImage={track.album.images.length === 0 ? 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg' : track.album.images[2]?.url} trackName={track.name === "" ? "Unavailable" : track.name} tractAlbumId={track.id} />
                                ))}
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}

export default Recommendations;