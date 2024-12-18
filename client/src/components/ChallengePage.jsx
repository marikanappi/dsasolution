import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions, getAnswers } from "/../client/API.mjs";
import { Link } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import "../css/challengepage.css";

const ChallengePage = ({ setFooterOption }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { challenge } = location.state || {};
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); 
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds

  const totalTime = 120 * (questions.length || 1); // 2min for each question => Total time in seconds

  useEffect(() => {
    const fetchQuestions = async () => {
      if (challenge) {
        const questionsData = await getQuestions(challenge.id);
        setQuestions(questionsData || []);
      }
    };
    fetchQuestions();
  }, [challenge]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      const fetchAnswers = async () => {
        if (question?.id) {
          const answersData = await getAnswers(question.id);
          setAnswers(answersData || []);
        }
      };
      fetchAnswers();
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev + 1 >= totalTime) {
          clearInterval(timer);
          navigate("/challenge-summary", {
            state: { correctAnswers, challengeTitle: challenge.title },
          });
          setFooterOption("SummaryChallenge");
          return totalTime;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTime, setFooterOption]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      setFeedback("Please select an answer!");
      return;
    }

    const correctAnswer = answers.find(answer => answer.is_correct);
    if (correctAnswer) {
      if (selectedAnswer === correctAnswer.text) {
        setFeedback("Correct!");
        setCorrectAnswers(correctAnswers + 1); 
        console.log(correctAnswers)
      } else {
        setFeedback(correctAnswer.feedback || "Incorrect.");
      }
    } else {
      setFeedback("No correct answer provided for this question.");
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setIsAnswered(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const renderProgressBar = () => (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${(elapsedTime / totalTime) * 100}%` }}
        ></div>
      </div>
      <div className="time-info">
        {formatTime(elapsedTime)} / {formatTime(totalTime)}
      </div>
    </div>
  );

  return (
    <div className="challenge-page">
      {challenge && questions.length > 0 && (
        <>
          <h1>Challenge: {challenge.title}</h1>
          {renderProgressBar()}
          <p>{questions[currentQuestionIndex].text}</p>

          <div className="answers-container">
            {answers.map((answer, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`answer-${index}`}
                  name="answer"
                  value={answer.text}
                  checked={selectedAnswer === answer.text}
                  onChange={handleAnswerChange}
                />
                <label htmlFor={`answer-${index}`}>{answer.text}</label>
              </div>
            ))}
          </div>

          <div>
            <button onClick={handleSubmitAnswer}>Submit Answer</button>
            {feedback && <div className="feedback">{feedback}</div>}
          </div>

          <div>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNextQuestion}>Next Question</button>
            ) : (
              isAnswered && (
                  <button  onClick={() => {
                    navigate("/challenge-summary", {
                      state: { correctAnswers, challengeTitle: challenge.title },
                    });
                    setFooterOption("SummaryChallenge");
                    }}>
                    <FaTrophy className="trophy-icon" />
                    <span>{challenge.title}</span>
                  </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengePage;
