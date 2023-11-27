// npm
import React from "react";

// components
import { LandingHeader } from "../molecules";

type LandingPageProps = {
    connect: () => void;
};

export const LandingPage = ({ connect }: LandingPageProps) => {
    return <LandingHeader connect={connect} />;
};

export default LandingPage;
