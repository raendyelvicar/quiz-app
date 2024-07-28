import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  StackDivider,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";

function QuizCard(props) {
  const { question, selectedAnswer, onAnswerChange } = props;

  return (
    <>
      <Card marginBottom={"20px"} minHeight={"400px"}>
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
          {/* <Flex>
            <Box p='2'></Box>
            <Spacer />
            <Button>Next</Button>
          </Flex> */}
        </CardBody>
      </Card>
    </>
  );
}

export default QuizCard;
