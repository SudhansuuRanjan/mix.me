import { Outlet, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { token } from '../spotify';

const PrivateRoute = () => {

    useEffect(() => {
        if (token) {
            // Remove hash parameters from the URL (if using hash-based routing)
            if (window.location.hash) {
                window.location.hash = '';
            }
        }

        console.clear();
    }, []);

    return (
        <div>
            {token ? <Outlet /> : <Navigate to={"/login"} />}
        </div>
    )
}

export default PrivateRoute