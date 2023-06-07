import React from 'react';

const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-full h-screen">
        {children}
    </div>
);

const Bars = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-center items-end overflow-hidden w-100px min-w-100px h-50px mx-auto z-2 relative left-0 right-0">
        {children}
    </div>
);

const Bar = ({ delay, height }: { delay?: string, height: string }) => (
    <div
        className="w-3 h-1 m-0.5 bg-gray-500 animate-pulse"
        style={{ animationDelay: delay || '0ms' , height: height }}
    />
);

const Loader = () => (
    <Container>
        <Bars>
            <Bar delay="250ms" height="1rem" />
            <Bar delay="715ms" height="2rem" />
            <Bar delay="475ms" height="1.6rem"/>
            <Bar delay="25ms" height="1.2rem"/>
            <Bar delay="190ms" height="0.3rem"/>
        </Bars>
    </Container>
);

export default Loader;
