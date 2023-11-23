import react, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { W3 } from "../abi/types";

type BrowseProps = {
    w3: W3;
    setW3: (w3: W3) => void;
};

const Browse = ({ w3, setW3 }: BrowseProps) => {
    return (
        <div>
            <h1>Browse</h1>
            <div>{(w3.balance && w3.balance.toString()) || 0}</div>
        </div>
    );
};

export default Browse;
