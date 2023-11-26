import React, { useState } from "react";
import { W3 } from "../abi/types";
import ListItem from "../components/listItem";
import { useContracts, useIpfs } from "../hooks";
import { ethers } from "ethers";
import { useNavigate } from "react-router";

type BrowseProps = {
    w3: W3;
    setW3: (w3: W3) => void;
};

type Item = {
    id: number;
    owner: string;
    title: string;
    description: string;
    price: number;
    ipfsMeta: string;
    ipfsHash: string;
    imageHash: string;
    userHasPurchased: boolean;
    ipfsReview: string;
};

const Browse = ({ w3, setW3 }: BrowseProps) => {
    const contracts = useContracts();
    const ipfs = useIpfs();
    const navigate = useNavigate();

    const [listItem, setListItem] = useState(false);
    const [items, setItems] = useState<Item[]>([]);

    const toggleListItem = () => {
        setListItem(!listItem);
    };

    const refreshItems = async () => {
        const items = await contracts.getItems(w3, setW3);

        console.log(items);

        const tempItems: Item[] = [];

        items.forEach(async (item, i) => {
            console.log("getting meta");
            const meta = await ipfs.getData(items[i].ipfsMeta);

            console.log(meta);

            let hasPurchased = false;

            const contract = new ethers.Contract(
                w3.deBuy,
                w3.abis.deBuy,
                w3.provider
            );

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

            if (i === items.length - 1) {
                console.log("tempItems");

                setItems(tempItems);
            }
        });
    };

    const purchaseItem = async (item: Item) => {
        const signer = await w3.provider.getSigner();

        console.log("1");

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

        console.log("2");

        await deBxContract.approve(w3.deBuy, item.price);

        console.log("3");

        // Purchase the item
        const tx = await deBuyContract.purchaseItem(item.id);

        console.log("4");

        await tx.wait();

        console.log("purchased item!");
    };

    const viewItem = (ipfsHash: string) => {
        const url = `https://fuchsia-tired-baboon-734.mypinata.cloud/ipfs/${ipfsHash}`;
        window.open(url, "_blank");
    };

    const [isReviewOpen, setIsReviewOpen] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);

    const toggleReview = (id: number) => {
        setIsReviewOpen(isReviewOpen === id + 1 ? 0 : id + 1);
    };

    const submitReview = async () => {
        let reviewHash = "";
        if (!items[isReviewOpen - 1].ipfsReview) {
            const data = JSON.stringify([
                {
                    addr: w3.userAddr,
                    reviewText,
                    rating,
                },
            ]);

            const blob = new Blob([data], { type: "application/json" });

            reviewHash = (await ipfs.uploadFile(blob, "meta")) || "";
        } else {
            // Fetch existing reviews from IPFS
            const existingReviews = await ipfs.getData(
                items[isReviewOpen - 1].ipfsReview
            );
            const updatedReviews = [
                ...existingReviews,
                {
                    addr: w3.userAddr,
                    reviewText,
                    rating,
                },
            ];

            const blob = new Blob([JSON.stringify(updatedReviews)], {
                type: "application/json",
            });

            // Upload updated reviews to IPFS
            reviewHash = (await ipfs.uploadFile(blob, "meta")) || "";

            // delete the old review file from Pinata
            await ipfs.deleteFile(items[isReviewOpen - 1].ipfsReview);
        }

        // Create a signer
        const signer = await w3.provider.getSigner();

        // Initialize the contract
        const contract = new ethers.Contract(w3.deBuy, w3.abis.deBuy, signer);

        // Call the addReview function
        try {
            const tx = await contract.addReview(isReviewOpen - 1, reviewHash);
            await tx.wait(); // Wait for the transaction to be mined
            console.log("Review added successfully");
        } catch (error) {
            console.error("Failed to add review:", error);
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <h1>Browse</h1>
            <div>{(w3.balance && w3.balance.toString()) || 0}</div>
            <button onClick={toggleListItem}>+</button>
            {listItem && (
                <ListItem w3={w3} setW3={setW3} refreshItems={refreshItems} />
            )}
            <div>
                <button onClick={refreshItems}>refresh items</button>
            </div>
            {
                // @ts-ignore
                items.map((item) => {
                    console.log(
                        "these!",
                        item.owner.toLowerCase(),
                        w3.userAddr,
                        item.owner.toLowerCase() !== w3.userAddr
                    );
                    return item.owner.toLowerCase() !== w3.userAddr ? (
                        <div key={item.id}>
                            <div>
                                {item.owner.toLowerCase()} : {w3.userAddr}
                            </div>
                            <div>{item.title}</div>
                            <div>{item.description}</div>
                            <div>{item.price}</div>
                            <img
                                src={`https://ipfs.io/ipfs/${item.imageHash}`}
                                alt=""
                                width="200"
                            />
                            {item.userHasPurchased ? (
                                <button onClick={() => viewItem(item.ipfsHash)}>
                                    view
                                </button>
                            ) : (
                                <button onClick={() => purchaseItem(item)}>
                                    Buy
                                </button>
                            )}
                        </div>
                    ) : null;
                })
            }
            <div>FAKE PROFILE</div>
            {isReviewOpen && (
                <div>
                    {isReviewOpen - 1}
                    <div>Review</div>
                    <input
                        type="text"
                        placeholder="type your review here!"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />

                    <div>Rating</div>
                    <input
                        type="number"
                        placeholder="rating"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        min="0"
                        max="5"
                    />

                    <button onClick={submitReview}>Submit</button>
                </div>
            )}
            <div>
                {items.map((item) => {
                    console.log(
                        "these!",
                        item.owner.toLowerCase(),
                        w3.userAddr,
                        item.owner.toLowerCase() !== w3.userAddr
                    );
                    return item.owner.toLowerCase() !== w3.userAddr &&
                        item.userHasPurchased ? (
                        <div key={item.id}>
                            <div>
                                {item.owner.toLowerCase()} : {w3.userAddr}
                            </div>
                            <div>{item.title}</div>
                            <div>{item.description}</div>
                            <div>{item.price}</div>
                            <img
                                src={`https://ipfs.io/ipfs/${item.imageHash}`}
                                alt=""
                                width="200"
                            />

                            <button onClick={() => viewItem(item.ipfsHash)}>
                                view
                            </button>
                            <button onClick={() => toggleReview(item.id)}>
                                review
                            </button>
                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );
};

export default Browse;
