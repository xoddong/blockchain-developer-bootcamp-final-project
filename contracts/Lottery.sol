// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/**
 * @title Lottery
 * @notice Uses Chainlink VRF to draw winning number
 * @author Tae Yoon
 */
contract Lottery is Ownable, VRFConsumerBase {
  using Counters for Counters.Counter;

  /**
   * @notice Chainlink related variables
   */
  bytes32 public keyHash;
  bytes32 public requestId;
  uint256 public chainlinkFee;

  /**
   * @notice Lottery Events
   */
  event LotteryTicketPurchased(
    address indexed ticketHolder,
    uint256 ticketNumber
  );
  event LotteryStateChanged(LotteryState indexed state);
  event LotteryWinningNumberRequested(bytes32 indexed requestId);
  event LotteryWinningNumberDrawn(uint256 indexed number);
  event LotteryPrizeClaimed(address indexed ticketHolder, uint256 prize);

  /**
   * @notice Lottery Enums
   */
  enum LotteryState {
    OnSale,
    Closed
  }

  /**
   * @notice Lottery Structs
   */
  struct LotteryTicket {
    address owner;
    uint256 number;
    bool isPaid;
  }

  /**
   * @notice Lottery States
   */
  LotteryState public lotteryState = LotteryState.OnSale;
  uint256 public ticketPrice;
  uint256 public maxTicketCount;
  bool public isPrizeClaimAttempted;
  uint256 public winningNumber;
  Counters.Counter private currentTicketNumber;

  mapping(address => LotteryTicket) public ticketHoldersToTicket;
  mapping(uint256 => LotteryTicket) private ticketNumberToTicket;

  /**
   * @notice Lottery Code
   * @dev VRFConsumerBase must be initialized with the constructor
   * @param _linkToken LINK token address
   * @param _keyHash ChainLink network's key hash
   * @param _vrfCoordinator ChainLink VRFCoordinator address for the network
   * @param _chainlinkFee ChainLink fee for generating a random number
   * @param _ticketPrice Price of each lottery ticket
   * @param _maxTicketCount Maximum number of tickets available
   */
  constructor(
    address _linkToken,
    bytes32 _keyHash,
    address _vrfCoordinator,
    uint256 _chainlinkFee,
    uint256 _ticketPrice,
    uint256 _maxTicketCount
  ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
    keyHash = _keyHash;
    chainlinkFee = _chainlinkFee;
    ticketPrice = _ticketPrice;
    maxTicketCount = _maxTicketCount;
  }

  /**
   * @notice Purchase a ticket.
   * If the lottery is at capacity, we automatically draw the winning number.
   * 1. Register the purchased ticket
   * 2. Perform a check to see if the lottery is at capacity
   * 3. Draw the winning number if the lottery is at capacity
   * @dev We use Chainlink VRF `requestRandomness` function to request a random number.
   * This request will be fulfilled by our `fulfillRandomness` function.
   */
  function purchaseTicket() public payable {
    require(
      lotteryState == LotteryState.OnSale,
      "Tickets can only be purchased during the sales period"
    );
    require(
      msg.value == ticketPrice,
      "Please pay the correct amount for the lottery"
    );
    require(
      ticketHoldersToTicket[msg.sender].isPaid == false,
      "This wallet has already entered the lottery"
    );

    currentTicketNumber.increment();
    uint256 ticketNumber = currentTicketNumber.current();
    LotteryTicket memory _lotteryTicket = LotteryTicket({
      owner: msg.sender,
      number: ticketNumber,
      isPaid: true
    });
    ticketHoldersToTicket[msg.sender] = _lotteryTicket;
    ticketNumberToTicket[ticketNumber] = _lotteryTicket;
    emit LotteryTicketPurchased(msg.sender, ticketNumber);

    if (ticketNumber == maxTicketCount) {
      requestId = requestRandomness(keyHash, chainlinkFee);
      emit LotteryWinningNumberRequested(requestId);
    }
  }

  /**
   * @notice Callback the Chainlink VRF node calls when the request is fulfilled.
   * 1. Draw the winning number
   * 2. Distribute the prize to the winner
   * @dev We use the random number generated to calculated random number between 1 and maxTicketCount
   * @param _requestId The requestId generated by the random number request
   * @param randomness the random number generated by VRF
   */
  function fulfillRandomness(bytes32 _requestId, uint256 randomness)
    internal
    override
  {
    require(_requestId == requestId, "Invalid request for the randomness");
    winningNumber = (randomness % maxTicketCount) + 1;
    emit LotteryWinningNumberDrawn(winningNumber);

    _transferPrizeToWinner();
    _changeLotteryState(LotteryState.Closed);
  }

  /**
   * @notice Manually claim the prize pool it failed to distribute automatically.
   * 1. Draw the winning number
   * 2. Distribute the prize to the winner
   */
  function claimPrize() public {
    require(
      ticketNumberToTicket[winningNumber].owner == msg.sender,
      "Only the winner can claim the prize"
    );
    require(isPrizeClaimAttempted, "Prize is not ready to be claimed");
    require(
      lotteryState == LotteryState.Closed,
      "Prize can be claimed only after the lottery has concluded"
    );
    require(getLotteryBalance() > 0, "There is no prize pool to be claimed");

    _transferPrizeToWinner();
  }

  /**
   * @notice Transfer prize to the winner.
   */
  function _transferPrizeToWinner() private {
    require(winningNumber > 0, "The winning number has not been drawn yet");

    address winner = ticketNumberToTicket[winningNumber].owner;
    uint256 lotteryBalance = getLotteryBalance();

    isPrizeClaimAttempted = true;
    (bool sent, ) = winner.call{ value: lotteryBalance }("");
    require(sent, "Failed to send balance to winner");
  }

  /**
   * @notice Change lottery state.
   * @param _lotteryState New lottery state
   */
  function _changeLotteryState(LotteryState _lotteryState) private {
    lotteryState = _lotteryState;
    emit LotteryStateChanged(_lotteryState);
  }

  /**
   * @notice Get current lottery balance.
   */
  function getLotteryBalance() public view returns (uint256) {
    return address(this).balance;
  }

  /**
   * @notice Get current lottery ticket number
   */
  function getCurrentTicketNumber() public view returns (uint256) {
    return currentTicketNumber.current();
  }
}
