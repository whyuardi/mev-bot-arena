// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MEVBotGame
 * @notice A competition game where MEV bots compete for block rewards
 * @dev Players register bots, compete in rounds, top 3 earn rewards
 */
contract MEVBotGame is Ownable, ReentrancyGuard {
    // ──────────────────────────────────────────────
    // Types
    // ──────────────────────────────────────────────

    enum StrategyType {
        Sandwich,
        Arbitrage,
        Liquidation,
        FlashLoan,
        Unknown
    }

    enum RoundStatus {
        Inactive,
        Active,
        Ended
    }

    struct Bot {
        address owner;
        string name;
        StrategyType strategy;
        uint256 registeredAt;
        bool active;
    }

    struct Round {
        uint256 id;
        uint256 startTime;
        uint256 endTime;
        RoundStatus status;
    }

    struct BotScore {
        address botOwner;
        string botName;
        uint256 score;
    }

    // ──────────────────────────────────────────────
    // State
    // ──────────────────────────────────────────────

    uint256 public constant MAX_ROUND_DURATION = 7 days;
    uint256 public constant MIN_BOTS_PER_ROUND = 2;
    uint256 public constant TOP_BOTS_REWARDED = 3;

    uint256 private _nextBotId;
    uint256 private _nextRoundId;

    mapping(uint256 => Bot) public bots;
    mapping(uint256 => Round) public rounds;
    mapping(address => uint256[]) public playerBots;
    mapping(uint256 => mapping(uint256 => bool)) public roundParticipants;
    mapping(uint256 => mapping(uint256 => BotScore)) public roundTopBots;
    mapping(uint256 => uint256) public roundWinnerCount;
    mapping(uint256 => mapping(uint256 => uint256)) public botScores;

    uint256 public totalBots;
    uint256 public totalRounds;
    address public gameTreasury;

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────

    event BotRegistered(
        uint256 indexed botId,
        address indexed owner,
        string name,
        StrategyType strategy,
        uint256 timestamp
    );

    event RoundStarted(
        uint256 indexed roundId,
        uint256 startTime,
        uint256 endTime,
        uint256 timestamp
    );

    event RoundEnded(
        uint256 indexed roundId,
        uint256 endTime,
        uint256 winnerCount,
        uint256 timestamp
    );

    event RewardDistributed(
        uint256 indexed roundId,
        address indexed winner,
        uint256 amount,
        uint256 position,
        uint256 timestamp
    );

    // ──────────────────────────────────────────────
    // Errors
    // ──────────────────────────────────────────────

    error BotAlreadyRegistered();
    error BotNotActive();
    error BotNotFound();
    error RoundAlreadyActive();
    error RoundNotActive();
    error RoundAlreadyEnded();
    error InsufficientParticipants();
    error NotBotOwner();
    error NoRewardDue();
    error TransferFailed();
    error InvalidRoundDuration();
    error NameTooLong();

    // ──────────────────────────────────────────────
    // Modifiers
    // ──────────────────────────────────────────────

    modifier onlyActiveBot(uint256 botId) {
        if (bots[botId].owner == address(0)) revert BotNotFound();
        if (!bots[botId].active) revert BotNotActive();
        _;
    }

    modifier duringRound(uint256 roundId) {
        if (rounds[roundId].status != RoundStatus.Active) revert RoundNotActive();
        _;
    }

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────

    constructor(address initialOwner) Ownable(initialOwner) {
        gameTreasury = initialOwner;
        _nextBotId = 1;
        _nextRoundId = 1;
    }

    // ──────────────────────────────────────────────
    // Registration Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Register a new MEV bot to compete in the game
     * @param name Bot name (max 32 chars)
     * @param strategy Strategy type enum value
     * @return botId The assigned bot ID
     */
    function registerBot(
        string calldata name,
        StrategyType strategy
    ) external returns (uint256) {
        if (bytes(name).length == 0) revert NameTooLong();
        if (bytes(name).length > 32) revert NameTooLong();

        uint256 botId = _nextBotId;
        _nextBotId++;

        bots[botId] = Bot({
            owner: msg.sender,
            name: name,
            strategy: strategy,
            registeredAt: block.timestamp,
            active: true
        });

        playerBots[msg.sender].push(botId);
        totalBots++;

        emit BotRegistered(botId, msg.sender, name, strategy, block.timestamp);

        return botId;
    }

    /**
     * @notice Deactivate a bot (owner only)
     * @param botId The bot ID to deactivate
     */
    function deactivateBot(uint256 botId) external {
        if (bots[botId].owner != msg.sender) revert NotBotOwner();
        if (!bots[botId].active) revert BotNotActive();
        bots[botId].active = false;
    }

    // ──────────────────────────────────────────────
    // Round Management (Owner/Admin only)
    // ──────────────────────────────────────────────

    /**
     * @notice Start a new competition round
     * @param duration Duration of the round in seconds (max 7 days)
     * @return roundId The assigned round ID
     */
    function startRound(uint256 duration) external onlyOwner returns (uint256) {
        if (duration == 0 || duration > MAX_ROUND_DURATION) revert InvalidRoundDuration();

        uint256 roundId = _nextRoundId;
        _nextRoundId++;

        rounds[roundId] = Round({
            id: roundId,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            status: RoundStatus.Active
        });

        totalRounds++;

        emit RoundStarted(roundId, block.timestamp, block.timestamp + duration, block.timestamp);

        return roundId;
    }

    /**
     * @notice End a round manually (only after minimum bots have participated)
     * @param roundId The round ID to end
     */
    function endRound(uint256 roundId) external onlyOwner {
        Round storage round = rounds[roundId];
        if (round.status != RoundStatus.Active) revert RoundNotActive();

        round.status = RoundStatus.Ended;
        _calculateScores(roundId);

        emit RoundEnded(roundId, block.timestamp, roundWinnerCount[roundId], block.timestamp);
    }

    // ──────────────────────────────────────────────
    // Core Competition Logic
    // ──────────────────────────────────────────────

    /**
     * @notice Submit a bot's MEV attempt — higher gas spent = higher score
     * @dev Bots compete by spending gas; more aggressive MEV = higher cost
     * @param roundId The round to compete in
     * @param botId The bot to use
     */
    function submitAttempt(uint256 roundId, uint256 botId)
        external
        payable
        nonReentrant
        onlyActiveBot(botId)
        duringRound(roundId)
    {
        if (bots[botId].owner != msg.sender) revert NotBotOwner();

        // Record that this bot participated and accumulate score
        roundParticipants[roundId][botId] = true;
        botScores[roundId][botId] += msg.value;
    }

    /**
     * @notice Distribute rewards to top 3 bots for a completed round
     * @param roundId The round to distribute rewards for
     */
    function distributeRewards(uint256 roundId) external onlyOwner nonReentrant {
        Round storage round = rounds[roundId];
        if (round.status == RoundStatus.Active) revert RoundNotActive();

        uint256 poolSize = address(this).balance;
        if (poolSize == 0) revert NoRewardDue();

        uint256 winners = roundWinnerCount[roundId];
        if (winners == 0) revert NoRewardDue();

        uint256 topCount = winners > TOP_BOTS_REWARDED ? TOP_BOTS_REWARDED : winners;

        // Rewards: 1st = 50%, 2nd = 30%, 3rd = 20%
        uint256[3] memory shares = [uint256(5000), uint256(3000), uint256(2000)]; // basis points
        uint256 totalBasis = 10000;

        for (uint256 i = 0; i < topCount; i++) {
            BotScore memory winnerData = roundTopBots[roundId][i];
            uint256 reward = (poolSize * shares[i]) / totalBasis;
            address payable winner = payable(winnerData.botOwner);

            (bool success, ) = winner.call{value: reward}("");
            if (!success) revert TransferFailed();

            emit RewardDistributed(roundId, winnerData.botOwner, reward, i + 1, block.timestamp);
        }
    }

    // ──────────────────────────────────────────────
    // Internal Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Calculate scores and rank top bots for a round
     * @param roundId The round to score
     */
    function _calculateScores(uint256 roundId) internal {
        // Gather participants and their scores
        uint256 count;
        uint256[] memory participantIds = new uint256[](totalBots);
        uint256[] memory scores = new uint256[](totalBots);

        for (uint256 i = 1; i <= totalBots; i++) {
            if (roundParticipants[roundId][i]) {
                participantIds[count] = i;
                // Score = total ETH sent by this bot during the round
                scores[count] = botScores[roundId][i];
                count++;
            }
        }

        // Simple bubble sort by score descending
        for (uint256 i = 0; i < count; i++) {
            for (uint256 j = i + 1; j < count; j++) {
                if (scores[j] > scores[i]) {
                    (scores[i], scores[j]) = (scores[j], scores[i]);
                    (participantIds[i], participantIds[j]) = (participantIds[j], participantIds[i]);
                }
            }
        }

        // Store top bots in mapping
        uint256 topCount = count < TOP_BOTS_REWARDED ? count : TOP_BOTS_REWARDED;
        for (uint256 i = 0; i < topCount; i++) {
            uint256 botId = participantIds[i];
            roundTopBots[roundId][i] = BotScore({
                botOwner: bots[botId].owner,
                botName: bots[botId].name,
                score: scores[i]
            });
        }
        roundWinnerCount[roundId] = topCount;
    }

    // ──────────────────────────────────────────────
    // View Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Get all bots owned by a player
     * @param player The player's address
     * @return Array of bot IDs
     */
    function getPlayerBots(address player) external view returns (uint256[] memory) {
        return playerBots[player];
    }

    /**
     * @notice Get the top bots for a specific round
     * @param roundId The round ID
     * @return Array of BotScore structs
     */
    function getRoundLeaders(uint256 roundId) external view returns (BotScore[] memory) {
        uint256 count = roundWinnerCount[roundId];
        BotScore[] memory leaders = new BotScore[](count);
        for (uint256 i = 0; i < count; i++) {
            leaders[i] = roundTopBots[roundId][i];
        }
        return leaders;
    }

    /**
     * @notice Get the current round status
     * @param roundId The round ID
     * @return status RoundStatus enum value
     */
    function getRoundStatus(uint256 roundId) external view returns (RoundStatus) {
        return rounds[roundId].status;
    }

    /**
     * @notice Check if a bot is registered
     * @param botId The bot ID
     * @return true if the bot exists and is active
     */
    function isBotActive(uint256 botId) external view returns (bool) {
        return bots[botId].active;
    }

    /**
     * @notice Get total contract balance
     * @return balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // ──────────────────────────────────────────────
    // Receive function
    // ──────────────────────────────────────────────

    receive() external payable {}
}
