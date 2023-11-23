const { ethers } = require("hardhat");

async function main() {
    // Deploy DeBucks
    const DeBucks = await ethers.getContractFactory("DeBucks");
    const [owner] = await ethers.getSigners();
    const deBucks = await DeBucks.deploy(owner.getAddress(), 1000);
    console.log(`DeBucks deployed to: ${await deBucks.getAddress()}`);

    // Deploy DeBucksSale
    const DeBucksSale = await ethers.getContractFactory("DeBucksSale");
    const deBucksSale = await DeBucksSale.deploy(await deBucks.getAddress());
    console.log(`DeBucksSale deployed to: ${await deBucksSale.getAddress()}`);

    // Deploy DeBuy
    const DeBuy = await ethers.getContractFactory("DeBuy");
    const deBuy = await DeBuy.deploy(await deBucks.getAddress());
    console.log(`DeBuy deployed to: ${await deBuy.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
