import {
  ChakraProvider,
  Container,
  Button,
  Text,
  Box,
  Flex,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import QuizCard from "./components/QuizCard";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useLocalStorageState from "./hooks/useLocalStorageState";
import { fetchQuestionsData } from "./services/api";

function App() {
  const [questions, setQuestions] = useLocalStorageState("questions", []);
  const [answers, setAnswers] = useLocalStorageState("answers", {});
  const [submitAnswer, setSubmitAnswer] = useState(false);
  const [retakeQuiz, setRetakeQuiz] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [time, setTime] = useLocalStorageState("time", 180); // Set initial time (e.g., 3 minutes)
  const timerIdRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    if (startQuiz || submitAnswer) {
      fetchQuestions();
    }
  }, [startQuiz, submitAnswer]);

  useEffect(() => {
    calculateScore();
  }, [submitAnswer]);

  useEffect(() => {
    if (startQuiz && time > 0 && !submitAnswer) {
      timerIdRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      // Clear the interval on component unmount
      return () => clearInterval(timerIdRef.current);
    }
  }, [startQuiz, time, submitAnswer]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      let existingAnswers = JSON.parse(localStorage.getItem("answers"));
      let existingQuestions = JSON.parse(localStorage.getItem("questions"));
      if (existingQuestions.length == 0) {
        const questionsData = await fetchQuestionsData();
        if (questionsData.length > 0) {
          setIsLoading(false);
          setQuestions(questionsData);
          setAnswers({});
        }
      } else {
        // Parse the existing questions and answers if they are not null
        setIsLoading(false);
        setQuestions(existingQuestions ? existingQuestions : []);
        setAnswers(existingAnswers ? existingAnswers : {});
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  // Function to handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmitAnswer = () => {
    setSubmitAnswer(true);
    clearInterval(timerIdRef.current);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex !== 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitAnswer();
    }
  };

  const handleStartQuiz = () => {
    setStartQuiz(true);
    setSubmitAnswer(false);
    setCurrentQuestionIndex(0);
    setTime(180);
  };

  const handleRetakeQuiz = () => {
    localStorage.clear();
    setQuestions([]);
    setAnswers({});
    setScore(0);
    setStartQuiz(false);
    setSubmitAnswer(false);
    setCurrentQuestionIndex(0);
    setTime(180);
    setIsLoading(false);
  };

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };
  return (
    <ChakraProvider>
      {!startQuiz ? (
        <Box textAlign='center' mt={20}>
          <Button onClick={handleStartQuiz}>Start Quiz</Button>
        </Box>
      ) : isLoading ? (
        <>
          <Box textAlign='center' mt={20}>
            <Spinner />
          </Box>
        </>
      ) : !submitAnswer ? (
        <Container minW={"3xl"} height={"100vh"} p={10}>
          {questions.length > 0 && (
            <>
              <Flex>
                <Box marginBottom={5}>
                  <Text fontSize='xl' fontWeight={600}>
                    Remaining time: {formatTime(time)}
                  </Text>
                </Box>
              </Flex>
              <QuizCard
                question={questions[currentQuestionIndex]}
                selectedAnswer={answers[questions[currentQuestionIndex].id]}
                onAnswerChange={handleAnswerChange}
              />
              <Flex>
                {currentQuestionIndex !== 0 &&
                currentQuestionIndex < questions.length ? (
                  <Button onClick={handlePreviousQuestion}>
                    Previous Question
                  </Button>
                ) : null}
                <Spacer />
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Submit"}
                </Button>
              </Flex>
            </>
          )}
        </Container>
      ) : (
        <>
          <Box textAlign='center' mt={20}>
            <Text fontSize='2xl' mb={5}>
              Your score: {score}
            </Text>
            <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
          </Box>
        </>
      )}
    </ChakraProvider>
  );
}

export default App;
