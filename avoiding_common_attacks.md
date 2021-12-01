# Avoiding Common Attacks

## SWC-103 (Floating pragma)

Specific compiler pragma `0.8.7` used in contracts to avoid accidental bug inclusion through outdated compiler versions.

## SWC-105 (Unprotected Ether Withdrawal)

`withdrawERC20` is protected with OpenZeppelin `Ownable`'s `onlyOwner` modifier.

## SWC-104 (Unchecked Call Return Value)

The return value from a call to the winner's address in `_transferPrizeToWinner` is checked with `require` to ensure transaction rollback if call fails.

## Proper Use of Require, Assert and Revert

Use require statements throughout for validation of inputs, external call returns and variables before state changes.
