import { W3 } from "../abi/types";
import { ethers } from "ethers";

export const useHooks = () => {
    const connectWallet = async (w3: W3, setW3: (w3: W3) => void) => {
        if (window.ethereum) {
            try {
                const accounts = (await window.ethereum.request({
                    method: "eth_requestAccounts",
                })) as string[];

                if (!accounts || accounts.length == 0) return;

                localStorage.setItem("userAddr", accounts[0]);

                await deBxBalance(w3, setW3, accounts[0]);
            } catch (error) {
                console.error("User denied account access");
            }
        }
    };

    const deBxBalance = async (
        w3: W3,
        setW3: (w3: W3) => void,
        addr: string
    ) => {
        console.log("Fetching token balance");
        console.log("pre", w3.provider, addr);
        if (!w3.provider || !addr) return;

        console.log("prefire");

        const tokenContract = new ethers.Contract(
            w3.deBx,
            w3.abis.deBucks,
            w3.provider
        );
        console.log("postfire", w3.userAddr);
        const balance = await tokenContract.balanceOf(addr);
        console.log("Balance: ", balance, balance.toString());
        setW3({
            ...w3,
            userAddr: addr,
            balance,
        });
    };

    return { connectWallet, deBxBalance };
};
