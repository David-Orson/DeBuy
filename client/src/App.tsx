import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import TokenABI from "./abi/toyTokenAbi.json";

const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {
    const [provider, setProvider] = useState<any>(undefined);
    const [userAddress, setUserAddress] = useState<string | undefined>(
        undefined
    );
    const [tokenBalance, setTokenBalance] = useState<BigInt>(BigInt(0));
    const [transferTo, setTransferTo] = useState<string>("");
    const [transferAmount, setTransferAmount] = useState<string>("");

    useEffect(() => {
        if (window.ethereum) {
            setProvider(new ethers.BrowserProvider(window.ethereum));
        }
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = (await window.ethereum.request({
                    method: "eth_requestAccounts",
                })) as string[];
                // Set the first account as the user's address
                setUserAddress(
                    accounts && accounts.length > 0 ? accounts[0] : ""
                );
            } catch (error) {
                console.error("User denied account access");
            }
        }
    };

    const fetchTokenBalance = async () => {
        console.log("Fetching token balance");
        if (!provider || !userAddress) return;

        console.log("prefire");

        const tokenContract = new ethers.Contract(
            tokenAddress,
            TokenABI,
            provider
        );
        console.log("postfire", userAddress);
        const balance = await tokenContract.balanceOf(userAddress);
        console.log("Balance: ", balance, balance.toString());
        setTokenBalance(balance);
    };

    // Function to handle the transfer of tokens
    const transferTokens = async () => {
        if (!provider || !userAddress) {
            console.error("Provider or user address not found");
            return;
        }

        try {
            console.log("Transfering tokens");
            // Create a signer from the provider and user's address
            const signer = await provider.getSigner(userAddress);

            console.log("Signer: ", signer);

            const abi = ["function transfer(address to, uint amount)"];

            // Create a new instance of the contract connected to the signer,
            // which allows you to perform write operations
            const tokenContract = new ethers.Contract(
                tokenAddress,
                abi,
                signer
            );

            console.log("Token Contract: ", tokenContract);

            // Convert the amount to the correct unit based on the token's decimals
            // This is not required for TTK, but maybe for ETH or other tokens
            // const amountInWei = ethers.parseUnits(transferAmount, "ether"); // Replace 'ether' with the token's actual decimals if different

            // console.log("Amount in Wei: ", amountInWei);

            // Execute the transfer

            const tx = await tokenContract.transfer(transferTo, transferAmount);

            // this is an eth transfer
            /*const tx = await signer.sendTransaction({
                to: transferTo,
                value: ethers.parseEther("1.0"),
            });*/

            console.log("Tx: ", tx);

            // Wait for the transaction to be mined
            await tx.wait();

            console.log(`Transfer successful! Hash: ${tx.hash}`);
        } catch (error) {
            console.error("Transfer failed:", error);
        }
    };

    // More functionalities like connect wallet, transfer tokens, etc.

    return (
        <div className="App">
            <button onClick={connectWallet}>connect</button>
            <div>{userAddress}</div>
            <button onClick={fetchTokenBalance}>fetch balance</button>
            <div>{tokenBalance.toString()} TTK</div>
            <div>
                {/* Input for the recipient's address */}
                <input
                    type="text"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="Recipient Address"
                />

                {/* Input for the amount to transfer */}
                <input
                    type="text"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Amount to Transfer"
                />

                {/* Button to initiate the transfer */}
                <button onClick={transferTokens}>Transfer Tokens</button>

                {/* ... rest of your component ... */}
            </div>
        </div>
    );
}

export default App;
