import { Signer } from "ethers";
import { DeBucks, DeBucks__factory } from "../typechain-types";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeBucks Contract", function () {
    let DeBucks: DeBucks__factory;
    let deBucks: DeBucks;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;
    let addrs: Signer[];

    beforeEach(async function () {
        DeBucks = await ethers.getContractFactory("DeBucks");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        deBucks = await DeBucks.deploy(owner, 1000);
    });

    describe("Deployment", function () {
        it("Should assign the total supply of tokens to the deployer", async function () {
            const deployerAddress = await owner.getAddress();
            const deployerBalance = await deBucks.balanceOf(deployerAddress);

            expect(await deBucks.totalSupply()).to.equal(deployerBalance);
            expect(await deBucks.balanceOf(owner.getAddress())).to.equal(1000);
        });

        it("Should have the correct name and symbol", async function () {
            expect(await deBucks.name()).to.equal("DeBucks");
            expect(await deBucks.symbol()).to.equal("DeBx");
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const deployerAddress = await owner.getAddress();
            const recipientAddress = await addr1.getAddress();

            // Transfer 50 tokens from deployer to addr1
            await deBucks.transfer(recipientAddress, 50);
            expect(await deBucks.balanceOf(recipientAddress)).to.equal(50);

            // Check the deployer's balance
            expect(await deBucks.balanceOf(deployerAddress)).to.equal(950);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialDeployerBalance = await deBucks.balanceOf(
                await owner.getAddress()
            );
            const recipientAddress = await addr2.getAddress();

            // Try to send more tokens than deployer's balance
            await expect(
                deBucks.transfer(recipientAddress, initialDeployerBalance + 1n)
            ).to.be.reverted;
        });
    });

    describe("Minting", function () {
        it("Should allow owner to mint more tokens", async function () {
            const amountToMint = 100;
            const ownerAddress = await owner.getAddress();
            await deBucks.mint(ownerAddress, amountToMint);

            expect(await deBucks.balanceOf(ownerAddress)).to.equal(
                amountToMint + 1000
            );
        });

        it("Should not allow non-owner to mint tokens", async function () {
            const amountToMint = 100;
            const recipientAddress = await addr1.getAddress();

            await expect(
                deBucks.connect(addr1).mint(recipientAddress, amountToMint)
            ).to.be.reverted;
        });
    });
});
