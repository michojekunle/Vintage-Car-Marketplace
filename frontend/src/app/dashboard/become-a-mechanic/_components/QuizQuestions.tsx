'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
  const [timeLeft, setTimeLeft] = useState<number>(12 * 60); // 12 minutes in seconds

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [timeLeft]);

 
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: event.target.value,
    });
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


  const handleSubmit = () => {
    onSubmit(selectedAnswers); 
  };

  return (
    <div className="grid grid-cols-3 gap-6">
     
      <div className="col-span-2">
        <h2 className="text-2xl font-semibold text-amber-700 mb-4">Question {currentQuestion + 1} of {questions.length}</h2>
        
        <p className="text-lg mb-4">{questions[currentQuestion].question}</p>


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

  
      <div className="col-span-1 text-right">
        <h3 className="text-2xl font-semibold text-red-600">Time Left</h3>
        <div className="text-lg">
          <p>{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
