// Core React dependencies
import React from "react";
import {
  Box,
  Button,
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
      size="xl"
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="2px"
      />
      <ModalContent>
        <ModalHeader className={styles.modalHeader} />
        <ModalCloseButton />
        <ModalBody>
          {reveal === true ? (
            <Flex count={2} h={100} flexDirection={"row"} align="center">
              The correct answer is{" "}
              <p className={styles.yourAnswer}>{answer}</p>
            </Flex>
          ) : (
            <Flex count={2} h={100} flexDirection={"row"} align="center">
              {yourAnswer !== "" ? (
                <>
                  Sorry <p className={styles.yourWrongAnswer}>{yourAnswer}</p>{" "}
                  is the wrong answer
                </>
              ) : (
                <Box className={styles.noAnswer}>
                  Please make sure to type your answer before checking!
                </Box>
              )}
            </Flex>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Try again
          </Button>
          <Button variant="ghost" onClick={() => revealAnswer()}>
            Reveal answer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default VerbDrillsModal;
