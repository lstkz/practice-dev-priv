// contracts/DEVCToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DEVCToken is ERC20 {
    constructor()  ERC20("Practice.dev Coin", "DEVC") {
        _mint(msg.sender, 1250000000000000000000000);
    }
}