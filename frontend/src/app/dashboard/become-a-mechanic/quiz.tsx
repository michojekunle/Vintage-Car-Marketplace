import React from 'react';
import QuizQuestions from './_components/QuizQuestions';


const QuizPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-left mb-8 text-amber-700 border-amber-700 pb-4">
        Mechanic Quiz
      </h1>

      {/* Display the quiz questions */}
      <QuizQuestions />
    </div>
  );
};

export default QuizPage;
