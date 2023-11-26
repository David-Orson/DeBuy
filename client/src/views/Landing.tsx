// npm
import React from "react";

// types
import { W3 } from "../abi/types";
import { useNavigate } from "react-router";
import { useContracts } from "../hooks";

type LandingProps = {
    w3: W3;
    setW3: (w3: W3) => void;
};

const Landing = ({ w3, setW3 }: LandingProps) => {
    const navigate = useNavigate();
    const contracts = useContracts();

    const connect = async () => {
        contracts.connectWallet(w3, setW3);
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
