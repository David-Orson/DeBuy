import React, { useState } from "react";
import { useContracts, useIpfs } from "../hooks";

type ListItemProps = {
    w3: any;
    setW3: (w3: any) => void;
    refreshItems: () => void;
};

const ListItem = ({ w3, setW3, refreshItems }: ListItemProps) => {
    // hooks
    const contracts = useContracts();
    const ipfs = useIpfs();

    // state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState<any>(null);
    const [image, setImage] = useState<any>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        console.log({ title, description, price, file, image });

        const fileHash = await ipfs.uploadFile(file, title);
        const imageHash = await ipfs.uploadFile(image, title);

        const data = JSON.stringify({
            title,
            description,
        });

        const blob = new Blob([data], { type: "application/json" });

        const metaHash = await ipfs.uploadFile(blob, "meta");

        const item = {
            price,
            metaHash: metaHash,
            ipfsHash: fileHash,
            imageHash: imageHash,
        };
        console.log("ipfs done");

        console.log(item);

        await contracts.listItem(w3, setW3, item);

        refreshItems();
    };

    return (
        <div>
            <h1>List an Item</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type="file"
                    onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : "null")
                    }
                />
                <input
                    type="file"
                    onChange={(e) =>
                        setImage(e.target.files ? e.target.files[0] : "null")
                    }
                />
                <button type="submit">List Item</button>
            </form>
        </div>
    );
};

export default ListItem;
