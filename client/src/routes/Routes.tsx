import { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Artists, Profile, Playlists, Recent, Track, Tracks, Playlist, Artist, Recommendations, Album, LikedSongs, User, Search, Error, LikedAlbums } from '../pages';
import NavBar from '../components/NavBar';
import NavBar2 from '../components/Navbar2';
import ScrollToTop from '../hooks/useScrollToTop';
import ErrorBoundary from '../components/ErrorBoundary';
import NavProvider from '../context/NavContext';


const AppRoutes: FunctionComponent = () => {
    return (
        <Router>
            <ScrollToTop />
            <div className='flex lg:flex-row md:flex-row flex-col-reverse lg:pb-6 md:pb-10 pb-24 '>
                <ErrorBoundary>
                    <NavProvider>
                        <div className='w-24'>
                            <NavBar />
                        </div>
                        <NavBar2 /> 
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
                                <Route path="/albums" element={<LikedAlbums />} />
                                <Route path="/album/:albumId" element={<Album />} />
                                <Route path='/liked' element={<LikedSongs />} />
                                <Route path="/recommendations/:playlistId" element={<Recommendations />} />
                                <Route path="/user" element={<User />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="*" element={<Error />} />
                            </Routes>
                        </div>
                    </NavProvider>
                </ErrorBoundary>
            </div>
        </Router>
    );
}

export default AppRoutes;