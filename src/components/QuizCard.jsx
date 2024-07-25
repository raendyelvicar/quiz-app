import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  VStack,
  Box,
  StackDivider,
  Flex,
  Spacer,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";

function QuizCard(props) {
  const { question, selectedAnswer, onAnswerChange } = props;

  return (
    <>
      <Card>
        <CardHeader fontSize={"small"}>Question {question.id + 1}</CardHeader>
        <CardBody>
          <Stack spacing={8}>
            <Text fontSize='xl'>{question.question}</Text>
            <RadioGroup
              onChange={(value) => onAnswerChange(question.id, value)}
              value={selectedAnswer || ""}>
              <Stack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={4}
                direction={"column"}>
                {question.answers.map((answer, index) => {
                  return (
                    <Radio
                      size='lg'
                      key={index}
                      value={answer}
                      colorScheme='orange'>
                      {answer}
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
          </Stack>
          <Flex>
            <Box p='2'></Box>
            <Spacer />
            <Button>Next</Button>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}

export default QuizCard;
