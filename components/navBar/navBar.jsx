// Core React dependencies
import React, { useState, useEffect } from "react";
import { Box, Flex, SlideFade, Stack, Checkbox, Text } from "@chakra-ui/react";

import styles from "./navBar.module.css";

import tenses from "../../data/tenses.json";
import pronouns from "../../data/pronouns.json";

// Component imports

function NavBar({
  isNavBarOpen,
  handleCheckBoxClick,
  currentVerbs,
  verbs,
  currentTenses,
  tenses,
  currentPronouns,
  pronouns,
}) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [item1Open, setItem1Open] = useState(false);
  const [item2Open, setItem2Open] = useState(false);
  const [item3Open, setItem3Open] = useState(false);

  const getTensesHeight = (t) => {
    return t * 20;
  };
  useEffect(() => {
    if (optionsOpen && !isNavBarOpen) {
      setOptionsOpen(false);
    }
  }, [optionsOpen, isNavBarOpen]);

  return (
    <SlideFade in={isNavBarOpen} offsetY="-20px">
      <Box
        bg="#B794F4"
        p={5}
        h={20}
        w={393}
        mb={8}
        color="white"
        fontFamily={"sans-serif"}
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize={20}
        shadow="md"
        onClick={() => setOptionsOpen(!optionsOpen)}
      >
        options
      </Box>
      {optionsOpen && (
        <Stack spacing={8}>
          {" "}
          <Box
            w={393}
            h={getTensesHeight(tenses)}
            p={8}
            bg="teal.500"
            onMouseEnter={() => setItem1Open(true)}
            onMouseLeave={() => setItem1Open(false)}
            border={!item1Open ? "5px solid white" : "none"}
          >
            <Text
              color="white"
              fontFamily={"sans-serif"}
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize={20}
            >
              tenses
            </Text>
            <Flex direction={"column"} justify={"space-between"}>
              {tenses.map((tense, index) => (
                <Checkbox
                  key={index}
                  h={16}
                  w={16}
                  m={2}
                  size="lg"
                  bg={"teal.500"}
                  color="white"
                  colorScheme="purple"
                  fontFamily={"sans-serif"}
                  fontSize={20}
                  fontWeight="semibold"
                  letterSpacing="wide"
                  isChecked={[...currentTenses].includes(tense)}
                  onChange={(e) =>
                    handleCheckBoxClick(e.target.checked, "tense", index)
                  }
                >
                  {tense}
                </Checkbox>
              ))}
            </Flex>
          </Box>
          <Box
            w={393}
            h={getTensesHeight(Object.keys(verbs))}
            p={8}
            border={!item2Open ? "5px solid white" : "none"}
            bg="#B794F4"
            onMouseEnter={() => setItem2Open(true)}
            onMouseLeave={() => setItem2Open(false)}
          >
            <Text
              color="white"
              fontFamily={"sans-serif"}
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize={20}
            >
              verbs
            </Text>
            <Flex direction={"column"} justify={"space-between"}>
              {verbs.map((verb, index) => (
                <Checkbox
                  key={index}
                  h={16}
                  w={16}
                  m={2}
                  size="lg"
                  bg={"#B794F4"}
                  color="white"
                  colorScheme="purple"
                  fontFamily={"sans-serif"}
                  fontSize={20}
                  fontWeight="semibold"
                  letterSpacing="wide"
                  isChecked={[...currentVerbs].includes(verb)}
                  onChange={(e) =>
                    handleCheckBoxClick(e.target.checked, "verb", index)
                  }
                >
                  {verb}
                </Checkbox>
              ))}
            </Flex>
          </Box>
          <Box
            w={393}
            h={getTensesHeight(Object.keys(verbs))}
            p={8}
            border={!item3Open ? "5px solid white" : "none"}
            bg="teal.500"
            onMouseEnter={() => setItem3Open(true)}
            onMouseLeave={() => setItem3Open(false)}
          >
            <Text
              color="white"
              fontFamily={"sans-serif"}
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize={20}
            >
              pronouns
            </Text>
            <Flex direction={"column"} justify={"space-between"}>
              {pronouns.map((pronoun, index) => (
                <Checkbox
                  key={index}
                  h={16}
                  w={300}
                  m={2}
                  size="lg"
                  bg={"teal.500"}
                  color="white"
                  colorScheme="purple"
                  fontFamily={"sans-serif"}
                  fontSize={20}
                  fontWeight="semibold"
                  letterSpacing="wide"
                  isChecked={[...currentPronouns].includes(pronoun)}
                  onChange={(e) =>
                    handleCheckBoxClick(e.target.checked, "pronoun", index)
                  }
                >
                  {pronoun.trim()}
                </Checkbox>
              ))}
            </Flex>
          </Box>
        </Stack>
      )}
    </SlideFade>
  );
}

export default NavBar;
