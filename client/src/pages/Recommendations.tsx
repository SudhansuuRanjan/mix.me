import { FunctionComponent, useState, useEffect } from "react";
import { getRecommendationsForTracks, getPlaylist, getUser, createPlaylist, addTracksToPlaylist } from "../spotify";
import { catchErrors } from "../utils";
import Track from "../components/Track";
import { Link, useNavigate } from "react-router-dom";


const Recommendations: FunctionComponent = () => {
    document.title = `Recommendations • SpotiStat`;
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any>(null);
    const [newPlaylist, setNewPlaylist] = useState<string>("");

    const playlistId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getPlaylist(playlistId);
            setPlaylist(data);
            const { data: recommendations } = await getRecommendationsForTracks(data.tracks.items);
            setRecommendations(recommendations.tracks);
            // console.log(recommendations.tracks);
        };

        catchErrors(fetchData());
    }, [playlistId]);

    const handleCreatePlaylist = async () => {
        try {
            const { data } = await getUser();
            const userId = data.id;
            const { data: playlst } = await createPlaylist(userId, prompt("Enter a name for your new playlist") ?? `Recommended Songs for ${playlist.name}`);
            const playlstId = playlst.id;
            const trackUris = recommendations.map(({ uri }: any) => uri);
            await addTracksToPlaylist(playlstId, trackUris);
            setNewPlaylist(playlstId);
            alert("Playlist created successfully!");
            navigate(`/playlist/${playlstId}`);
        } catch (error) {
            alert("Something went wrong!")
        }
    }

    return (
        <div>
            <div className="m-auto w-full lg:px-24 md:px-12 px-6 my-16 text-white">
                {
                    recommendations &&
                    <div>
                        <div className="flex justify-between items-center gap-6">
                            <p className="text-2xl font-semibold">Recommendations based on <Link to={`/playlist/${playlist.id}`} className="text-green-500 hover:underline">{playlist.name}</Link></p>
                            <button onClick={handleCreatePlaylist} className="text-white bg-green-600 hover:bg-white hover:text-black rounded-full px-4 py-2 text-xs font-light">SAVE TO SPOTIFY</button>
                        </div>
                        <div>
                            {newPlaylist && <p className="text-gray-200 mt-5">Playlist created successfully! <Link to={`/playlist/${newPlaylist}`} className="text-green-500 hover:underline">Open in Spotify</Link></p>}
                        </div>
                        <div className="flex flex-wrap gap-4 my-10">
                            {recommendations.map((track: any, i: number) => (
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