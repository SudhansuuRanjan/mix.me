import { Link } from "react-router-dom"

const Error = () => {
    return (
        <div className='flex flex-col justify-center min-h-screen w-full items-center text-center px-5'>
            <img src="./images/error.webp" className="w-64" alt="search" />
            <h1 className='text-white text-lg font-medium'>Page not Found.</h1>
            <p className='text-gray-400 text-sm'>The page you are looking for does not exist.</p>
            <div className='text-white text-sm font-medium mt-5'>
                <Link to="/">
                    <button
                        className='text-black font-medium uppercase py-2.5 px-6 rounded-full hover:bg-green-600 bg-green-500'
                    >
                        Go to Home
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Error