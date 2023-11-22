// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeBucks is ERC20, Ownable {
    constructor(
        address initialOwner,
        uint256 initialSupply
    ) Ownable(initialOwner) ERC20("DeBucks", "DeBx") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
