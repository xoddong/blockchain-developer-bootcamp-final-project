# Design patterns decisions

## Inheritance and Interfaces

- `Lottery` contract inherits from `Ownable` `VRFConsumer`. Also utilizes `Counter` and `IERC20` interfaces

## Oracle

- `Lottery` uses Chainlink VRF to randomly generate a number

## Access Control Design Patterns

- `Ownable` design pattern is used to only allow owner of the contract to withdraw any leftover ERC20 tokens (LINK)
