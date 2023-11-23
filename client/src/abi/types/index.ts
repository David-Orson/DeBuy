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
