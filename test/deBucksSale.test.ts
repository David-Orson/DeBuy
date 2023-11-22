import { Signer } from "ethers";
import {
    DeBucks,
    DeBucksSale,
    DeBucksSale__factory,
    DeBucks__factory,
} from "../typechain-types";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeBucksSale Contract", function () {
    let DeBucks: DeBucks__factory;
    let deBucks: DeBucks;
    let DeBucksSale: DeBucksSale__factory;
    let deBucksSale: DeBucksSale;
    let owner: any;
    let addr1: Signer;
    let addrs: Signer[];

    beforeEach(async function () {
        [owner, addr1, ...addrs] = await ethers.getSigners();

        // Deploy DeBucks
        DeBucks = await ethers.getContractFactory("DeBucks");
        deBucks = await DeBucks.deploy(owner, 10000); // Deploy with initial supply

        // Deploy DeBucksSale
        DeBucksSale = await ethers.getContractFactory("DeBucksSale");
        deBucksSale = await DeBucksSale.deploy(deBucks.getAddress());

        await deBucks.transfer(deBucksSale.getAddress(), 5000);
    });

    describe("ETH to DeBucks Conversion", function () {
        it("should allow users to buy DeBucks for ETH", async function () {
            await addr1.sendTransaction({
                to: deBucksSale.getAddress(),
                value: ethers.parseEther("1"),
            });

            expect(await deBucks.balanceOf(await addr1.getAddress())).to.equal(
                2000
            );

            await addr1.sendTransaction({
                to: deBucksSale.getAddress(),
                value: ethers.parseEther("1") / 2n,
            });

            expect(await deBucks.balanceOf(await addr1.getAddress())).to.equal(
                3000
            );
        });
    });

    describe("Withdraw ETH", function () {
        it("should allow owner to withdraw ETH", async function () {
            await addr1.sendTransaction({
                to: deBucksSale.getAddress(),
                value: ethers.parseEther("1"),
            });

            const initialOwnerBalance = await ethers.provider.getBalance(
                owner.getAddress()
            );

            console.log("initialOwnerBalance", initialOwnerBalance.toString());

            const tx = await deBucksSale.connect(owner).withdrawEth();
            const txReceipt = await tx.wait();
            const gasUsed = txReceipt && txReceipt.gasUsed * txReceipt.gasPrice;

            expect(
                await ethers.provider.getBalance(owner.getAddress())
            ).to.be.closeTo(
                initialOwnerBalance + ethers.parseEther("1") - (gasUsed || 0n),
                ethers.parseEther("0.01")
            );
        });

        it("should not allow non-owner to withdraw ETH", async function () {
            await expect(
                deBucksSale.connect(addr1).withdrawEth()
            ).to.be.revertedWith("Only owner can withdraw ETH");
        });
    });
});
