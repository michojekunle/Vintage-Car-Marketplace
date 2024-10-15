"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import questionsData from "./questions.json";
import mechanicVerificationABI from "./MechanicVerification.json";

type Question = {
  question: string;
  options: string[];
  answer: string; // Adjusted the type to match the JSON structure
};

const QuizQuestions = ({
  onSubmit,
}: {
  onSubmit: (answers: { [key: number]: string }) => void;
}) => {
  const [questions, setQuestions] = useState<Question[]>([]); // Typing the questions array
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [timeLeft, setTimeLeft] = useState<number>(12 * 60); // 12 minutes timer

  // Load questions from JSON directly
  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      setTimeLeft(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const answer = event.target.value;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    });
    handleNext();
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (timeLeft <= 0) {
      alert("Time is up! Auto-submitting your quiz.");
      return;
    }

    const answerHashes = questions.map((q, index) =>
      ethers.keccak256(ethers.toUtf8Bytes(selectedAnswers[index] || ""))
    );

    const leaves = answerHashes.map((x) => ethers.keccak256(x));
    const tree = new MerkleTree(leaves, ethers.keccak256, { sortPairs: true });

    const proofs = answerHashes.map((hash) =>
      tree.getProof(hash).map((p) => p.data)
    );

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = "0xfcC489386F8D3797713281EAf541108e9BEfe56e";
      const mechanicVerificationContract = new ethers.Contract(
        contractAddress,
        mechanicVerificationABI,
        await signer
      );

      const tx = await mechanicVerificationContract.submitQuiz(
        answerHashes,
        proofs
      );
      await tx.wait();

      console.log("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting the quiz:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-end w-full mb-4 px-4">
        <div className="text-right">
          <h3 className="text-2xl font-semibold text-red-600">Time Left</h3>
          <div className="text-lg">
            <p>
              {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
              {timeLeft % 60}
            </p>
          </div>
        </div>
      </div>

      <div className="w-[89%] bg-white shadow-lg rounded-lg p-8">
        {questions.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-amber-700 mb-4 text-center">
              Question {currentQuestion + 1} of {questions.length}
            </h2>

            <p className="text-2xl font-bold text-700 mb-4 text-center">
              {questions[currentQuestion].question}
            </p>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <label key={index} className="block">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={selectedAnswers[currentQuestion] === option}
                    onChange={handleAnswerChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Previous
              </Button>
              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizQuestions;
