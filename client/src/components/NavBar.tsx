import { FaUser, FaHistory } from 'react-icons/fa'
import { IoMdMicrophone } from 'react-icons/io'
import { MdAudiotrack } from 'react-icons/md'
import { TbPlaylist } from 'react-icons/tb'
import { AiFillGithub, AiFillHeart } from 'react-icons/ai'
import { NavLink} from 'react-router-dom'

const NavBar = () => {
    return (
        <div className='lg:w-24 z-50 md:w-24 w-full bg-black flex lg:flex-col md:flex-col flex-row items-center justify-between lg:h-screen md:h-screen h-20 fixed bottom-0'>
            <NavLink to="/" className='lg:flex md:flex hidden'>
                <img src="./images/logo.png" className='w-16 px-2 my-4' alt="spotify logo" />
            </NavLink>

            <div className='flex lg:flex-col md:flex-col flex-row items-center justify-between my-5 w-full'>
                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 lg:text-2xl md:text-2xl text-xl ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <FaUser  />
                            <p className='lg:text-xs md:text-xs text-[0.6rem]'>Profile</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/artists">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 lg:text-2xl md:text-2xl text-xl ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <IoMdMicrophone  />
                            <p className='lg:text-xs md:text-xs text-[0.6rem]'>Top Artists</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/tracks">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 lg:text-2xl md:text-2xl text-xl  ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <MdAudiotrack />
                            <p className='lg:text-xs md:text-xs text-[0.6rem]'>Top Tracks</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/recent">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 lg:text-2xl md:text-2xl text-xl  ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <FaHistory />
                            <p className='lg:text-xs md:text-xs text-[0.6rem]'>Recent</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full" style={{ textDecoration: "none" }} to="/playlists">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 lg:text-2xl md:text-2xl text-xl ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <TbPlaylist  />
                            <p className='lg:text-xs md:text-xs text-[0.6rem]'>Playlists</p>
                        </div>
                    )}
                </NavLink>

                <NavLink className="w-full lg:block md:block hidden" style={{ textDecoration: "none" }} to="/liked">
                    {({ isActive }: { isActive: boolean }) => (
                        <div className={`flex flex-col lg:w-24 md:w-24 w-full h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 lg:text-2xl md:text-2xl text-xl ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                            <AiFillHeart  />
                            <p className='lg:text-xs md:text-xs text-[0.6rem]'>Liked</p>
                        </div>
                    )}
                </NavLink>
            </div>

            <div className='my-5 lg:flex md:flex hidden'>
                <a target='_blank' href="https://github.com/SudhansuuRanjan/SpotiStat">
                    <AiFillGithub size={32} className='text-gray-400 hover:text-white' />
                </a>
            </div>
        </div>
    )
}

export default NavBar