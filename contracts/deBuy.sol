// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeBuy {
    IERC20 private token;
    struct Item {
        uint256 id;
        address owner;
        string ipfsHash;
        string ipfsImage;
        string ipfsMeta;
        uint256 price;
        string ipfsReview;
    }
    Item[] public items;
    mapping(uint256 => mapping(address => bool)) public buyers;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    // TODO write tests for this
    function getItemCount() public view returns (uint256) {
        return items.length;
    }

    function listItem(
        string memory ipfsHash,
        string memory ipfsImage,
        string memory ipfsMeta,
        uint256 price
    ) public {
        uint256 newItemId = items.length;
        items.push(
            Item(
                newItemId,
                msg.sender,
                ipfsHash,
                ipfsImage,
                ipfsMeta,
                price,
                ""
            )
        );
    }

    function purchaseItem(uint256 itemId) public {
        require(itemId < items.length, "Item does not exist");
        require(!buyers[itemId][msg.sender], "Already purchased");

        Item storage item = items[itemId];
        require(
            token.transferFrom(msg.sender, item.owner, item.price),
            "Transfer failed"
        );

        buyers[itemId][msg.sender] = true;
    }

    function hasPurchased(
        uint256 itemId,
        address user
    ) public view returns (bool) {
        return buyers[itemId][user];
    }

    function addReview(uint256 itemId, string memory ipfsReview) public {
        require(itemId < items.length, "Item does not exist");
        require(buyers[itemId][msg.sender], "Not purchased");

        Item storage item = items[itemId];
        item.ipfsReview = ipfsReview;
    }

    // Additional functions like getItem, delistItem, etc.
}
