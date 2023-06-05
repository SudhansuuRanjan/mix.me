import { FunctionComponent, useState, useEffect } from "react";
import { getUserInfo } from "../spotify";
import { catchErrors } from "../utils";
import { userData, followArtistData, playlistData, topArtistsData, topTracksData } from "../temp/index";

interface ProfileProps {

}

const Profile: FunctionComponent<ProfileProps> = () => {
    const [user, setUser] = useState<any>(userData);
    const [followedArtists, setFollowedArtists] = useState(followArtistData);
    const [playlists, setPlaylists] = useState<any>(playlistData);
    const [topArtists, setTopArtists] = useState(topArtistsData);
    const [topTracks, setTopTracks] = useState(topTracksData);

    useEffect(() => {
        const fetchData = async () => {
            const { user, followedArtists, playlists, topArtists, topTracks } = await getUserInfo();
            setUser(user);
            setFollowedArtists(followedArtists);
            setPlaylists(playlists);
            setTopArtists(topArtists);
            setTopTracks(topTracks);
            console.log(user, followedArtists, playlists, topArtists, topTracks);
        };
        // catchErrors(fetchData());
    }, []);

    const totalPlaylists = playlists ? playlists.total : 0;

    return (
        <div>
            <h1>Profile</h1>
            {user && (
                <div>
                    <div>
                        <img src={user.images[0].url} alt="Avatar" />
                    </div>
                    <div>
                        <a href={`https://open.spotify.com/user/${user.id}`} target="_blank">{user.display_name}</a>
                        <p>{user.followers.total} Followers</p>
                        <p>{user.email}</p>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Profile;