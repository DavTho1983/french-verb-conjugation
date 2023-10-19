// Core React dependencies
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Th,
  Tr,
  Square,
  Table,
  Tbody,
  Thead,
  Td,
  Tab,
  TabList,
  Tabs,
  Select,
  InputLeftElement,
  Container,
} from "@chakra-ui/react";

import styles from "./Conjugation.module.css";

// Component imports

function ConjugationContainer({ conjugation }) {
  useEffect(() => {}, []);

  return (
    <Flex>
      <Box
        borderRadius={10}
        bg="tomato"
        p={10}
        color="white"
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize="50px"
        ml="2"
        className={styles.title}
        minW={200}
      >
        {conjugation}
      </Box>
    </Flex>
  );
}

export default ConjugationContainer;
