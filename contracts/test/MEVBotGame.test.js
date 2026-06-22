import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("MEVBotGame", function () {
  let game;
  let owner;
  let player1;
  let player2;
  let player3;
  let addrs;

  beforeEach(async function () {
    [owner, player1, player2, player3, ...addrs] = await ethers.getSigners();

    const MEVBotGame = await ethers.getContractFactory("MEVBotGame");
    game = await MEVBotGame.deploy(owner.address);
    await game.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await game.owner()).to.equal(owner.address);
    });

    it("Should set the game treasury", async function () {
      expect(await game.gameTreasury()).to.equal(owner.address);
    });

    it("Should start with zero bots and rounds", async function () {
      expect(await game.totalBots()).to.equal(0n);
      expect(await game.totalRounds()).to.equal(0n);
    });
  });

  describe("Bot Registration", function () {
    it("Should allow a player to register a bot", async function () {
      const tx = await game.connect(player1).registerBot("FlashBot", 0); // Sandwich
      await tx.wait();

      expect(await game.totalBots()).to.equal(1n);
      const bot = await game.bots(1);
      expect(bot.owner).to.equal(player1.address);
      expect(bot.name).to.equal("FlashBot");
      expect(bot.strategy).to.equal(0);
      expect(bot.active).to.equal(true);
    });

    it("Should emit BotRegistered event", async function () {
      await expect(game.connect(player1).registerBot("ArbBot", 1)) // Arbitrage
        .to.emit(game, "BotRegistered");
    });

    it("Should reject empty name", async function () {
      await expect(
        game.connect(player1).registerBot("", 0)
      ).to.be.revertedWithCustomError(game, "NameTooLong");
    });

    it("Should reject name longer than 32 chars", async function () {
      await expect(
        game.connect(player1).registerBot("A".repeat(33), 0)
      ).to.be.revertedWithCustomError(game, "NameTooLong");
    });

    it("Should register multiple bots for same player", async function () {
      await game.connect(player1).registerBot("Bot1", 0);
      await game.connect(player1).registerBot("Bot2", 1);

      const playerBots = await game.getPlayerBots(player1.address);
      expect(playerBots.length).to.equal(2);
      expect(playerBots[0]).to.equal(1n);
      expect(playerBots[1]).to.equal(2n);
    });
  });

  describe("Bot Deactivation", function () {
    it("Should allow owner to deactivate bot", async function () {
      await game.connect(player1).registerBot("Bot1", 0);
      await game.connect(player1).deactivateBot(1);
      expect(await game.isBotActive(1)).to.equal(false);
    });

    it("Should reject deactivation by non-owner", async function () {
      await game.connect(player1).registerBot("Bot1", 0);
      await expect(
        game.connect(player2).deactivateBot(1)
      ).to.be.revertedWithCustomError(game, "NotBotOwner");
    });
  });

  describe("Round Management", function () {
    beforeEach(async function () {
      await game.connect(player1).registerBot("FlashBot", 0);
      await game.connect(player2).registerBot("ArbBot", 1);
      await game.connect(player3).registerBot("LiqBot", 2);
    });

    it("Should allow owner to start a round", async function () {
      const tx = await game.connect(owner).startRound(3600); // 1 hour
      await tx.wait();

      expect(await game.totalRounds()).to.equal(1n);
      const round = await game.rounds(1);
      expect(round.status).to.equal(1); // Active
    });

    it("Should emit RoundStarted event", async function () {
      await expect(game.connect(owner).startRound(3600))
        .to.emit(game, "RoundStarted");
    });

    it("Should reject non-owner from starting a round", async function () {
      await expect(
        game.connect(player1).startRound(3600)
      ).to.be.revertedWithCustomError(game, "OwnableUnauthorizedAccount");
    });

    it("Should reject invalid round duration", async function () {
      await expect(
        game.connect(owner).startRound(0)
      ).to.be.revertedWithCustomError(game, "InvalidRoundDuration");

      await expect(
        game.connect(owner).startRound(8 * 24 * 3600) // 8 days
      ).to.be.revertedWithCustomError(game, "InvalidRoundDuration");
    });

    it("Should allow owner to end an active round", async function () {
      await game.connect(owner).startRound(3600);
      const tx = await game.connect(owner).endRound(1);
      await tx.wait();

      const round = await game.rounds(1);
      expect(round.status).to.equal(2); // Ended
    });

    it("Should emit RoundEnded event", async function () {
      await game.connect(owner).startRound(3600);
      await expect(game.connect(owner).endRound(1))
        .to.emit(game, "RoundEnded");
    });
  });

  describe("Competition and Scoring", function () {
    beforeEach(async function () {
      await game.connect(player1).registerBot("FlashBot", 0);
      await game.connect(player2).registerBot("ArbBot", 1);
      await game.connect(player3).registerBot("LiqBot", 2);
      await game.connect(owner).startRound(3600);
    });

    it("Should allow bot owners to submit attempts", async function () {
      await expect(
        game.connect(player1).submitAttempt(1, 1, { value: ethers.parseEther("1.0") })
      ).to.not.be.reverted;
    });

    it("Should reject non-owner submitting attempt", async function () {
      await expect(
        game.connect(addrs[0]).submitAttempt(1, 1, { value: ethers.parseEther("1.0") })
      ).to.be.revertedWithCustomError(game, "NotBotOwner");
    });

    it("Should reject attempts on inactive bots", async function () {
      await game.connect(player1).deactivateBot(1);
      await expect(
        game.connect(player1).submitAttempt(1, 1, { value: ethers.parseEther("1.0") })
      ).to.be.revertedWithCustomError(game, "BotNotActive");
    });
  });

  describe("Reward Distribution", function () {
    beforeEach(async function () {
      await game.connect(player1).registerBot("FlashBot", 0);
      await game.connect(player2).registerBot("ArbBot", 1);
      await game.connect(player3).registerBot("LiqBot", 2);
      await game.connect(owner).startRound(3600);

      // Submit attempts with different gas spends
      await game.connect(player1).submitAttempt(1, 1, { value: ethers.parseEther("1.0") });
      await game.connect(player2).submitAttempt(1, 2, { value: ethers.parseEther("2.0") });
      await game.connect(player3).submitAttempt(1, 3, { value: ethers.parseEther("3.0") });
    });

    it("Should allow owner to end round and distribute rewards", async function () {
      await game.connect(owner).endRound(1);
      await game.connect(owner).distributeRewards(1);
    });

    it("Should distribute correct reward amounts", async function () {
      await game.connect(owner).endRound(1);
      const balanceBefore = await ethers.provider.getBalance(player3.address);
      await game.connect(owner).distributeRewards(1);
      const balanceAfter = await ethers.provider.getBalance(player3.address);
      // player3 sent 3 ETH (highest), should get 50% of pool (6 ETH) = 3 ETH
      expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("3.0"));
    });

    it("Should emit RewardDistributed events", async function () {
      await game.connect(owner).endRound(1);
      await expect(game.connect(owner).distributeRewards(1)).to.emit(game, "RewardDistributed");
    });

    it("Should allow multiple submit attempts and accumulate scores", async function () {
      // Player1 submits another attempt to increase score
      await game.connect(player1).submitAttempt(1, 1, { value: ethers.parseEther("5.0") });
      await game.connect(owner).endRound(1);
      const leaders = await game.getRoundLeaders(1);
      // Player1 now has 1+5=6 ETH > player3's 3 ETH
      expect(leaders[0].botOwner).to.equal(player1.address);
    });
  });
});
