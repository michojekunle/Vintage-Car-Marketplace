'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';
import mechanicVerificationABI from './MechanicVerification.json';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const questions: Question[] = [
  {
    question: 'A customer brings their car to your workshop, complaining that the steering feels "loose" and there’s a clunking noise when making turns. What is the most likely cause of this issue?',
    options: [
      'The car\'s alignment is off, causing the steering to feel loose.',
      'The power steering fluid is low, leading to increased steering effort and clunking sounds.',
      'Worn-out or damaged tie rod ends or ball joints in the steering system are causing excessive play and noise.',
      'The brake pads are worn out, leading to steering vibration and noise when turning.',
    ],
    correctAnswer: 'Worn-out or damaged tie rod ends or ball joints in the steering system are causing excessive play and noise.',
  },
  {
    question: 'You are asked to perform a brake inspection on a customer\'s vehicle. While inspecting, you notice that the brake rotors are scored and have uneven wear patterns. What should be your recommended course of action?',
    options: [
      'Suggest resurfacing the rotors to even out the wear patterns and replace the brake pads.',
      'Recommend only replacing the brake pads, as they are the primary component that wears out.',
      'Advise that the entire braking system, including calipers, brake lines, and master cylinder, be replaced.',
      'Suggest applying brake grease to reduce noise and vibration and avoid any component replacement.',
    ],
    correctAnswer: 'Suggest resurfacing the rotors to even out the wear patterns and replace the brake pads.',
  },
];

const QuizQuestions = ({ onSubmit }: { onSubmit: (answers: { [key: number]: string }) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number>(12 * 60); 


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
      alert('Time is up! Auto-submitting your quiz.');
      return;  
  }

  
  const answerHashes = questions.map((q, index) =>
    ethers.keccak256(ethers.toUtf8Bytes(selectedAnswers[index] || ''))
);

const leaves = answerHashes.map(x => ethers.keccak256(x));
const tree = new MerkleTree(leaves, ethers.keccak256, { sortPairs: true });

const proofs = answerHashes.map(hash => tree.getProof(hash).map(p => p.data));


try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0xfcC489386F8D3797713281EAf541108e9BEfe56e'; 
    const mechanicVerificationContract = new ethers.Contract(
        contractAddress,
        mechanicVerificationABI,
        await signer
    );

    const tx = await mechanicVerificationContract.submitQuiz(answerHashes, proofs);
    await tx.wait();

    console.log('Quiz submitted successfully!');
} catch (error) {
    console.error('Error submitting the quiz:', error);
}
};

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-end w-full mb-4 px-4">
        <div className="text-right">
          <h3 className="text-2xl font-semibold text-red-600">Time Left</h3>
          <div className="text-lg">
            <p>{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</p>
          </div>
        </div>
      </div>

      <div className=" w-[89%] bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-4 text-center">Question {currentQuestion + 1} of {questions.length}</h2>

        <p className="text-2xl font-bold text-700 mb-4 text-center">
  {questions[currentQuestion].question}
</p>

        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <label key={index} className="block ">
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
          <Button onClick={handlePrevious} disabled={currentQuestion === 0} className="bg-gray-500 hover:bg-gray-600 text-white">
            Previous
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={handleNext} className="bg-amber-700 hover:bg-amber-800 text-white">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
