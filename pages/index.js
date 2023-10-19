import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

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
  Text,
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

import ConjugationContainer from "../components/conjugation/conjugation";
import englishConjugation from "../data/english-verb-conjugations.json";
import frenchConjugation from "../data/french-verb-conjugations.json";
import pronouns from "../data/pronouns.json";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#44337A",
      100: "#B794F4",
      500: "#B794F4", // you need this
    },
  },
});

export default function Home() {
  const [conjugationValue, setConjugationValue] = useState();
  const [pronoun, setPronoun] = useState();
  const [frenchPronoun, setFrenchPronoun] = useState();
  const [pronounLabel, setPronounLabel] = useState();
  const [verb, setVerb] = useState("aller");
  const [tense, setTense] = useState("present");
  const [gender, setGender] = useState("feminine");
  const [englishVerbConjugation, setEnglishVerbConjugation] = useState();
  const [frenchVerbConjugation, setFrenchVerbConjugation] = useState();

  const randomProperty = function (obj) {
    const keys = Object.keys(obj);
    const randomKey = keys[(keys.length * Math.random()) << 0];
    return { key: randomKey, value: obj[randomKey] };
  };

  const removeGender = (language, verbTenseWGender) => {
    if (language === "french") {
      let verbTense = {
        noGender: "",
        gender: "masculine",
      };
      if (verbTenseWGender.includes("feminine")) {
        verbTense.gender = "feminine";
      }
      if (verbTenseWGender.includes("masculine")) {
        verbTense.gender = "masculine";
      }
      if (verbTenseWGender.includes("indefinite")) {
        verbTense.gender = "indefinite";
      }
      verbTense.noGender = verbTenseWGender
        .replace("feminine", "")
        .replace("masculine", "")
        .replace("indefinite", "")
        .replace("  ", " ")
        .trim();
      return verbTense;
    } else {
      let verbTense = verbTenseWGender
        .replace("feminine", "")
        .replace("masculine", "")
        .replace("indefinite", "")
        .replace("  ", " ");
      return verbTense.trim();
    }
  };

  const checkConjugation = () => {
    const check = frenchPronoun + " " + frenchVerbConjugation;
    console.log("check: ", check, "conjugationValue", conjugationValue);
    if (conjugationValue === check || conjugationValue === undefined) {
      const randomPronoun = randomProperty(pronouns["english"]);
      setPronoun(randomPronoun.value);
      setFrenchPronoun(pronouns["french"][randomPronoun.key]);
      setPronounLabel(randomPronoun.key);
      const englishVerbTense = removeGender("english", randomPronoun.key);
      const frenchVerbTense = removeGender("french", randomPronoun.key);
      const englishVerbTenseWGender =
        englishConjugation[verb][tense][englishVerbTense];
      const frenchVerbTenseGender =
        frenchConjugation[verb][tense][frenchVerbTense.noGender][
          frenchVerbTense.gender
        ];
      setEnglishVerbConjugation(englishVerbTenseWGender);
      if (frenchVerbTenseGender.hasOwnProperty("singular")) {
        setFrenchVerbConjugation(frenchVerbTenseGender["singular"]);
      } else setFrenchVerbConjugation(frenchVerbTenseGender);
    } else {
      alert("Incorrect");
    }
  };

  useEffect(() => {}, [conjugationValue, frenchVerbConjugation]);

  return (
    <ChakraProvider theme={theme}>
      <div className={styles.container}>
        <Head>
          <title>French Verb Drills App</title>
        </Head>

        <main>
          <Flex direction={"column"} m={5}>
            <Flex direction={"row"}>
              <Flex direction={"column"} m={3}>
                <Text fontSize={15} m={3} color={"blue"}>
                  {pronounLabel}
                </Text>
                <ConjugationContainer conjugation={pronoun} />
              </Flex>
              <Flex direction={"row"}>
                <Flex direction={"column"} m={3}>
                  <Flex direction={"row"}>
                    <Text fontSize={15} m={3} color={"blue"}>
                      {verb}
                    </Text>
                    <Text fontSize={15} m={3} color={"blue"}>
                      {tense}
                    </Text>
                  </Flex>
                  <ConjugationContainer conjugation={englishVerbConjugation} />
                </Flex>
              </Flex>
            </Flex>

            <Flex direction={"row"} m={5}>
              <Flex direction={"column"}>
                <Input
                  fontSize={50}
                  mb={8}
                  p={8}
                  w={500}
                  value={conjugationValue}
                  onChange={(event) => setConjugationValue(event.target.value)}
                />
                <Button
                  size="lg"
                  colorScheme="brand"
                  variant="solid"
                  mb={8}
                  p={20}
                  fontSize={50}
                  onClick={() => checkConjugation()}
                >
                  ?
                </Button>
              </Flex>
              {/* <Flex direction={"row"}>
                <Flex direction={"column"} m={3}>
                  <Text fontSize={15} m={3} color={"blue"}>
                    {pronounLabel}
                  </Text>
                  <ConjugationContainer conjugation={frenchPronoun} />
                </Flex>
                <Flex direction={"row"}>
                  <Flex direction={"column"} m={3}>
                    <Flex direction={"row"}>
                      <Text fontSize={15} m={3} color={"blue"}>
                        {verb}
                      </Text>
                      <Text fontSize={15} m={3} color={"blue"}>
                        {tense}
                      </Text>
                    </Flex>
                    <ConjugationContainer conjugation={frenchVerbConjugation} />
                  </Flex>
                </Flex>
              </Flex> */}
            </Flex>
          </Flex>
        </main>
      </div>
    </ChakraProvider>
  );
}
