import { useState, useEffect } from 'react';
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import AOS from 'aos';
import "aos/dist/aos.css";
import { AiOutlineWarning } from "react-icons/ai"

function App() {
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
      <Router>
        <AppRoutes />
      </Router>
    </div>
  )
}

export default App
