// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./deBucks.sol";

contract DeBucksSale {
    DeBucks public tokenContract;
    address public owner;
    uint256 public rate = 2000; // Rate of token per ETH

    constructor(DeBucks _tokenContract) {
        tokenContract = _tokenContract;
        owner = msg.sender;
    }

    receive() external payable {
        uint256 tokenAmount = (msg.value * rate) / 1 ether;
        require(
            tokenContract.transfer(msg.sender, tokenAmount),
            "Failed to transfer tokens"
        );
    }

    function withdrawEth() public {
        require(msg.sender == owner, "Only owner can withdraw ETH");
        payable(owner).transfer(address(this).balance);
    }
}
