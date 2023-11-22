import { Signer } from "ethers";
import {
    DeBucks,
    DeBucks__factory,
    DeBuy,
    DeBuy__factory,
} from "../typechain-types";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeBuy Contract", function () {
    let DeBucks: DeBucks__factory,
        deBucks: DeBucks,
        DeBuy: DeBuy__factory,
        deBuy: DeBuy;
    let owner, addr1: Signer, addrs: Signer[];
    const itemPrice = 100; // Price of the item in DeBx

    beforeEach(async function () {
        [owner, addr1, ...addrs] = await ethers.getSigners();

        // Deploy DeBucks
        DeBucks = await ethers.getContractFactory("DeBucks");
        deBucks = await DeBucks.deploy(owner.getAddress(), 10000);

        // Deploy DeBuy
        DeBuy = await ethers.getContractFactory("DeBuy");
        deBuy = await DeBuy.deploy(deBucks.getAddress());

        // Transfer some DeBucks to addr1 for testing
        await deBucks.transfer(addr1.getAddress(), 1000);
    });

    describe("Listing Items", function () {
        it("should allow users to list items for sale", async function () {
            const ipfsHash = "test_hash";
            await deBuy.connect(addr1).listItem(ipfsHash, itemPrice);

            const item = await deBuy.items(0);
            expect(item.id).to.equal(0);
            expect(item.owner).to.equal(await addr1.getAddress());
            expect(item.ipfsHash).to.equal(ipfsHash);
            expect(item.price).to.equal(itemPrice);
        });
    });

    describe("Purchasing Items", function () {
        it("should allow users to purchase listed items", async function () {
            const ipfsHash = "test_hash";
            await deBuy.connect(addr1).listItem(ipfsHash, itemPrice);

            // Approve the DeBuy contract to spend tokens on behalf of the buyer
            await deBucks
                .connect(addr1)
                .approve(await deBuy.getAddress(), itemPrice);

            // Purchase the item
            await deBuy.connect(addr1).purchaseItem(0);

            const item = await deBuy.items(0);
            expect(item.owner).to.equal(await addr1.getAddress()); // Now the buyer is the owner
        });
    });
});
