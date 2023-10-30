import { useState, useEffect } from 'react';
import './App.css'
import { token } from './spotify';
import AppRoutes from './routes/Routes';
import Login from './pages/Login';
import AOS from 'aos';
import "aos/dist/aos.css";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>('');

  useEffect(() => {
    AOS.init();
    AOS.refresh();
    setAccessToken(token);
    if (token) {
      // Remove hash parameters from the URL (if using hash-based routing)
      if (window.location.hash) {
        window.location.hash = '';
      }
    }
  }, []);


  return (
    <div className='min-h-screen h-full'>
        {accessToken ? <AppRoutes /> : <Login />}
    </div>
  )
}

export default App
