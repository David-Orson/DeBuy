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
import { Abis, W3 } from "./abi/types";

// hooks
import { useContracts } from "./hooks";

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
        {
            path: "/profile",
            element: <Profile />,
        },
    ]);

    // lifecycle
    useEffect(() => {
        if (window.ethereum) {
            if (localStorage.getItem("userAddr")) {
                // the deBxBalance hook sets w3 with the address and balance along with the dummy w3 passed in here.
                contracts.deBxBalance(
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

    const buyDeBx = async () => {
        const signer = await w3.provider.getSigner();

        const transaction = {
            to: w3.deBxSale, // Replace with your contract address
            value: ethers.parseEther("1"), // Convert ETH amount to Wei
        };

        try {
            const txResponse = await signer.sendTransaction(transaction);
            await txResponse.wait();
            console.log("Transaction successful! Hash:", txResponse.hash);
        } catch (error) {
            console.error("Transaction failed:", error);
        }

        contracts.deBxBalance(w3, setW3, w3.userAddr);
    };

    const getDeBxSaleBalance = async () => {
        const deBxContract = new ethers.Contract(
            w3.deBx, // Replace with your DeBucks contract address
            w3.abis.deBucks, // ABI of DeBucks contract
            w3.provider
        );

        try {
            const balance = await deBxContract.balanceOf(w3.deBxSale); // Replace with your DeBucksSale contract address
            console.log("DeBxSale Contract DeBx Balance:", balance.toString());
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const fundDeBucksSaleContract = async () => {
        // Create a provider and signer
        const signer = await w3.provider.getSigner();

        // Initialize the DeBucks contract
        const deBucksContract = new ethers.Contract(
            w3.deBx,
            w3.abis.deBucks,
            signer
        );

        // Approve the DeBucksSale contract to spend the specified amount of DeBx
        const approveTx = await deBucksContract.approve(w3.deBxSale, 10000);
        await approveTx.wait();

        // Transfer DeBx from the owner to the DeBucksSale contract
        const transferTx = await deBucksContract.transfer(w3.deBxSale, 10000);
        await transferTx.wait();

        console.log(`Transferred ${10000} DeBx to the sale contract`);
    };

    return (
        <div className="App">
            {w3.userAddr && (
                <div>
                    <div>{w3.userAddr}</div>
                    <button onClick={logout}>logout</button>
                    <button onClick={buyDeBx}>buy DeBx</button>
                    <button onClick={getDeBxSaleBalance}>sale balance</button>
                    <button onClick={() => fundDeBucksSaleContract()}>
                        fund sale contract
                    </button>
                </div>
            )}
            <RouterProvider router={router} />
        </div>
    );
};

export default App;
