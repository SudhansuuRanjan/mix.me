import { Link } from "react-router-dom"

const AlbumCard = ({ album }: any) => {
    return (
        <div data-aos="fade-up">
            <Link to={`/album/${album.id}`}>
                <div className="track-card">
                    <img loading="lazy" height={400} width={400} src={album.images[1].url ? album.images[0].url : 'https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg'} className="rounded-md" alt="Album Cover" />
                </div>
            </Link>
            <p className="text-base font-semibold mt-2">{(album.name ? album.name : 'Playlist Unavailable')}</p>
            <p className="text-xs text-green-500 my-1">By {
                album.artists.map((artist: any, i: number) => (
                    <span key={i}>
                        <Link className="hover:underline text-green-500" to={`/artist/${artist.id}`}>
                            {artist.name}
                        </Link>
                        {(i < album.artists.length - 1 ? ', ' : '')}
                    </span>
                ))
            }</p>
            <p className="text-sm text-slate-500">{album.total_tracks} {
                album.total_tracks > 1 ? 'SONGS' : 'SONG'
            }</p>
        </div>
    )
}

export default AlbumCard