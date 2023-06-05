import { useState, useEffect } from 'react';
import './App.css'
import { token } from './spotify';
import AppRoutes from './routes/Routes';
import Login from './pages/Login';

function App() {
  const [accessToken, setAccessToken] = useState<string | null>('');

  useEffect(() => {
    setAccessToken(token);
  }, []);


  return (
    <div className='min-h-screen h-full'>
      {accessToken ? <AppRoutes /> : <Login />}
    </div>
  )
}

export default App
