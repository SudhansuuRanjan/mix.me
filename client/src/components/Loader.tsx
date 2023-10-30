import React from 'react';

const Container = ({ children,...rest }: { children: React.ReactNode }) => (
    <div {...rest} className="flex items-center justify-center w-full h-[24rem] flex-col gap-3">
        {children}
    </div>
);

const Loader = () => (
    <Container>
        <div className="flex items-end justify-center space-x-2 mt-24 h-[5rem]">
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
        </div>
    </Container>
);

export default Loader;
