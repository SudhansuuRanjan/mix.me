import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'
import { useNavContext } from '../context/NavContext'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../spotify'


const NavBar2 = () => {
    const { navTitle } = useNavContext();

    // Go back to previous page
    const goBack = () => {
        window.history.back();
    }

    // Go forward to next page
    const goForward = () => {
        window.history.forward();
    }

    // ON scrolling down show navbar else hide it
    const [show, setShow] = useState(false);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            setShow(true);
        } else {
            setShow(false);
        }
    })

    const { data, isLoading } = useQuery({
        queryKey: ['profile-img'],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const res = await getUser();
            return res.data;
        },
    });

    return (
        <>
            <div className={`fixed z-10 top-0 bg-[#2c0b0b] lg:pl-24 md:pl-24 pr-3 w-full py-3 flex items-center justify-between shadow-lg transition-all ease-in  ${!show && 'opacity-0'}`}>
                <div className='flex gap-3 items-center'>
                    <div className='flex gap-2 items-center ml-2'>
                        <button onClick={goBack} className='bg-[#000] hover:bg-gray-950 text-white p-2.5 rounded-full'>
                            <FiArrowLeft />
                        </button>
                        <button onClick={goForward} className='bg-[#000] hover:bg-gray-950 text-white p-2.5 lg:block md:block hidden rounded-full'>
                            <FiArrowRight />
                        </button>
                    </div>
                    <h3 className="lg:text-xl md:text-lg text-base truncate lg:w-auto md:w-96 w-[14rem] font-semibold">{navTitle ? navTitle : "🎧 mix.me"}</h3>
                </div>
                <div className='w-auto'>
                    <Link onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} to="/">
                        <img width={40} height={40} src={isLoading ? "https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg" : data.images.length !== 0 ? data.images[0].url : "https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg"} alt="Profile" className="w-9 h-19 rounded-full border-2 border-gray-900" />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default NavBar2