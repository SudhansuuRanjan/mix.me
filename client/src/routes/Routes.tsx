import { FunctionComponent} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Artists, Profile, Playlists, Recent, Track,Tracks, Playlist, Artist, Recommendations } from '../pages';
import NavBar from '../components/NavBar';


const AppRoutes: FunctionComponent = () => {
    return (
        <Router>
            <div className='flex lg:flex-row md:flex-row flex-col-reverse'>
               <div className='w-24'><NavBar /></div> 
                <div className='w-full'>
                    <Routes>
                        <Route path="/" element={<Profile />} />
                        <Route path="/recent" element={<Recent />} />
                        <Route path="/playlists" element={<Playlists />} />
                        <Route path="/playlists/:playlistId" element={<Playlist />} />
                        <Route path="/track/:trackId" element={<Track />} />
                        <Route path="/tracks" element={<Tracks />} />
                        <Route path="/artists" element={<Artists />} />
                        <Route path="/artists/:artistId" element={<Artist />} />
                        <Route path="/recommendations/:playlistId" element={<Recommendations />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default AppRoutes;