// npm
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ethers } from "ethers";

// abi
import deBucks from "./abi/deBucks.json";
import deBucksSale from "./abi/deBucksSale.json";
import deBuyAbi from "./abi/deBuy.json";

// views
import Landing from "./views/Landing";
import Browse from "./views/Browse";
import Profile from "./views/Profile";

// types
import { Abis, Item, Review, W3 } from "./types";

// hooks
import { useContracts } from "./hooks";

// components
import { Navbar } from "./components/organisms";

// theme
import theme from "./theme";

// blockchain data
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
    const contracts = useContracts();

    // state
    const [w3, setW3] = useState<W3>({} as W3);
    const [items, setItems] = useState<Item[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // lifecycle
    useEffect(() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const initailW3 = {
            deBx,
            deBxSale,
            deBuy,
            abis,
            provider: provider,
            userAddr: "",
            balance: BigInt(0),
        };

        if (window.ethereum) {
            if (localStorage.getItem("userAddr")) {
                // the deBxBalance hook sets w3 with the address and balance along with the dummy w3 passed in here.
                contracts.deBxBalance(
                    {
                        ...initailW3,
                        userAddr: localStorage.getItem("userAddr") || "",
                    },
                    setW3,
                    localStorage.getItem("userAddr") as string
                );
            } else {
                // otherwise we have no user in storage so set up the w3 with the base properties.
                setW3(initailW3);
            }
        }
    }, []);

    // router
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Landing w3={w3} setW3={setW3} setItems={setItems} />,
        },
        {
            path: "/shop",
            element: <Navbar w3={w3} setW3={setW3} addr={w3.userAddr} />,
            children: [
                {
                    path: "/shop/browse",
                    element: <Browse w3={w3} setW3={setW3} items={items} />,
                },
                {
                    path: "/shop/profile",
                    element: <Profile />,
                },
            ],
        },
    ]);

    return (
        <div
            className="App"
            style={{
                backgroundColor: theme.color.primary(10),
                width: "100vw",
                height: "100vh",
            }}
        >
            {/*w3.userAddr && (
                <div>
                    {/* the navbar needs to have a button showing the user addr, a logout button, a profile button, and a button to buy DeBx. }
                    <button onClick={logout}>logout</button>
                    <button onClick={() => contracts.buyDeBx(w3, setW3)}>
                        buy DeBx
                    </button>
                    <button
                        onClick={() => contracts.getDeBxSaleBalance(w3, setW3)}
                    >
                        sale balance
                    </button>
                    <button
                        onClick={() =>
                            contracts.fundDeBucksSaleContract(w3, setW3)
                        }
                    >
                        fund sale contract
                    </button>
                </div>
            )*/}
            <RouterProvider router={router} />
        </div>
    );
};

export default App;
