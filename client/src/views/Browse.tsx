// npm
import React, { useState } from "react";
import { useNavigate } from "react-router";

// types
import { W3, Item, Review } from "../types";

// components
import ListItem from "../components/listItem";

// hooks
import { useContracts, useIpfs } from "../hooks";

type BrowseProps = {
    w3: W3;
    setW3: (w3: W3) => void;
    items: Item[];
};

const Browse = ({ w3, setW3, items }: BrowseProps) => {
    // hooks
    const ipfs = useIpfs();
    const contracts = useContracts();
    const navigate = useNavigate();

    // state
    const [listItem, setListItem] = useState(false);

    // methods
    const toggleListItem = () => {
        setListItem(!listItem);
    };

    const viewItem = (ipfsHash: string) => {
        const url = `https://fuchsia-tired-baboon-734.mypinata.cloud/ipfs/${ipfsHash}`;
        window.open(url, "_blank");
    };

    // HERE STARTS FAKE PROFILE CODE
    // state
    const [reviewId, setReviewId] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);

    const setReview = (id: number) => {
        setReviewId(reviewId === id + 1 ? 0 : id + 1);
    };

    const submitReview = async () => {
        let reviewHash = "";

        if (!items[reviewId - 1].ipfsReview) {
            const reviews: Review[] = [
                {
                    user: w3.userAddr,
                    review: reviewText,
                    rating: rating,
                },
            ];

            const blob = new Blob([JSON.stringify(reviews)], {
                type: "application/json",
            });

            reviewHash = (await ipfs.uploadFile(blob, "meta")) || "";
        } else {
            const existingReviews = await ipfs.getData(
                items[reviewId - 1].ipfsReview
            );

            const updatedReviews: Review[] = [
                ...existingReviews,
                {
                    user: w3.userAddr,
                    review: reviewText,
                    rating: rating,
                },
            ];

            const blob = new Blob([JSON.stringify(updatedReviews)], {
                type: "application/json",
            });

            reviewHash = (await ipfs.uploadFile(blob, "meta")) || "";

            await ipfs.deleteFile(items[reviewId - 1].ipfsReview);
        }

        contracts.setReview(w3, setW3, reviewId - 1, reviewHash);
    };

    return (
        <div>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <h1>Browse</h1>
            <div>{(w3.balance && w3.balance.toString()) || 0}</div>
            <button onClick={toggleListItem}>+</button>
            {listItem && <ListItem w3={w3} setW3={setW3} />}
            {items.map((item) => {
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
                            <button
                                onClick={() =>
                                    contracts.purchaseItem(w3, setW3, item)
                                }
                            >
                                Buy
                            </button>
                        )}
                    </div>
                ) : null;
            })}
            <div>FAKE PROFILE</div>
            {reviewId && (
                <div>
                    {reviewId - 1}
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
                            <button onClick={() => setReview(item.id)}>
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
