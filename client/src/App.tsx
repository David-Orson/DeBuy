// npm
import React, { useEffect, useState } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    useNavigate,
} from "react-router-dom";
import { ethers } from "ethers";

// abi
import deBucks from "./abi/deBucks.json";
import deBucksSale from "./abi/deBucksSale.json";
import deBuyAbi from "./abi/deBuy.json";

// views
import Landing from "./views/Landing";
import Browse from "./views/Browse";

// types
import { Abis, W3 } from "./abi/types";

// hooks
import { useHooks } from "./hooks";

const abis: Abis = {
    deBucks,
    deBucksSale,
    deBuy: deBuyAbi,
};

const deBx = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const deBxSale = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const deBuy = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const App = () => {
    // hooks
    const hooks = useHooks();

    // state
    const [w3, setW3] = useState<W3>({} as W3);

    // router
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Landing w3={w3} setW3={setW3} />,
        },
        {
            path: "/browse",
            element: <Browse w3={w3} setW3={setW3} />,
        },
    ]);

    // lifecycle
    useEffect(() => {
        if (window.ethereum) {
            if (localStorage.getItem("userAddr")) {
                // the deBxBalance hook sets w3 with the address and balance along with the dummy w3 passed in here.
                hooks.deBxBalance(
                    {
                        deBx,
                        deBxSale,
                        deBuy,
                        abis,
                        provider: new ethers.BrowserProvider(window.ethereum),
                        userAddr: localStorage.getItem("userAddr") || "",
                        balance: BigInt(0),
                    },
                    setW3,
                    localStorage.getItem("userAddr") as string
                );
            } else {
                // otherwise we have no user in storage so set up the w3 with the base properties.
                setW3({
                    deBx,
                    deBxSale,
                    deBuy,
                    abis,
                    provider: new ethers.BrowserProvider(window.ethereum),
                    userAddr: "",
                    balance: BigInt(0),
                });
            }
        }
    }, []);

    // methods
    const logout = () => {
        localStorage.removeItem("userAddr");
        window.location.href = "/";
        setW3({
            ...w3,
            userAddr: "",
            balance: BigInt(0),
        });
    };

    return (
        <div className="App">
            {w3.userAddr && (
                <div>
                    <div>{w3.userAddr}</div>
                    <button onClick={logout}>logout</button>
                </div>
            )}
            <RouterProvider router={router} />
        </div>
    );
};

export default App;
