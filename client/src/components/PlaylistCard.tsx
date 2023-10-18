import { Link } from "react-router-dom"

const PlaylistCard = ({ i, playlist }: any) => {
    return (
        <div data-aos="fade-up" key={i}>
            <Link to={`/playlist/${playlist.id}`}>
                <div className="track-card bg-gray-950 rounded-md">
                    <img height={400} width={400} loading='lazy' src={playlist.images.length !== 0 ? playlist.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-md" alt="Album Cover" />
                </div>
            </Link>
            <p className="text-base font-semibold mt-2">{(playlist.name ? playlist.name : 'Playlist Unavailable')}</p>
            <p className="text-xs text-green-500 my-1">By <a className="underline hover:text-blue-400" target="_blank" href={playlist.owner.external_urls.spotify}>{playlist.owner.display_name.length > 16 ? playlist.owner.display_name.substring(0, 16) + ".." : playlist.owner.display_name}</a></p>
            <p className="text-sm text-gray-500">{playlist.tracks.total} TRACKS</p>
        </div>
    )
}

export default PlaylistCard;