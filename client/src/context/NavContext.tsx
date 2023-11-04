import { createContext, useContext, useState } from 'react';

export const NavContext = createContext<any>(null);

export const useNavContext = () => {
    return useContext(NavContext);
}

const NavProvider = ({ children }: { children: React.ReactNode }) => {
    const [navTitle, setNavTitle] = useState("🎧 mix.me");
    const [profileImg, setProfileImg] = useState("");

    return (
        <NavContext.Provider value={{
            navTitle,
            setNavTitle,
            profileImg,
            setProfileImg
        }}>
            {children}
        </NavContext.Provider>
    )
}

export default NavProvider;