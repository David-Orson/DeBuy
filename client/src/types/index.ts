export type Abis = {
    deBucks: any[];
    deBucksSale: any[];
    deBuy: any[];
};

export type W3 = {
    deBx: string;
    deBxSale: string;
    deBuy: string;
    abis: Abis;
    provider: any;
    userAddr: string;
    balance: BigInt;
};

export type Item = {
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

export type Review = {
    user: string;
    review: string;
    rating: number;
};
