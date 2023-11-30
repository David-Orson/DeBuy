// npm
import { useEffect, useState } from "react";

export const useWindowSize = () => {
    // state
    const [windowSize, setWindowSize] = useState<number>(1000);

    // methods
    const handleResize = () => {
        setWindowSize(window.innerWidth);
    };

    // lifecycle
    useEffect(() => {
        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};
