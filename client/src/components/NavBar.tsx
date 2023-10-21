import { useState, useEffect } from 'react'
import { FaUser, FaHistory } from 'react-icons/fa'
import { IoMdMicrophone } from 'react-icons/io'
import { MdAudiotrack } from 'react-icons/md'
import { TbPlaylist } from 'react-icons/tb'
import { AiFillGithub, AiFillHeart } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'


const NavBar = () => {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    let navLinks = [
        {
            title: 'Profile',
            path: '/',
            id: 1,
            icon: <FaUser size={18} />
        },
        {
            title: 'Top Artists',
            path: '/artists',
            id: 2,
            icon: <IoMdMicrophone size={18} />
        },
        {
            title: 'Top Tracks',
            path: '/tracks',
            id: 3,
            icon: <MdAudiotrack size={18} />
        },
        {
            title: 'Recent',
            path: '/recent',
            id: 4,
            icon: <FaHistory size={18} />
        },
        {
            title: 'Playlists',
            path: '/playlists',
            id: 5,
            icon: <TbPlaylist size={18} />
        },
        {
            title: 'Search',
            path: '/search',
            id: 7,
            icon: <FiSearch size={18} />
        },
        {
            title: 'Liked',
            path: '/liked',
            id: 6,
            icon: <AiFillHeart size={18} />
        },
    ]

    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);



    return (
        <div className='lg:w-24 z-50 md:w-24 w-full bg-black flex lg:flex-col md:flex-col flex-row items-center justify-between lg:h-screen md:h-screen h-20 fixed bottom-0'>
            <NavLink to="/" className='lg:flex md:flex hidden'>
                <img src="./images/mini-logo.svg" className='w-[4.5rem] px-2 my-4' alt="spotify logo" />
            </NavLink>

            <div className='flex lg:flex-col md:flex-col flex-row items-center justify-between my-5 w-full'>
                {
                    navLinks.slice(0, windowSize.innerWidth > 700 ? 7 : 6).map((link) => {
                        return (
                            <NavLink key={link.id} className="w-full" style={{ textDecoration: "none" }} to={link.path}>
                                {({ isActive }: { isActive: boolean }) => (
                                    <div className={`flex flex-col lg:w-22 md:w-22 w-full lg:h-[4.2rem] md:h-[4.2rem] h-20 cursor-pointer text-gray-400 font-light hover:font-medium hover:text-white border-black lg:border-l-4 md:border-l-4 lg:border-b-0 md:border-b-0 border-b-4 hover:border-green-500 hover:bg-gray-900 items-center justify-center gap-2 lg:text-2xl md:text-2xl text-xl ${isActive && 'border-green-500 bg-gray-900 text-white'}`}>
                                        {link.icon}
                                        <p className='lg:text-xs md:text-xs text-[0.6rem]'>{link.title}</p>
                                    </div>
                                )}
                            </NavLink>
                        )
                    })
                }
            </div>

            <div className='my-5 lg:flex md:flex hidden'>
                <a target='_blank' href="https://github.com/SudhansuuRanjan/mix.me">
                    <AiFillGithub size={32} className='text-gray-400 hover:text-white' />
                </a>
            </div>
        </div>
    )
}

export default NavBar