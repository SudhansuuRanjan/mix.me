import axios from 'axios';
import { getHashParams } from '../utils';

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

// TOKENS ******************************************************************************************
const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

const setTokenTimestamp = () => window.localStorage.setItem('spotify_token_timestamp', Date.now().toString());
const setLocalAccessToken = (token: string) => {
    setTokenTimestamp();
    window.localStorage.setItem('spotify_access_token', token);
};
const setLocalRefreshToken = (token: string) => window.localStorage.setItem('spotify_refresh_token', token);
const getTokenTimestamp = () => window.localStorage.getItem('spotify_token_timestamp');
const getLocalAccessToken = () => window.localStorage.getItem('spotify_access_token');
const getLocalRefreshToken = () => window.localStorage.getItem('spotify_refresh_token');


// Refresh the token
const refreshAccessToken = async () => {
    try {
        const { data } = await axios.get(`${API}/refresh_token?refresh_token=${getLocalRefreshToken()}`);
        console.log(`${API}/refresh_token?refresh_token=${getLocalRefreshToken()}`);
        const { access_token } = data;
        setLocalAccessToken(access_token);
        window.location.reload();
        return;
    } catch (e) {
        console.error(e);
    }
};

// Get access token off of query params (called on application init)
export const getAccessToken = () => {
    const { error, access_token, refresh_token } = getHashParams();

    if (error) {
        console.error(error);
        refreshAccessToken();
    }

    // If token has expired
    if (Date.now() - Number(getTokenTimestamp()) > EXPIRATION_TIME) {
        console.warn('Access token has expired, refreshing...');
        refreshAccessToken();
    }

    const localAccessToken = getLocalAccessToken();

    // If there is no ACCESS token in local storage, set it and return `access_token` from params
    if ((!localAccessToken || localAccessToken === 'undefined') && access_token) {
        setLocalAccessToken(access_token);
        setLocalRefreshToken(refresh_token);
        return access_token;
    }

    return localAccessToken;
};

export const token = getAccessToken();

export const logout = () => {
    window.localStorage.removeItem('spotify_token_timestamp');
    window.localStorage.removeItem('spotify_access_token');
    window.localStorage.removeItem('spotify_refresh_token');
    window.location.reload();
};


/* USER API CALLS */

const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
};

/**
 * 
 * @returns User's profile information
 * @docs https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-current-users-profile
 */
export const getUser = () => axios.get('https://api.spotify.com/v1/me', { headers });

/**
 * Get User's Followed Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/get-followed/
 */
export const getFollowing = () =>
    axios.get('https://api.spotify.com/v1/me/following?type=artist', { headers });

/**
 * Get Current User's Recently Played Tracks
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */
export const getRecentlyPlayed = () =>
    axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', { headers });

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
 */
export const getPlaylists = () => axios.get('https://api.spotify.com/v1/me/playlists?limit=50', { headers });

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 * @param timeRange
 */
export const getTopArtists = (timeRange: string) =>
    axios.get(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`, { headers });

// Get a Artist's Top Tracks
// https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-top-tracks/
export const getArtistTopTracks = (artistId: string) =>
    axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IN`, { headers });

// Get a Artist's Playlists
// https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/
export const getArtistAlbums = (artistId: string) =>
    axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?market=IN`, { headers });

// Get an Album
// https://developer.spotify.com/documentation/web-api/reference/albums/get-album/
export const getAlbum = (albumId: string) =>
    axios.get(`https://api.spotify.com/v1/albums/${albumId}`, { headers });

// Get an Album's Tracks
// https://developer.spotify.com/documentation/web-api/reference/albums/get-albums-tracks/
export const getAlbumTracks = (albumId: string) =>
    axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, { headers });


// Get liked songs
// https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/
export const getLikedSongs = (limit: number, offset: number) =>
    axios.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&market=IN&offset=${offset}`, { headers });



/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 * @param timeRange
 */
export const getTopTracks = (timeRange: string) =>
    axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, { headers });

/**
 * Get an Artist
 * https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/
 */
export const getArtist = (artistId: string) =>
    axios.get(`https://api.spotify.com/v1/artists/${artistId}`, { headers });

/**
 * Follow an Artist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 * @param artistId
 */
export const followUserOrArtist = (artistId: string, type: string) => {
    const url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${artistId}`;
    return axios({ method: 'put', url, headers });
};

/**
 * Unfollow an Artist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 * @param artistId
*/
export const unfollowUserOrArtist = (artistId: string, type: string) => {
    const url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${artistId}`;
    return axios({ method: 'delete', url, headers });
};

