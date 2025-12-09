import React, { useState } from 'react';

const QuizCard = ({ question, options, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    // כאן ניתן לבצע פעולות נוספות כמו שמירת התשובה שנבחרה
    onNext(); // קריאה לפונקציה להעברת השאלה הבאה
  };

  return (
    <div className="quiz-card">
      <h2>{question}</h2>
      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={selectedOption === option ? 'selected' : ''}
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={handleNextClick} disabled={!selectedOption}>
        שאלה הבאה
      </button>
    </div>
  );
};

export default QuizCard;
