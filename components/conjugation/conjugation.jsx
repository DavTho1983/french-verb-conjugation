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
    <Box
      borderRadius={10}
      bg="teal"
      p={5}
      h={100}
      color="white"
      fontWeight="semibold"
      letterSpacing="wide"
      fontSize={20}
      m={5}
      className={styles.title}
    >
      {conjugation}
    </Box>
  );
}

export default ConjugationContainer;
