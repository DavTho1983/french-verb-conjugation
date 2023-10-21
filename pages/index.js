import React, { useState, useEffect } from "react";
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
  Fade,
  SlideFade,
  Slide,
  Collapse,
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

export default function Home() {
  const finalRef = React.useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [correctConfirmation, setCorrectConfirmation] = useState();
  const [reveal, setReveal] = useState(false);
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [currentFonts, setCurrentFonts] = useState({
    pronoun: "cursive",
    verb: "monospace",
    englishVerbConjugation: "sans-serif",
  });
  const [conjugationValue, setConjugationValue] = useState();
  const [pronoun, setPronoun] = useState();
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
    console.log("randomPronoun: ", randomPronoun);
    const randomVerb = randomProperty(frenchConjugation);
    const _tense = randomArrayItem(tenses);
    console.log(" random tense: ", _tense);
    setPronoun(randomPronoun.value);
    setFrenchPronoun(pronouns["french"][randomPronoun.key]);
    setPronounLabel(randomPronoun.key);
    const englishVerbTense = removeGender("english", randomPronoun.key);
    console.log("englishVerbTense: ", englishVerbTense);
    const frenchVerbTense = removeGender("french", randomPronoun.key);
    console.log("frenchVerbTense: ", frenchVerbTense);
    const englishVerbTenseWGender =
      englishConjugation[randomVerb.key][_tense][englishVerbTense];
    const frenchVerbTenseGender =
      frenchConjugation[randomVerb.key][_tense][frenchVerbTense.noGender][
        frenchVerbTense.gender
      ];
    console.log("englishVerbTenseWGender: ", englishVerbTenseWGender);
    console.log("frenchVerbTenseGender: ", frenchVerbTenseGender);
    setEnglishVerbConjugation(englishVerbTenseWGender);
    if (frenchVerbTenseGender.hasOwnProperty("singular")) {
      setFrenchVerbConjugation(frenchVerbTenseGender["singular"]);
    } else setFrenchVerbConjugation(frenchVerbTenseGender);
    setConjugationValue("");
    setTense(_tense);
    setVerb(randomVerb.key);
    chooseFont();
    finalRef.current.focus();
  };

  const vowels = ["a", "e", "i", "o", "u", "y"];

  const fonts = ["monospace", "sans-serif"];

  const chooseFont = () => {
    return setCurrentFonts({
      pronoun: randomArrayItem(fonts),
      verb: randomArrayItem(fonts),
    });
  };

  const allowForVowels = () => {
    console.log(
      "frenchPronoun: ",
      frenchPronoun,
      "frenchVerbConjugation: ",
      frenchVerbConjugation
    );
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
    console.log(
      "check: ",
      check,
      "conjugationValue",
      conjugationValue.trim().toLowerCase()
    );
    if (
      conjugationValue.trim().toLowerCase() === check ||
      conjugationValue === undefined
    ) {
      refreshVerb();
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

  useEffect(() => {
    console.log("isNavBarOpen: ", isNavBarOpen);
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
  ]);

  return (
    <ChakraProvider theme={theme}>
      <div className={styles.container}>
        <Head>
          <title>French Verb Drills App</title>
        </Head>
        <Flex direction={"column"} m={0} w={393} h={350}>
          <Box
            onMouseEnter={() => setIsNavBarOpen(true)}
            onMouseLeave={() => setIsNavBarOpen(false)}
            borderBottom="2rem solid #FFFFFF"
          >
            {isNavBarOpen && <NavBar isNavBarOpen={isNavBarOpen} />}
          </Box>
          <Grid templateColumns="repeat(2, 1fr)" m={2} mb={0}>
            <Center rowSpan={1} colSpan={1}>
              <Text
                m={3}
                fontFamily={currentFonts.pronoun}
                fontSize={18}
                color={"#232D3F"}
                h={50}
              >
                {pronounLabel}
              </Text>
            </Center>
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
          <Flex direction={"column"} align={"center"} w={393} h={400} mt={20}>
            <Text
              mt={20}
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
