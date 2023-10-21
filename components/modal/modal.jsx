// Core React dependencies
import React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import styles from "./modal.module.css";

// Component imports

function VerbDrillsModal({
  isOpen,
  onClose,
  answer,
  yourAnswer,
  revealAnswer,
  reveal,
  finalFocusRef,
}) {
  return (
    <Modal
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="2px"
      />
      <ModalContent maxW="350px" h={300}>
        <ModalHeader className={styles.modalHeader} />
        <ModalCloseButton />
        <ModalBody>
          {reveal === true ? (
            <Center count={2} h={150}>
              <Flex flexDirection={"column"}>
                <Box mt={10} fontSize={25}>
                  The correct answer is{" "}
                </Box>
                <Box mt={5} className={styles.yourAnswer}>
                  {answer}
                </Box>
              </Flex>
            </Center>
          ) : (
            <Center>
              {yourAnswer !== "" ? (
                <Center mt={14}>
                  Sorry <p className={styles.yourWrongAnswer}>{yourAnswer}</p>{" "}
                  is the wrong answer
                </Center>
              ) : (
                <Center m={8} mt={14} className={styles.noAnswer}>
                  Please make sure to type your answer before checking!
                </Center>
              )}
            </Center>
          )}
        </ModalBody>

        <ModalFooter align={"center"}>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Try again
          </Button>
          <Button variant="ghost" mr={6} onClick={() => revealAnswer()}>
            Reveal answer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default VerbDrillsModal;
