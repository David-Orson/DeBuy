import { W3 } from "../abi/types";
import { ethers } from "ethers";

export { useIpfs } from "./ipfs";

export const useContracts = () => {
    const connectWallet = async (w3: W3, setW3: (w3: W3) => void) => {
        if (window.ethereum) {
            try {
                const accounts = (await window.ethereum.request({
                    method: "eth_requestAccounts",
                })) as string[];

                if (!accounts || accounts.length === 0) return;

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

    const listItem = async (w3: W3, setW3: (w3: W3) => void, item: any) => {
        // Prompt user for wallet connection if not already connected
        //await w3.provider.send("eth_requestAccounts", []);

        console.log("Listing item");
        // Create a signer
        const signer = await w3.provider.getSigner();

        console.log("Signer: ", signer);
        // Initialize the contract
        const contract = new ethers.Contract(w3.deBuy, w3.abis.deBuy, signer);

        console.log("Contract: ", contract);
        console.log(
            item.ipfsHash,
            item.imageHash,
            item.metaHash,
            ethers.parseUnits(item.price, "ether")
        );

        // Call the listItem function
        const transaction = await contract.listItem(
            item.ipfsHash,
            item.imageHash,
            item.metaHash,
            item.price
        );

        console.log("Transaction: ", transaction);

        // Wait for the transaction to be mined
        await transaction.wait();

        console.log("Item listed successfully");
    };

    const getItems = async (w3: W3, setW3: (w3: W3) => void) => {
        const contract = new ethers.Contract(
            w3.deBuy,
            w3.abis.deBuy,
            w3.provider
        );

        console.log("Contract: ", contract);

        const itemsCount = await contract.getItemCount();
        let items = [];

        console.log("Items Count: ", itemsCount);

        for (let i = 0; i < itemsCount; i++) {
            try {
                const item = await contract.items(i);
                console.log("Item: ", i, item);
                items.push({
                    id: Number(item.id),
                    owner: item.owner,
                    ipfsHash: item.ipfsHash,
                    ipfsImage: item.ipfsImage,
                    ipfsMeta: item.ipfsMeta,
                    price: Number(item.price),
                    ipfsReview: item.ipfsReview,
                });
            } catch (error) {
                console.log(error);
            }
        }

        console.log("here are THE ITEMS: ", items);
        return items;
    };

    return { connectWallet, deBxBalance, listItem, getItems };
};
