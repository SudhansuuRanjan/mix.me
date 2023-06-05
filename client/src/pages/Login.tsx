import { FunctionComponent } from "react";

interface LoginProps {

}

const Login: FunctionComponent<LoginProps> = () => {
    return (
        <div className="flex-col min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-semibold">SpotiStat</h1>
            <a className="inline-block bg-green-500 rounded-full px-8 py-2.5 mx-3 mt-8 min-w-min font-semibold text-white tracking-wider uppercase text-sm text-center hover:bg-green-600 focus:bg-green-600" href="http://localhost:8080/login">Login to Spotify</a>
        </div>
    );
}

export default Login;