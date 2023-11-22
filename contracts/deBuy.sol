// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeBuy {
    IERC20 private token;
    struct Item {
        uint256 id;
        address owner;
        string ipfsHash;
        uint256 price;
    }
    Item[] public items;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function listItem(string memory ipfsHash, uint256 price) public {
        items.push(Item(items.length, msg.sender, ipfsHash, price));
    }

    function purchaseItem(uint256 itemId) public {
        Item storage item = items[itemId];
        require(
            token.transferFrom(msg.sender, item.owner, item.price),
            "Transfer failed"
        );
        item.owner = msg.sender;
    }

    // Additional functions like getItem, delistItem, etc.
}
