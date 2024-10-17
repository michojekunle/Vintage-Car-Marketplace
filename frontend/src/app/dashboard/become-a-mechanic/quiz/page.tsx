'use client'

import React from 'react';
import QuizQuestions from '../_components/QuizQuestions';


const QuizPage = () => {

  const submitAnswers = (answers: { [key: number]: string }) => {
    console.log('Submitted Answers:', answers);
    // submit to blockchain
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-left mb-8 text-amber-700 border-amber-700 pb-4">
        Standard Mechanic Test
      </h1>

      <QuizQuestions onSubmit={submitAnswers} />
    </div>
  );
};

export default QuizPage;
