import { FaUser, FaHistory } from 'react-icons/fa'
import { IoMdMicrophone } from 'react-icons/io'
import { MdAudiotrack } from 'react-icons/md'
import { TbPlaylist } from 'react-icons/tb'
import { AiFillGithub } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
    return (
        <div className='lg:w-24 z-50 md:w-24 w-full bg-black flex lg:flex-col md:flex-col flex-row items-center justify-between lg:h-screen md:h-screen h-20 fixed bottom-0'>
            <div className='lg:flex md:flex hidden'>
                <img src="./images/logo.png" className='w-16 px-2 my-4' alt="spotify logo" />
            </div>

            <div className='flex lg:flex-col md:flex-col flex-row items-center justify-between my-5 w-full'>
                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <FaUser size={20} />
                            <p className='text-xs'>Profile</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/artists">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <IoMdMicrophone size={20} />
                            <p className='text-xs'>Top Artists</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/tracks">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <MdAudiotrack size={20} />
                            <p className='text-xs'>Top Tracks</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/recent">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <FaHistory size={20} />
                            <p className='text-xs'>Recent</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/playlists">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <TbPlaylist size={20} />
                            <p className='text-xs'>Playlists</p>
                        </div>
                    )}
                </NavLink>
            </div>

            <div className='my-5 lg:flex md:flex hidden'>
                <a href="#">
                    <AiFillGithub size={32} className='text-gray-400 hover:text-white' />
                </a>
            </div>
        </div>
    )
}

export default NavBar