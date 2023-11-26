import axios from "axios";

//const JWT = process.env.PINATA_KEY;
const JWT = "<your pinata key here>";

const gateway = "<your gateway here>";

export const useIpfs = () => {
    const uploadFile = async (
        file: any,
        title: string
    ): Promise<string | undefined> => {
        const formData = new FormData();

        formData.append("file", file);

        const pinataMetadata = JSON.stringify({
            name: title,
        });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });
        formData.append("pinataOptions", pinataOptions);

        const headers = {
            "Content-Type": `multipart/form-data;`,
            Authorization: `Bearer ${JWT}`,
        };

        try {
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS/",
                formData,
                { maxBodyLength: 10000000000, headers }
            );

            console.log("data", res.data.IpfsHash);

            return res.data.IpfsHash;
        } catch (error) {
            console.log(error);

            return undefined;
        }
    };

    const getData = async (hash: string) => {
        const res = await axios.get(`${gateway}/ipfs/${hash}`);

        return res.data;
    };

    const deleteFile = async (hash: string) => {
        try {
            const res = await axios.delete(
                `https://api.pinata.cloud/pinning/unpin/${hash}`,
                {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                }
            );

            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    return { uploadFile, getData, deleteFile };
};
