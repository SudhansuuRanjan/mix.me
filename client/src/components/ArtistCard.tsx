import { Link } from "react-router-dom"

const ArtistCard = ({ artist, i }: any) => {
    return (
        <Link data-aos="fade-up" to={`/artist/${artist.id}`}>
            <div>
                <div className="artist-card aspect-square overflow-hidden rounded-full">
                    <img height={500} width={500} loading='lazy' src={artist.images[1] ? artist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-full" alt="Album Cover" />
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