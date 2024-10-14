const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

describe("MechanicVerification", function () {
  let MechanicVerification;
  let mechanicVerification;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const QUIZ_DURATION = 1800; // 30 minutes
  const BUFFER_TIME = 120; // 2 minutes
  const COOLDOWN_PERIOD = 1209600; // 2 weeks
  const PASSING_SCORE = 70;
  const TOTAL_QUESTIONS = 10;

  const initialConfig = {
    duration: QUIZ_DURATION,
    bufferTime: BUFFER_TIME,
    cooldownPeriod: COOLDOWN_PERIOD,
    passingScore: PASSING_SCORE,
    totalQuestions: TOTAL_QUESTIONS
  };

  // Helper function to create a Merkle tree and root
  function createMerkleTree(answers) {
    const leaves = answers.map(answer => keccak256(answer));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    return { tree, root: tree.getHexRoot() };
  }

  // Sample correct answers
  const correctAnswers = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5', 'answer6', 'answer7', 'answer8', 'answer9', 'answer10'];
  const { tree, root: initialAnswersRoot } = createMerkleTree(correctAnswers);

  beforeEach(async function () {
    MechanicVerification = await ethers.getContractFactory("MechanicVerification");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    mechanicVerification = await MechanicVerification.deploy(
      "MechanicCredential",
      "MECH",
      initialConfig,
      initialAnswersRoot
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mechanicVerification.owner()).to.equal(owner.address);
    });

    it("Should set the correct initial quiz config", async function () {
      const config = await mechanicVerification.quizConfig();
      expect(config.duration).to.equal(QUIZ_DURATION);
      expect(config.bufferTime).to.equal(BUFFER_TIME);
      expect(config.cooldownPeriod).to.equal(COOLDOWN_PERIOD);
      expect(config.passingScore).to.equal(PASSING_SCORE);
      expect(config.totalQuestions).to.equal(TOTAL_QUESTIONS);
    });

    it("Should set the correct initial answers root", async function () {
      expect(await mechanicVerification.answersRoot()).to.equal(initialAnswersRoot);
    });
  });

  describe("Quiz Management", function () {
    it("Should allow a user to start a quiz", async function () {
      await expect(mechanicVerification.connect(addr1).startQuiz())
        .to.emit(mechanicVerification, "QuizStarted")
        .withArgs(addr1.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1), await ethers.provider.getBlock("latest").then(b => b.timestamp + 1 + QUIZ_DURATION));
    });

    it("Should not allow a user to start a new quiz before cooldown period", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      await expect(mechanicVerification.connect(addr1).startQuiz()).to.be.revertedWith("Cooldown period not over");
    });

    it("Should allow a user to start a new quiz after cooldown period", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      await ethers.provider.send("evm_increaseTime", [COOLDOWN_PERIOD + 1]);
      await expect(mechanicVerification.connect(addr1).startQuiz()).to.not.be.reverted;
    });
  });

  describe("Quiz Submission", function () {
    it("Should allow a user to submit a quiz with correct answers", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      const leaf = keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32[]'], [correctAnswers.map(keccak256)]));
      const proof = tree.getHexProof(leaf);

      await expect(mechanicVerification.connect(addr1).submitQuiz(correctAnswers.map(keccak256), proof))
        .to.emit(mechanicVerification, "QuizSubmitted")
        .withArgs(addr1.address, 100, true);
    });

    it("Should not allow quiz submission after time expiration", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      await ethers.provider.send("evm_increaseTime", [QUIZ_DURATION + BUFFER_TIME + 1]);
      
      const leaf = keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32[]'], [correctAnswers.map(keccak256)]));
      const proof = tree.getHexProof(leaf);

      await expect(mechanicVerification.connect(addr1).submitQuiz(correctAnswers.map(keccak256), proof))
        .to.be.revertedWith("Quiz time expired");
    });

    it("Should not allow quiz submission with incorrect answers", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      const incorrectAnswers = ['wrong1', 'wrong2', 'wrong3', 'wrong4', 'wrong5', 'wrong6', 'wrong7', 'wrong8', 'wrong9', 'wrong10'];
      const leaf = keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32[]'], [incorrectAnswers.map(keccak256)]));
      const proof = tree.getHexProof(leaf);

      await expect(mechanicVerification.connect(addr1).submitQuiz(incorrectAnswers.map(keccak256), proof))
        .to.be.revertedWith("Invalid answers");
    });

    it("Should mint NFT for passing score", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      const leaf = keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32[]'], [correctAnswers.map(keccak256)]));
      const proof = tree.getHexProof(leaf);

      await mechanicVerification.connect(addr1).submitQuiz(correctAnswers.map(keccak256), proof);
      expect(await mechanicVerification.balanceOf(addr1.address)).to.equal(1);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update quiz config", async function () {
      const newConfig = {
        duration: 3600,
        bufferTime: 300,
        cooldownPeriod: 2419200,
        passingScore: 80,
        totalQuestions: 20
      };

      await expect(mechanicVerification.connect(owner).updateQuizConfig(newConfig))
        .to.emit(mechanicVerification, "QuizConfigUpdated")
        .withArgs(Object.values(newConfig));

      const updatedConfig = await mechanicVerification.quizConfig();
      expect(updatedConfig.duration).to.equal(newConfig.duration);
      expect(updatedConfig.bufferTime).to.equal(newConfig.bufferTime);
      expect(updatedConfig.cooldownPeriod).to.equal(newConfig.cooldownPeriod);
      expect(updatedConfig.passingScore).to.equal(newConfig.passingScore);
      expect(updatedConfig.totalQuestions).to.equal(newConfig.totalQuestions);
    });

    it("Should not allow non-owner to update quiz config", async function () {
      const newConfig = {
        duration: 3600,
        bufferTime: 300,
        cooldownPeriod: 2419200,
        passingScore: 80,
        totalQuestions: 20
      };

      await expect(mechanicVerification.connect(addr1).updateQuizConfig(newConfig))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to update answers root", async function () {
      const newAnswers = ['new1', 'new2', 'new3', 'new4', 'new5', 'new6', 'new7', 'new8', 'new9', 'new10'];
      const { root: newRoot } = createMerkleTree(newAnswers);

      await expect(mechanicVerification.connect(owner).updateAnswersRoot(newRoot))
        .to.emit(mechanicVerification, "AnswersRootUpdated")
        .withArgs(newRoot);

      expect(await mechanicVerification.answersRoot()).to.equal(newRoot);
    });

    it("Should not allow non-owner to update answers root", async function () {
      const newAnswers = ['new1', 'new2', 'new3', 'new4', 'new5', 'new6', 'new7', 'new8', 'new9', 'new10'];
      const { root: newRoot } = createMerkleTree(newAnswers);

      await expect(mechanicVerification.connect(addr1).updateAnswersRoot(newRoot))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("NFT Functionality", function () {
    it("Should not allow transfer of minted NFT", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      const leaf = keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32[]'], [correctAnswers.map(keccak256)]));
      const proof = tree.getHexProof(leaf);

      await mechanicVerification.connect(addr1).submitQuiz(correctAnswers.map(keccak256), proof);
      
      await expect(mechanicVerification.connect(addr1).transferFrom(addr1.address, addr2.address, ethers.BigNumber.from(addr1.address)))
        .to.be.revertedWith("Token cannot be transferred");
    });
  });

  describe("View Functions", function () {
    it("Should return the correct latest quiz attempt", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      const quizAttempt = await mechanicVerification.getLatestQuizAttempt(addr1.address);
      expect(quizAttempt.completed).to.be.false;
      expect(quizAttempt.score).to.equal(0);
    });

    it("Should return the correct quiz attempt count", async function () {
      await mechanicVerification.connect(addr1).startQuiz();
      await ethers.provider.send("evm_increaseTime", [COOLDOWN_PERIOD + 1]);
      await mechanicVerification.connect(addr1).startQuiz();
      
      const attemptCount = await mechanicVerification.getQuizAttemptCount(addr1.address);
      expect(attemptCount).to.equal(2);
    });
  });
});