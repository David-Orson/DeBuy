import { ethers } from "hardhat";
import { ToyToken } from "../typechain-types";

async function main() {
    const ToyToken = await ethers.getContractFactory("ToyToken");
    const toyToken: ToyToken = await ToyToken.deploy(1000);

    toyToken.getAddress();

    await toyToken.waitForDeployment();

    console.log(`ToyToken deployed to: ${toyToken.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
