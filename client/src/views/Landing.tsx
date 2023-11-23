// npm
import React, { useState } from "react";
import { ethers } from "ethers";

// types
import { W3 } from "../abi/types";
import { Navigate, useNavigate } from "react-router";
import { useHooks } from "../hooks";

type LandingProps = {
    w3: W3;
    setW3: (w3: W3) => void;
};

const Landing = ({ w3, setW3 }: LandingProps) => {
    const navigate = useNavigate();
    const hooks = useHooks();

    const connect = async () => {
        hooks.connectWallet(w3, setW3);
        navigate("/browse");
    };

    return (
        <div>
            <button onClick={connect}>connect</button>
            {/*<button onClick={fetchTokenBalance}>fetch balance</button>
            <div>{w3.balance.toString()} TTK</div>*/}
        </div>
    );
};

export default Landing;
