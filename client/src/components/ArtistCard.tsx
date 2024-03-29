import { Link } from "react-router-dom"

const ArtistCard = ({ artist, i }: any) => {
    return (
        <Link className='md:bg-[#0e0e0e] md:hover:bg-[#141414] rounded-xl' data-aos="fade-up" to={`/artist/${artist.id}`}>
        <div className='transition hover:scale-[98%] lg:p-4 md:p-3 p-1'>
                <div className="artist-card aspect-square bg-cover overflow-hidden rounded-full">
                    <img height={500} width={500} loading='lazy' src={artist.images[1] ? artist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-full object-cover" alt="Album Cover" />
                </div>
                <p className="text-lg text-center font-semibold mt-3">{i + 1 + ". " + (artist.name ? artist.name : 'Artist Unavailable')}</p>
                <p className="text-xs mt-2 font-medium text-center text-slate-500">{artist.genres.length > 0 ? artist.genres.map((genre: any, i: number) => (
                    genre + (i < artist.genres.length - 1 ? ", " : "")
                )) : 'Unavailable'}</p>
            </div>
        </Link>
    )
}

export default ArtistCard