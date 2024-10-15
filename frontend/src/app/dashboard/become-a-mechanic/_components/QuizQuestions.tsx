import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Define the question type
type Question = {
  question: string;
  options: string[];
};

// Example questions (replace this with actual questions)
const questions: Question[] = [
  {
    question: 'What is the function of a carburetor?',
    options: ['Control air-fuel mixture', 'Increase car speed', 'Regulate oil flow', 'None of the above'],
  },
  {
    question: 'Which tool is used to measure tire pressure?',
    options: ['Torque wrench', 'Tire gauge', 'Caliper', 'Micrometer'],
  },
  // Add more questions here...
];

// Define the props type for the QuizQuestions component
type QuizQuestionsProps = {
  onSubmit: (answers: { [key: number]: string }) => void;
};

const QuizQuestions: React.FC<QuizQuestionsProps> = ({ onSubmit }) => {
  const [timeLeft, setTimeLeft] = useState<number>(12 * 60); // 12 minutes in seconds
  const [answers, setAnswers] = useState<{ [key: number]: string }>({}); // Store answers by question index
  const [submitted, setSubmitted] = useState<boolean>(false); // Track submission status

  // Timer countdown logic with auto-submit when time reaches zero
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when the timer reaches zero
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // Decrease the timer by 1 second
    }, 1000);

    return () => clearInterval(timer); // Clear the interval when the component unmounts
  }, [timeLeft]);

  // Handle selecting an answer for a question
  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer, // Store the selected answer
    }));
  };

  // Handle quiz submission
  const handleSubmit = () => {
    if (submitted) return; // Prevent multiple submissions
    setSubmitted(true);

    // Submit the answers to the parent component
    onSubmit(answers);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-amber-700 mb-4">Quiz</h2>

      {/* Timer */}
      <div className="mb-4">
        <span className="text-xl font-bold text-red-600">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
          {timeLeft % 60}
        </span>
      </div>

      {/* Quiz Questions */}
      {questions.map((question, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-medium text-amber-700">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <Button
                key={optionIndex}
                variant={answers[index] === option ? 'primary' : 'secondary'}
                onClick={() => handleAnswerSelect(index, option)} // Handle answer selection
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <Button
        className="mt-4 bg-amber-700 hover:bg-[#A0522D] text-[#F8F3E6]"
        onClick={handleSubmit}
        disabled={submitted} // Disable button after submission
      >
        {submitted ? 'Submitted' : 'Submit Quiz'}
      </Button>
    </div>
  );
};

export default QuizQuestions;
