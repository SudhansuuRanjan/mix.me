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
  }, []);


  return (
    <div className='min-h-screen lg:pb-6 md:pb-10 pb-24 h-full'>
      {accessToken ? <AppRoutes /> : <Login />}
    </div>
  )
}

export default App
