import { Center, ChakraProvider, Container, Flex } from "@chakra-ui/react";
import QuizCard from "./components/QuizCard";
import { useState, useEffect } from "react";
import axios from "axios";
import getQuestions from "./api";
import data from "./data";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // Fetch data from API
  useEffect(() => {
    const temp = [];
    axios
      .get(
        "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
      )
      .then((item) => {
        const data = item.data.results;
        data.map((element, index) => {
          const questionModel = {
            id: 0,
            question: "",
            answers: [],
            correct_answer: "",
          };

          questionModel.id = index;
          questionModel.question = element.question;
          questionModel.answers.push(element.correct_answer);
          element.incorrect_answers.map((i) => {
            questionModel.answers.push(i);
          });
          questionModel.correct_answer = element.correct_answer;

          temp.push(questionModel);
        });

        setQuestions(temp);
      });
  }, []);

  // Function to handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  return (
    <ChakraProvider>
      <Container minW={"3xl"} height={"100vh"}>
        {questions.map((question, index) => {
          return (
            <QuizCard
              key={index}
              question={question}
              selectedAnswer={answers[question.id]}
              onAnswerChange={handleAnswerChange}></QuizCard>
          );
        })}

        <Flex>
          <Center></Center>
        </Flex>
      </Container>
    </ChakraProvider>
  );
}

export default App;
