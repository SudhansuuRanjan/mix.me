import { Link } from 'react-router-dom';

const TrackCard = ({ track, i }: any) => {
    return (
        <div data-aos="fade-up" key={track.id}>
            <Link to={track.name ? `/track/${track.id}` : ''}>
                <div className="track-card aspect-square overflow-hidden bg-gray-950 rounded-md">
                    <img height={400} width={400} loading='lazy' src={track.album.images[1] ? track.album.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className=" rounded-md" alt="Album Cover" />
                </div>
            </Link>
            <Link to={track.name ? `/track/${track.id}` : ''} className="text-base font-semibold pt-2">
                <p className="pt-2">{i + 1 + ". " + (track.name ? track.name : 'Track Unavailable')}</p>
            </Link>
            <p className="text-sm font-medium">{track.artists.length > 0 ? track.artists.map((artist: any, i: number) => (
                <span key={i}>
                    <Link className="text-gray-400 hover:text-green-500 hover:underline" to={`/artist/${artist.id}`}>
                        {artist.name}
                    </Link>
                    {
                        (i < track.artists.length - 1 ? ", " : "")
                    }
                </span>
            )) : 'Unavailable'}</p>
        </div>
    )
}

export default TrackCard