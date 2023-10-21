import { FunctionComponent } from "react";

const Login: FunctionComponent = () => {
    return (
        <div className="h-screen w-full relative flex flex-col items-center">
            <div className="fixed flex items-center justify-between w-full py-5 lg:px-16 md:px-12 px-0">
                <img className="lg:h-12 h-10" height={100} width={200} src="/images/logo.svg" alt="logo" />
                <a className="inline-block bg-green-500 rounded-full px-6 py-2.5 mx-3 min-w-min font-semibold text-green-500 bg-opacity-20 tracking-wider uppercase text-sm text-center hover:bg-opacity-30 focus:bg-opacity-40" href={`${import.meta.env.VITE_API_URL}/login`}>Login</a>
            </div>
            <div className="flex lg:flex-row md:flex-row flex-col-reverse items-center w-full h-[80vh] justify-evenly">
                <div className="lg:max-w-md md:max-w-lg max-w-[85%]">
                    <h1 className=" text-green-500 lg:text-5xl md:text-4xl text-4xl font-bold pb-3"><span className="text-white">From</span> Beats <br /> <span className="text-white">to</span> Insights</h1>
                    <h3 className="text-gray-400 text-lg font-medium">Your Music, Your Universe.</h3>
                    <p className="lg:max-w-md md:max-w-sm text-sm text-gray-500 font-medium pt-3 pb-8">Unveil the treasure trove of your music choices, and gain a profound appreciation for the melodies that have accompanied you through life's journey.</p>
                    <a className="inline-block bg-green-600 rounded-full px-6 py-2.5 mx-3 min-w-min font-semibold text-white tracking-wider uppercase text-sm text-center hover:bg-green-700 focus:bg-green-600" href={`${import.meta.env.VITE_API_URL}/login`}>Login with Spotify</a>
                </div>
                <div>
                    <img className="lg:h-[16rem] md:h-[12rem] lg:block md:block hidden rounded-xl shadow-2xl border border-gray-900" src="/images/app.png" alt="Spotify" />
                </div>
            </div>

            <div className="absolute bottom-0 text-center m-auto py-5">
                <p className="text-gray-500 lg:max-w-6xl md:max-w-3xl text-sm pb-3 lg:px-0 md:px-10 px-6">
                    All copyrighted content (i.e. album artwork, audio) on mix.me are owned by their respective owners. Data is provided by Spotify AB. mix.me is in no way affiliated with Spotify AB.
                </p>
                <p>
                    Built with ❤️ by <a className="text-green-500 hover:underline font-medium" href="https://sudhanshur.vercel.app">Sudhanshu Ranjan</a>.
                </p>
            </div>
        </div>
    );
}

export default Login;