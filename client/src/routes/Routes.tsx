import { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Artists, Profile, Playlists, Recent, Track, Tracks, Playlist, Artist, Recommendations, Album, LikedSongs, User, Search } from '../pages';
import NavBar from '../components/NavBar';
import ScrollToTop from '../hooks/useScrollToTop';
import ErrorBoundary from '../components/ErrorBoundary';


const AppRoutes: FunctionComponent = () => {
    return (
        <Router>
            <ScrollToTop />
            <div className='flex lg:flex-row md:flex-row flex-col-reverse'>
                <ErrorBoundary>
                    <div className='w-24'><NavBar /></div>
                    <div className='w-full'>
                        <Routes>
                            <Route path="/" element={<Profile />} />
                            <Route path="/recent" element={<Recent />} />
                            <Route path="/playlists" element={<Playlists />} />
                            <Route path="/playlist/:playlistId" element={<Playlist />} />
                            <Route path="/track/:trackId" element={<Track />} />
                            <Route path="/tracks" element={<Tracks />} />
                            <Route path="/artists" element={<Artists />} />
                            <Route path="/artist/:artistId" element={<Artist />} />
                            <Route path="/album/:albumId" element={<Album />} />
                            <Route path='/liked' element={<LikedSongs />} />
                            <Route path="/recommendations/:playlistId" element={<Recommendations />} />
                            <Route path="/user" element={<User />} />
                            <Route path="search" element={<Search />} />
                        </Routes>
                    </div>
                </ErrorBoundary>
            </div>
        </Router>
    );
}

export default AppRoutes;