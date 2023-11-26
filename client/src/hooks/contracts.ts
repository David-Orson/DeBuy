// npm
import { ethers } from "ethers";

// types
import { Item, W3 } from "../types";

// hooks
import { useIpfs } from "./ipfs";

export const useContracts = () => {
    // hooks
    const ipfs = useIpfs();

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

        if (!w3.provider || !addr) return;

        const tokenContract = new ethers.Contract(
            w3.deBx,
            w3.abis.deBucks,
            w3.provider
        );

        const balance = await tokenContract.balanceOf(addr);

        setW3({
            ...w3,
            userAddr: addr,
            balance,
        });
    };

    const buyDeBx = async (w3: W3, setW3: (w3: W3) => void) => {
        const signer = await w3.provider.getSigner();

        const transaction = {
            to: w3.deBxSale,
            value: ethers.parseEther("1"),
        };

        try {
            const txResponse = await signer.sendTransaction(transaction);
            await txResponse.wait();
        } catch (error) {
            console.error("Transaction failed:", error);
        }

        deBxBalance(w3, setW3, w3.userAddr);
    };

    const getDeBxSaleBalance = async (w3: W3, setW3: (w3: W3) => void) => {
        const deBxContract = new ethers.Contract(
            w3.deBx,
            w3.abis.deBucks,
            w3.provider
        );

        try {
            const balance = await deBxContract.balanceOf(w3.deBxSale);
            console.log("DeBxSale Contract DeBx Balance:", balance.toString());
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const fundDeBucksSaleContract = async (w3: W3, setW3: (w3: W3) => void) => {
        const signer = await w3.provider.getSigner();

        const deBucksContract = new ethers.Contract(
            w3.deBx,
            w3.abis.deBucks,
            signer
        );

        const approveTx = await deBucksContract.approve(w3.deBxSale, 10000);
        await approveTx.wait();

        const transferTx = await deBucksContract.transfer(w3.deBxSale, 10000);
        await transferTx.wait();

        console.log(`Transferred ${10000} DeBx to the sale contract`);
    };

    const listItem = async (w3: W3, setW3: (w3: W3) => void, item: any) => {
        console.log("Listing item");

        const signer = await w3.provider.getSigner();

        const contract = new ethers.Contract(w3.deBuy, w3.abis.deBuy, signer);

        const transaction = await contract.listItem(
            item.ipfsHash,
            item.imageHash,
            item.metaHash,
            item.price
        );

        await transaction.wait();

        console.log("Item listed successfully");
    };

    const getItems = async (w3: W3, setW3: (w3: W3) => void) => {
        const contract = new ethers.Contract(
            w3.deBuy,
            w3.abis.deBuy,
            w3.provider
        );

        const itemsCount = await contract.getItemCount();
        let items = [];

        console.log("Items Count: ", itemsCount);

        for (let i = 0; i < itemsCount; i++) {
            try {
                const item = await contract.items(i);

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

        return items;
    };

    const refreshItems = async (w3: W3, setW3: (w3: W3) => void) => {
        const items = await getItems(w3, setW3);

        const tempItems: Item[] = [];

        console.log("items", items);

        items.forEach(async (item, i) => {
            const meta = await ipfs.getData(items[i].ipfsMeta);

            let hasPurchased = false;

            const contract = new ethers.Contract(
                w3.deBuy,
                w3.abis.deBuy,
                w3.provider
            );

            if (w3.userAddr) {
                try {
                    hasPurchased = await contract.hasPurchased(
                        item.id,
                        w3.userAddr
                    );
                    console.log("user has purchased: ", item.id, hasPurchased);
                } catch (error) {
                    console.error("Error checking purchase status:", error);
                    return false;
                }
            }

            tempItems.push({
                id: i,
                owner: item.owner,
                title: meta.title,
                description: meta.description,
                price: item.price,
                ipfsMeta: item.ipfsMeta,
                ipfsHash: item.ipfsHash,
                imageHash: item.ipfsImage,
                userHasPurchased: hasPurchased,
                ipfsReview: item.ipfsReview,
            });
        });

        return tempItems;
    };

    const purchaseItem = async (
        w3: W3,
        setW3: (w3: W3) => void,
        item: Item
    ) => {
        const signer = await w3.provider.getSigner();

        const deBuyContract = new ethers.Contract(
            w3.deBuy,
            w3.abis.deBuy,
            signer
        );

        const deBxContract = new ethers.Contract(
            w3.deBx,
            w3.abis.deBucks,
            signer
        );

        await deBxContract.approve(w3.deBuy, item.price);

        const tx = await deBuyContract.purchaseItem(item.id);

        await tx.wait();
    };

    const setReview = async (
        w3: W3,
        setW3: (w3: W3) => void,
        id: number,
        reviewHash: string
    ) => {
        const signer = await w3.provider.getSigner();

        const contract = new ethers.Contract(w3.deBuy, w3.abis.deBuy, signer);

        try {
            const tx = await contract.addReview(id, reviewHash);
            await tx.wait();
        } catch (error) {
            console.error("Failed to add review:", error);
        }
    };

    return {
        connectWallet,
        deBxBalance,
        buyDeBx,
        getDeBxSaleBalance,
        fundDeBucksSaleContract,
        listItem,
        getItems,
        refreshItems,
        purchaseItem,
        setReview,
    };
};
