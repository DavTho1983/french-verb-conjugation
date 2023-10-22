import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  ChakraProvider,
  Center,
  Grid,
  GridItem,
  Box,
  extendTheme,
  useDisclosure,
  useToast,
  SlideFade,
} from "@chakra-ui/react";

import { Button, Flex, Input, Text } from "@chakra-ui/react";

import ConjugationContainer from "../components/conjugation/conjugation";
import englishConjugation from "../data/english-verb-conjugations.json";
import frenchConjugation from "../data/french-verb-conjugations.json";
import pronouns from "../data/pronouns.json";
import tenses from "../data/tenses.json";
import VerbDrillsModal from "../components/modal/modal";
import NavBar from "../components/navBar/navBar";

const components = {
  Alert: {
    variants: {
      solid: {
        container: {
          bg: "teal",
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
      error: {
        container: {
          bg: "tomato",
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
  Modal: {
    baseStyle: (props) => ({
      dialog: {
        bg: "#FFFFFF",
        border: "2px solid #B794F4",
      },
    }),
  },
};

const theme = extendTheme({
  colors: {
    brand: {
      50: "#44337A",
      100: "#B794F4",
      500: "#B794F4",
    },
    text: {
      50: "#ffffff",
      100: "#B794F4",
      500: "#B794F4",
    },
  },
  components: components,
});

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

export default function Home() {
  //PAGE STATES
  const finalRef = React.useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [correctConfirmation, setCorrectConfirmation] = useState();
  const [reveal, setReveal] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [currentFonts, setCurrentFonts] = useState({
    pronoun: "cursive",
    verb: "monospace",
    englishVerbConjugation: "sans-serif",
  });
  const [conjugationValue, setConjugationValue] = useState();

  // NAVBAR MENU INITIAL STATE
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const [pronoun, setPronoun] = useState();

  // NAVBAR MENU NEW STATE
  const [frenchVerbs, setFrenchVerbs] = useState(
    Object.keys(frenchConjugation)
  );
  const [currentVerbs, setCurrentVerbs] = useState(
    Object.keys(frenchConjugation)
  );
  const [currentTenses, setCurrentTenses] = useState(tenses);
  const prevVerbs = usePrevious(currentVerbs);
  const prevTenses = usePrevious(currentTenses);

  const [frenchPronoun, setFrenchPronoun] = useState();
  const [pronounLabel, setPronounLabel] = useState();
  const [verb, setVerb] = useState("avoir");
  const [tense, setTense] = useState("imperfect");
  const [englishVerbConjugation, setEnglishVerbConjugation] = useState();
  const [frenchVerbConjugation, setFrenchVerbConjugation] = useState();
  const [currentRandomPronoun, setCurrentRandomPronoun] = useState({
    key: "",
    value: "",
  });

  const revealAnswer = () => {
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

  const refresh = () => {
    if (currentVerbs.length === 0) {
      setCurrentVerbs(["aller"]);
      return toast({
        title: "No verbs!",
        position: "top",
        description: "You have no verbs selected. Please select a verb",
        status: "error",
        duration: 1000,
        isClosable: true,
        variant: "error",
      });
    }
    const randomPronoun = randomProperty(pronouns["english"]);
    const randomVerb = randomArrayItem(currentVerbs);
    const _tense = randomArrayItem(currentTenses);
    setPronoun(randomPronoun.value);
    setFrenchPronoun(pronouns["french"][randomPronoun.key]);
    setPronounLabel(randomPronoun.key);
    const englishVerbTense = removeGender("english", randomPronoun.key);
    const frenchVerbTense = removeGender("french", randomPronoun.key);
    const englishVerbTenseWGender =
      englishConjugation[randomVerb][_tense][englishVerbTense];
    const frenchVerbTenseGender =
      frenchConjugation[randomVerb][_tense][frenchVerbTense.noGender][
        frenchVerbTense.gender
      ];
    setEnglishVerbConjugation(englishVerbTenseWGender);
    if (frenchVerbTenseGender.hasOwnProperty("singular")) {
      setFrenchVerbConjugation(frenchVerbTenseGender["singular"]);
    } else setFrenchVerbConjugation(frenchVerbTenseGender);
    setConjugationValue("");
    setTense(_tense);
    setVerb(randomVerb);
    chooseFont();
    if (!isNavBarOpen) {
      finalRef.current.focus();
    }
  };

  const vowels = ["a", "e", "i", "o", "u", "y"];

  const fonts = ["monospace", "sans-serif"];

  const getFirstLetter = (str) => {
    if (str !== undefined) return str.split(" ").splice(-1)[0][0];
    return;
  };

  const chooseFont = () => {
    return setCurrentFonts({
      pronoun: randomArrayItem(fonts),
      verb: randomArrayItem(fonts),
    });
  };

  const allowForVowels = () => {
    let check;
    if (frenchPronoun === "je" && vowels.includes(frenchVerbConjugation[0])) {
      check = "j'" + frenchVerbConjugation;
    } else {
      check = frenchPronoun + " " + frenchVerbConjugation;
    }
    return check.toLowerCase();
  };

  const checkConjugation = () => {
    const check = allowForVowels();
    if (
      (conjugationValue.trim().toLowerCase() === check ||
        conjugationValue === undefined) &&
      currentVerbs.length > 0
    ) {
      refresh();
      setConsecutiveCorrect(consecutiveCorrect + 1);
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
      setConsecutiveCorrect(0);
      onOpen();
    }
  };

  const genders = ["masculine", "feminine", "indefinite"];

  const getGenderColour = (pronounFirstLetter) => {
    switch (pronounFirstLetter.toLowerCase()) {
      case "f":
        return "#B794F4";
      case "m":
        return "teal";
      default:
        return "pink.200";
    }
  };

  const handleCheckBoxClick = (checked, label, index) => {
    switch (label) {
      case "verb": {
        const _verb = frenchVerbs[index];
        console.log("VERB", _verb);
        if (checked !== false) {
          let _newcurrentVerbs = currentVerbs;
          _newcurrentVerbs.push(_verb);
          setCurrentVerbs([..._newcurrentVerbs]);
        } else {
          const _newcurrentVerbs = currentVerbs.filter(function (v) {
            return v !== _verb;
          });
          setCurrentVerbs(_newcurrentVerbs);
        }
      }
      case "tense": {
        const _tense = tenses[index];
        if (checked !== false) {
          let _newcurrentTenses = currentTenses;
          _newcurrentTenses.push(_tense);
          setCurrentTenses([..._newcurrentTenses]);
        } else {
          const _newcurrentTenses = currentTenses.filter(function (t) {
            return t !== _tense;
          });
          setCurrentTenses(_newcurrentTenses);
        }
      }
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
      refresh();
    }
    if (prevVerbs !== currentVerbs) {
      refresh();
    }
    if (prevTenses !== currentTenses) {
      refresh();
    }
  }, [
    isNavBarOpen,
    consecutiveCorrect,
    pronoun,
    verb,
    currentFonts,
    tense,
    frenchPronoun,
    conjugationValue,
    frenchVerbConjugation,
    englishVerbConjugation,
    reveal,
    isOpen,
    correctConfirmation,
    currentVerbs,
    currentTenses,
  ]);

  return (
    <ChakraProvider theme={theme}>
      <div className={styles.container}>
        <Head>
          <title>French Verb Drills App</title>
        </Head>
        <Flex direction={"column"} m={0} w={393}>
          <Box
            onMouseEnter={() => setIsNavBarOpen(true)}
            onMouseLeave={() => setIsNavBarOpen(false)}
            borderBottom="2rem solid #FFFFFF"
          >
            {isNavBarOpen && (
              <NavBar
                isNavBarOpen={isNavBarOpen}
                handleCheckBoxClick={handleCheckBoxClick}
                currentVerbs={currentVerbs}
                verbs={frenchVerbs}
                currentTenses={currentTenses}
                tenses={tenses}
              />
            )}
          </Box>
          <Grid templateColumns="repeat(2, 1fr)" m={2} mb={0}>
            <Flex direction={"row"}>
              <Center
                m={3}
                fontFamily={currentFonts.pronoun}
                fontSize={18}
                color={"#232D3F"}
                h={50}
                w={100}
              >
                {pronounLabel &&
                  pronounLabel
                    .replace("feminine", "")
                    .replace("masculine", "")
                    .replace("indefinite", "")
                    .replace("  ", " ")}
              </Center>

              <Center
                w={50}
                h={50}
                borderRadius={"50%"}
                bg={
                  pronounLabel && getGenderColour(getFirstLetter(pronounLabel))
                }
                color="white"
                fontWeight="bold"
                letterSpacing="wide"
                fontSize={25}
              >
                {pronounLabel && getFirstLetter(pronounLabel)}
              </Center>
            </Flex>
            <Center rowSpan={1} colSpan={1}>
              <Text
                m={3}
                fontFamily={currentFonts.pronoun}
                fontSize={18}
                color={"#232D3F"}
                h={50}
              >
                {verb} {tense}
              </Text>
            </Center>

            <GridItem rowSpan={1} colSpan={1} mt={2}>
              <ConjugationContainer conjugation={pronoun} />
            </GridItem>

            <GridItem rowSpan={1} colSpan={1} mt={2}>
              <ConjugationContainer conjugation={englishVerbConjugation} />
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(1, 1fr)">
            <GridItem rowSpan={1} colSpan={1} mb={0}>
              <Input
                ref={finalRef}
                color={"#232D3F"}
                fontSize={20}
                m={5}
                mt={2}
                mb={0}
                p={8}
                maxW={350}
                value={conjugationValue}
                onChange={(event) => setConjugationValue(event.target.value)}
              />
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(1, 1fr)">
            <Center rowSpan={1} colSpan={1}>
              <Button
                colorScheme="brand"
                variant="solid"
                m={8}
                w={320}
                h={100}
                fontSize={50}
                onClick={() => checkConjugation()}
              >
                ?
              </Button>
            </Center>
          </Grid>

          <VerbDrillsModal
            isOpen={isOpen}
            onClose={onClose}
            yourAnswer={conjugationValue}
            answer={allowForVowels()}
            reveal={reveal}
            revealAnswer={revealAnswer}
            finalFocusRef={finalRef}
          />
        </Flex>
        <SlideFade in={!isNavBarOpen} offsetY="400px" w={393} h={400}>
          <Flex direction={"column"} align={"center"} w={393} h={400}>
            <Text
              color={"#232D3F"}
              fontSize={30}
              fontFamily={"monospace"}
              mb={3}
            >
              streak
            </Text>
            <Center
              bg={"teal"}
              mt={3}
              h={160}
              w={160}
              borderRadius={"50%"}
              color={"white"}
              fontSize={70}
              fontWeight={"bold"}
            >
              <Text mb={3}>{consecutiveCorrect}</Text>
            </Center>
          </Flex>
        </SlideFade>
      </div>
    </ChakraProvider>
  );
}
