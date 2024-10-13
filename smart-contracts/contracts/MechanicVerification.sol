// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MechanicVerification
/// @notice A contract for verifying mechanics through timed quizzes and issuing soulbound NFTs
/// @dev This contract allows mechanics to take timed quizzes, verifies their answers, and issues NFTs for passing scores
contract MechanicVerification is ERC721, Ownable {
    /// @notice Struct to store quiz details for each attempt
    /// @dev Uses tight variable packing to optimize gas costs
    struct Quiz {
        uint40 startTime;
        uint40 endTime;
        uint8 score;
        bool completed;
    }

    /// @notice Struct to store quiz configuration
    /// @dev Allows for easy updates to quiz parameters
    struct QuizConfig {
        uint40 duration;
        uint40 bufferTime;
        uint40 cooldownPeriod;
        uint8 passingScore;
        uint8 totalQuestions;
    }

    /// @notice Mapping to store quiz attempts for each address
    mapping(address => Quiz[]) public quizAttempts;

    /// @notice Current quiz configuration
    QuizConfig public quizConfig;

    /// @notice The Merkle root of the correct quiz answers
    bytes32 public answersRoot;

    /// @notice Event emitted when a quiz is started
    event QuizStarted(
        address indexed participant,
        uint256 startTime,
        uint256 endTime
    );

    /// @notice Event emitted when a quiz is submitted
    event QuizSubmitted(address indexed participant, uint8 score, bool passed);

    /// @notice Event emitted when quiz configuration is updated
    event QuizConfigUpdated(QuizConfig newConfig);

    /// @notice Event emitted when answers root is updated
    event AnswersRootUpdated(bytes32 newRoot);

    /// @dev Modifier to ensure the quiz is active and not completed
    modifier quizActive() {
        require(quizAttempts[msg.sender].length > 0, "No active quiz");
        Quiz storage currentQuiz = quizAttempts[msg.sender][
            quizAttempts[msg.sender].length - 1
        ];
        require(!currentQuiz.completed, "Quiz already completed");
        require(
            block.timestamp <= currentQuiz.endTime + quizConfig.bufferTime,
            "Quiz time expired"
        );
        _;
    }

    /// @notice Constructor to initialize the contract
    /// @param _name The name of the NFT
    /// @param _symbol The symbol of the NFT
    /// @param _initialConfig The initial quiz configuration
    /// @param _initialAnswersRoot The initial Merkle root of correct answers
    constructor(
        string memory _name,
        string memory _symbol,
        QuizConfig memory _initialConfig,
        bytes32 _initialAnswersRoot
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        quizConfig = _initialConfig;
        answersRoot = _initialAnswersRoot;
    }

    /// @notice Starts a new quiz for the caller
    /// @dev Enforces cooldown period between attempts
    function startQuiz() external {
        require(
            quizAttempts[msg.sender].length == 0 ||
                block.timestamp >=
                quizAttempts[msg.sender][quizAttempts[msg.sender].length - 1]
                    .startTime +
                    quizConfig.cooldownPeriod,
            "Cooldown period not over"
        );

        uint40 startTime = uint40(block.timestamp);
        uint40 endTime = startTime + quizConfig.duration;

        quizAttempts[msg.sender].push(
            Quiz({
                startTime: startTime,
                endTime: endTime,
                score: 0,
                completed: false
            })
        );

        emit QuizStarted(msg.sender, startTime, endTime);
    }

    /// @notice Submits quiz answers and calculates the score
    /// @param _answerHashes Array of keccak256 hashes of the answers
    /// @param _proof Merkle proof for answer verification
    function submitQuiz(
        bytes32[] calldata _answerHashes,
        bytes32[] calldata _proof
    ) external quizActive {
        Quiz storage currentQuiz = quizAttempts[msg.sender][
            quizAttempts[msg.sender].length - 1
        ];

        bytes32 leaf = keccak256(abi.encodePacked(_answerHashes));
        require(
            MerkleProof.verify(_proof, answersRoot, leaf),
            "Invalid answers"
        );

        uint8 score = calculateScore(_answerHashes);
        currentQuiz.score = score;
        currentQuiz.completed = true;

        bool passed = score >= quizConfig.passingScore;
        if (passed) {
            _mint(msg.sender, uint256(uint160(msg.sender)));
        }

        emit QuizSubmitted(msg.sender, score, passed);
    }

    /// @notice Calculates the score based on the submitted answers
    /// @dev This is a simplified scoring method. In a real-world scenario, this might be more complex.
    /// @param _answerHashes Array of keccak256 hashes of the answers
    /// @return score The calculated score
    function calculateScore(
        bytes32[] calldata _answerHashes
    ) internal view returns (uint8) {
        // In a real implementation, you would compare _answerHashes with the correct answers
        // For this example, we'll use a placeholder calculation
        return uint8((_answerHashes.length * 100) / quizConfig.totalQuestions);
    }

    /// @notice Updates the quiz configuration
    /// @param _newConfig The new quiz configuration
    function updateQuizConfig(
        QuizConfig calldata _newConfig
    ) external onlyOwner {
        quizConfig = _newConfig;
        emit QuizConfigUpdated(_newConfig);
    }

    /// @notice Updates the Merkle root of correct answers
    /// @param _newRoot The new Merkle root
    function updateAnswersRoot(bytes32 _newRoot) external onlyOwner {
        answersRoot = _newRoot;
        emit AnswersRootUpdated(_newRoot);
    }

    /// @notice Retrieves the latest quiz attempt for a given address
    /// @param _participant The address of the participant
    /// @return The latest Quiz struct for the participant
    function getLatestQuizAttempt(
        address _participant
    ) external view returns (Quiz memory) {
        require(quizAttempts[_participant].length > 0, "No quiz attempts");
        return
            quizAttempts[_participant][quizAttempts[_participant].length - 1];
    }

    /// @notice Retrieves the total number of quiz attempts for a given address
    /// @param _participant The address of the participant
    /// @return The number of quiz attempts
    function getQuizAttemptCount(
        address _participant
    ) external view returns (uint256) {
        return quizAttempts[_participant].length;
    }

    /// @notice Prevents transfers of the soulbound NFT
    /// @dev Overrides the OpenZeppelin ERC721 _transfer function
    // removing inherited transfer functions from Open Zeppelin, we want the NFT to be non-transferable
    function transferFrom(address from, address to, uint256 tokenId) public override {}
    function safeTransferFrom(address from, address to, uint256 tokenId) public override {}
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override {}

}
