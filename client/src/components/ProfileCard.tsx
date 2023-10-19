

const ProfileCard = ({ data, logout, totalPlaylists }: any) => {
    return (
        <div data-aos="zoom-in-up" className="m-auto mt-16 flex flex-col items-center justify-center">
            <div>
                <img src={data?.user.images.length !== 0 ? data?.user.images[1].url : "https://maheshwaricollege.ac.in/publicimages/thumb/members/400x400/mgps_file_d11584807164.jpg"} className="lg:h-44 h-36 w-36 lg:w-44 rounded-full" alt="Avatar" />
            </div>
            <div className="text-center">
                <a href={`https://open.spotify.com/user/${data?.user.id}`} target="_blank"><p className="lg:text-5xl md:text-4xl text-3xl font-bold my-3 hover:text-green-500">{data?.user.display_name}</p></a>
                <div className="flex justify-center gap-6 items-center mt-3">
                    <div>
                        <p className="text-xl font-semibold text-green-500">{data?.user.followers.total}</p>
                        <p className="text-sm text-gray-400">FOLLOWERS</p>
                    </div>

                    <div>
                        <p className="text-xl font-semibold text-green-500">{data?.followedArtists && data?.followedArtists.artists.items.length}</p>
                        <p className="text-sm text-gray-400">FOLLOWING</p>
                    </div>

                    <div>
                        <p className="text-xl font-semibold text-green-500">{totalPlaylists}</p>
                        <p className="text-sm text-gray-400">PLAYLISTS</p>
                    </div>
                </div>

                <div className="my-10">
                    <button onClick={logout} className="text-white border px-9 py-2.5 rounded-full text-sm hover:text-black hover:bg-white">
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard