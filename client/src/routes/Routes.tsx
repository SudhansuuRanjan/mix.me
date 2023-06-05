import { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Artists, Profile, Playlists, Recent, Track, Playlist, Artist, Recommendations } from '../pages';

interface AppRoutesProps {

}

const AppRoutes: FunctionComponent<AppRoutesProps> = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Profile />} />
                <Route path="/recent" element={<Recent />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlists/:playlistId" element={<Playlist />} />
                <Route path="/tracks/:trackId" element={<Track />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:artistId" element={<Artist />} />
                <Route path="/recommendations/:playlistId" element={<Recommendations />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;