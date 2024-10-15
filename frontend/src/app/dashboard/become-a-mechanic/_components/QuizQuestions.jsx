import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';


const questions = [
  {
    question: 'What is the function of a carburetor?',
    options: ['Control air-fuel mixture', 'Increase car speed', 'Regulate oil flow', 'None of the above'],
  },
  {
    question: 'Which tool is used to measure tire pressure?',
    options: ['Torque wrench', 'Tire gauge', 'Caliper', 'Micrometer'],
  },

];

const QuizQuestions = ({ onSubmit }) => {
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [answers, setAnswers] = useState({}); 
  const [submitted, setSubmitted] = useState(false);

 
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); 
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); 
    }, 1000);

    return () => clearInterval(timer); 
  }, [timeLeft]);

  
  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };


  const handleSubmit = () => {
    if (submitted) return; 
    setSubmitted(true);


    onSubmit(answers); 
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-amber-700 mb-4">Quiz</h2>
      
   
      <div className="mb-4">
        <span className="text-xl font-bold text-red-600">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </span>
      </div>

   
      {questions.map((question, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-medium text-amber-700">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <Button
                key={optionIndex}
                variant={answers[index] === option ? 'primary' : 'secondary'}
                onClick={() => handleAnswerSelect(index, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ))}

     
      <Button 
        className="mt-4 bg-amber-700 hover:bg-[#A0522D] text-[#F8F3E6]"
        onClick={handleSubmit}
        disabled={submitted} 
      >
        {submitted ? 'Submitted' : 'Submit Quiz'}
      </Button>
    </div>
  );
};

export default QuizQuestions;
