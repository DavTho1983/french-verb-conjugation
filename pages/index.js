import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  ChakraProvider,
  extendTheme,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { Button, Flex, Input, Text } from "@chakra-ui/react";

import ConjugationContainer from "../components/conjugation/conjugation";
import englishConjugation from "../data/english-verb-conjugations.json";
import frenchConjugation from "../data/french-verb-conjugations.json";
import pronouns from "../data/pronouns.json";
import tenses from "../data/tenses.json";
import VerbDrillsModal from "../components/modal/modal";

const components = {
  Alert: {
    variants: {
      solid: {
        container: {
          bg: "#50C878",
        },
        title: {
          color: "text.50",
        },
        description: {
          color: "text.50",
        },
        icon: {
          color: "text.50",
        },
      },
    },
  },
};

const theme = extendTheme({
  colors: {
    brand: {
      50: "#44337A",
      100: "#B794F4",
      500: "#B794F4", // you need this
    },
    text: {
      50: "#ffffff",
      100: "#B794F4",
      500: "#B794F4", // you need this
    },
    brand: {
      50: "#44337A",
      100: "#B794F4",
      500: "#B794F4", // you need this
    },
  },
  components: components,
});

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [correctConfirmation, setCorrectConfirmation] = useState();
  const [reveal, setReveal] = useState(false);
  const [conjugationValue, setConjugationValue] = useState();
  const [pronoun, setPronoun] = useState();
  const [frenchPronoun, setFrenchPronoun] = useState();
  const [pronounLabel, setPronounLabel] = useState();
  const [verb, setVerb] = useState("aller");
  const [tense, setTense] = useState("imperfect");
  const [englishVerbConjugation, setEnglishVerbConjugation] = useState();
  const [frenchVerbConjugation, setFrenchVerbConjugation] = useState();
  const [currentRandomPronoun, setCurrentRandomPronoun] = useState({
    key: "",
    value: "",
  });

  const revealAnswer = () => {
    console.log("current reveal state: ", reveal);
    setReveal(true);
    return;
  };

  const randomProperty = function (obj) {
    const keys = Object.keys(obj);
    const randomKey = keys[(keys.length * Math.random()) << 0];
    if (currentRandomPronoun.key !== randomKey) {
      setCurrentRandomPronoun({ key: randomKey, value: obj[randomKey] });
      return { key: randomKey, value: obj[randomKey] };
    } else return randomProperty(obj);
  };

  const randomArrayItem = function (obj) {
    const randomItem = obj[(obj.length * Math.random()) << 0];
    return randomItem;
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

  const refreshVerb = () => {
    const randomPronoun = randomProperty(pronouns["english"]);
    const _tense = randomArrayItem(tenses);
    setPronoun(randomPronoun.value);
    setFrenchPronoun(pronouns["french"][randomPronoun.key]);
    setPronounLabel(randomPronoun.key);
    const englishVerbTense = removeGender("english", randomPronoun.key);
    const frenchVerbTense = removeGender("french", randomPronoun.key);
    const englishVerbTenseWGender =
      englishConjugation[verb][_tense][englishVerbTense];
    const frenchVerbTenseGender =
      frenchConjugation[verb][_tense][frenchVerbTense.noGender][
        frenchVerbTense.gender
      ];
    setEnglishVerbConjugation(englishVerbTenseWGender);
    if (frenchVerbTenseGender.hasOwnProperty("singular")) {
      setFrenchVerbConjugation(frenchVerbTenseGender["singular"]);
    } else setFrenchVerbConjugation(frenchVerbTenseGender);
    setConjugationValue("");
    setTense(_tense);
  };

  const vowels = ["a", "e", "i", "o", "u", "y"];

  const allowForVowels = () => {
    let check;
    if (frenchPronoun === "je" && vowels.includes(frenchVerbConjugation[0])) {
      check = "j'" + frenchVerbConjugation;
    } else {
      check = frenchPronoun + " " + frenchVerbConjugation;
    }
    return check;
  };

  const checkConjugation = () => {
    const check = allowForVowels();
    console.log("check: ", check, "conjugationValue", conjugationValue);
    if (conjugationValue.trim() === check || conjugationValue === undefined) {
      refreshVerb();
      toast({
        title: "Correct!",
        position: "top",
        description: "You got it right!",
        status: "success",
        duration: 1000,
        isClosable: true,
        variant: "solid",
      });
    } else {
      onOpen();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setReveal(false);
    }
    if (correctConfirmation === true) {
      setCorrectConfirmation(false);
    }
    if (!pronoun) {
      console.log("pronoun is empty");
      refreshVerb();
    }
  }, [
    pronoun,
    tense,
    frenchPronoun,
    conjugationValue,
    frenchVerbConjugation,
    englishVerbConjugation,
    reveal,
    isOpen,
    correctConfirmation,
  ]);

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
              <VerbDrillsModal
                isOpen={isOpen}
                onClose={onClose}
                yourAnswer={conjugationValue}
                answer={allowForVowels()}
                reveal={reveal}
                revealAnswer={revealAnswer}
              />
            </Flex>
          </Flex>
        </main>
      </div>
    </ChakraProvider>
  );
}
