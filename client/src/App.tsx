import { useState, useEffect } from 'react';
import './App.css'
import { token } from './spotify';
import AppRoutes from './routes/Routes';
import Login from './pages/Login';
import AOS from 'aos';
import "aos/dist/aos.css";
import { AiOutlineWarning } from "react-icons/ai"

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onlineStatusHandler = () => {
      setIsOnline(navigator.onLine);
    };

    // Add event listeners for online and offline events
    window.addEventListener('online', onlineStatusHandler);
    window.addEventListener('offline', onlineStatusHandler);

    AOS.init();
    AOS.refresh();
    setAccessToken(token);
    if (token) {
      // Remove hash parameters from the URL (if using hash-based routing)
      if (window.location.hash) {
        window.location.hash = '';
      }
    }

    console.clear();

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('online', onlineStatusHandler);
      window.removeEventListener('offline', onlineStatusHandler);
    };
  }, []);


  return (
    <div className='min-h-screen h-full relative'>
      <div className={`h-screen bg-black backdrop-blur ease-in-out delay-75 transition-all bg-opacity-80 fixed inset-0 z-[200] ${isOnline && 'hidden'}`}>
        <div className='bg-red-900 border-b border-b-red-700 bg-opacity-30 py-5 text-red-500  w-full text-center flex flex-col items-center justify-cente px-6'>
          <div className="flex gap-2 items-center"><AiOutlineWarning size={28} /> <p>You are currently offline. Please check your internet connection.</p></div>
        </div>
      </div>

      {
        accessToken ? <AppRoutes /> : <Login />
      }
    </div>
  )
}

export default App
