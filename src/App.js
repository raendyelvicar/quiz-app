import {
  ChakraProvider,
  Container,
  Button,
  Text,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import QuizCard from "./components/QuizCard";
import { useState, useEffect } from "react";
import axios from "axios";
import useLocalStorageState from "./helpers/customHook";
import { fetchQuestionsData } from "./services/api";

function App() {
  const [questions, setQuestions] = useLocalStorageState("questions", []);
  const [answers, setAnswers] = useLocalStorageState("anwers", {});
  const [submitAnswer, setSubmitAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let existingAnswers = localStorage.getItem("answers");
        let existingQuestions = localStorage.getItem("questions");
        if (existingQuestions === null && existingAnswers === null) {
          const questionsData = await fetchQuestionsData();
          setQuestions(questionsData);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Function to handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmitAnswer = () => {
    setSubmitAnswer(!submitAnswer);
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

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
  };

  useEffect(() => {
    calculateScore();
  }, [submitAnswer]);

  return (
    <ChakraProvider>
      {!submitAnswer ? (
        <Container minW={"3xl"} height={"100vh"} p={10}>
          {questions.length > 0 && (
            <>
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
        <Box textAlign='center' mt={20}>
          <Text fontSize='2xl'>Your score: {score}</Text>
        </Box>
      )}
    </ChakraProvider>
  );
}

export default App;