/**
 * Check if Current User Follows Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowArtistorUser = (artistId: string, type: string) =>
    axios.get(`https://api.spotify.com/v1/me/following/contains?type=${type}&ids=${artistId}`, {
        headers,
    });

/**
 * Check if Users Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowPlaylist = (playlistId: string, userId: string) =>
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${userId}`, {
        headers,
    });

/**
 * Create a Playlist (The playlist will be empty until you add tracks)
 * https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
 */
export const createPlaylist = (userId: string, name: string) => {
    const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const data = JSON.stringify({ name });
    return axios({ method: 'post', url, headers, data });
};

/**
 * Add Tracks to a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
 */
export const addTracksToPlaylist = (playlistId: string, uris: string[]) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`;
    return axios({ method: 'post', url, headers });
};

/**
 * Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-playlist/
 */
export const followPlaylist = (playlistId: string) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    return axios({ method: 'put', url, headers });
};

/**
 * Unfollow a Playlist
 * @param playlistId 
 * @returns 
 */
export const unfollowPlaylist = (playlistId: string) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    return axios({ method: 'delete', url, headers });
};

// Delete a Playlist
// https://developer.spotify.com/documentation/web-api/reference/playlists/remove-tracks-playlist/
export const deletePlaylist = (playlistId: string) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    return axios({ method: 'delete', url, headers });
};

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
 */
export const getPlaylist = (playlistId: string) =>
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers });

/**
 * Return a comma separated string of track IDs from the given array of tracks
 */
const getTrackIds = (tracks: any) => tracks.map(({ track }: { track: any }) => track.id).join(',');

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
 */
export const getAudioFeaturesForTracks = (tracks: any) => {
    const ids = getTrackIds(tracks);
    return axios.get(`https://api.spotify.com/v1/audio-features?ids=${ids}`, { headers });
};

/**
 * Get Recommendations Based on Seeds
 * https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
 */
export const getRecommendationsForTracks = (tracks: any) => {
    const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
    const seed_tracks = getTrackIds(shuffledTracks.slice(0, 5));
    const seed_artists = '';
    const seed_genres = '';

    return axios.get(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}&seed_genres=${seed_genres}`,
        {
            headers,
        },
    );
};

/**
 * Get a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 */
export const getTrack = (trackId: string) =>
    axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });

/**
 * Get Audio Analysis for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/
 */
export const getTrackAudioAnalysis = (trackId: string) =>
    axios.get(`https://api.spotify.com/v1/audio-analysis/${trackId}`, { headers });

/**
 * Get Audio Features for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
 */
export const getTrackAudioFeatures = (trackId: string) =>
    axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers });

export const getUserInfo = () =>
    axios
        .all([getUser(), getFollowing(), getPlaylists(), getTopArtists('long_term'), getTopTracks('long_term')])
        .then(
            axios.spread((user, followedArtists, playlists, topArtists, topTracks) => ({
                user: user.data,
                followedArtists: followedArtists.data,
                playlists: playlists.data,
                topArtists: topArtists.data,
                topTracks: topTracks.data,
            })),
        );

export const getTrackInfo = (trackId: string) =>
    axios
        .all([getTrack(trackId), getTrackAudioAnalysis(trackId), getTrackAudioFeatures(trackId)])
        .then(
            axios.spread((track, audioAnalysis, audioFeatures) => ({
                track: track.data,
                audioAnalysis: audioAnalysis.data,
                audioFeatures: audioFeatures.data,
            })),
        );

export const getAlbumInfo = (albumId: string) =>
    axios
        .all([getAlbum(albumId), getAlbumTracks(albumId)])
        .then(axios.spread((album, tracks) => ({ album, tracks })));


export const getUserProfile = (user_id: string) => {
    return axios.get(`https://api.spotify.com/v1/users/${user_id}`, { headers });
}

export const getUserPlaylists = (user_id: string) => {
    return axios.get(`https://api.spotify.com/v1/users/${user_id}/playlists`, { headers });
}

export const getUserDetails = (user_id: string) =>
    axios.all([getUserProfile(user_id), getUserPlaylists(user_id)])
        .then(axios.spread((profile, playlists) => ({ profile: profile.data, playlists: playlists.data })));

export const search = (query: string, type: string) => {
    const allowedTypes = ['album', 'artist', 'playlist', 'track'];
    if (!allowedTypes.includes(type)) {
        throw new Error('Invalid type');
    }
    return axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type}`, { headers });
}
