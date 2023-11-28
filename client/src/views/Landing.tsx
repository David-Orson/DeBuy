// npm
import React from "react";
import { useNavigate } from "react-router";

// types
import { W3 } from "../types";

// hooks
import { useContracts } from "../hooks";

// components
import { LandingPage } from "../components/pages";

type LandingProps = {
    w3: W3;
    setW3: (w3: W3) => void;
    setItems: (items: any) => void;
};

const Landing = ({ w3, setW3, setItems }: LandingProps) => {
    // hooks
    const navigate = useNavigate();
    const contracts = useContracts();

    // methods
    const connect = async () => {
        await contracts.connectWallet(w3, setW3);
        contracts.refreshItems(w3, setW3).then((items) => {
            setItems(items);
        });

        navigate("/shop/browse");
    };

    return <LandingPage connect={connect} />;
};

export default Landing;
