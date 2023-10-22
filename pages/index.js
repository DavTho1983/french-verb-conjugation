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
  const pronounsDeDupedNoGender = [
    ...new Set(
      Object.keys(pronouns["english"]).map((pronoun) => {
        return pronoun
          .replace("feminine", "")
          .replace("masculine", "")
          .replace("indefinite", "")
          .replace("  ", " ")
          .trim();
      })
    ),
  ];
  const pronounsDeDuped = [
    ...new Set(
      Object.keys(pronouns["english"]).map((pronoun) => {
        return pronoun;
      })
    ),
  ];
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

  // NAVBAR MENU NEW STATE
  const [gender, setGender] = useState();
  const [pronoun, setPronoun] = useState();
  const [frenchVerbs, setFrenchVerbs] = useState(
    Object.keys(frenchConjugation)
  );
  const [currentVerbs, setCurrentVerbs] = useState(
    Object.keys(frenchConjugation)
  );
  const [currentTenses, setCurrentTenses] = useState(tenses);
  const [currentPronouns, setCurrentPronouns] = useState(
    pronounsDeDupedNoGender
  );
  const prevVerbs = usePrevious(currentVerbs);
  const prevTenses = usePrevious(currentTenses);
  const prevPronouns = usePrevious(currentPronouns);

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

  const checkDataComplete = () => {
    if (currentVerbs.length === 0) {
      setCurrentVerbs(["aller"]);
      toast({
        title: "No verbs!",
        position: "top",
        description: "Please select a verb",
        status: "error",
        duration: 1000,
        isClosable: true,
        variant: "error",
      });
      return false;
    }
    if (currentTenses.length === 0) {
      setCurrentTenses(["present"]);
      toast({
        title: "No tenses!",
        position: "top",
        description: "Please select a tense",
        status: "error",
        duration: 1000,
        isClosable: true,
        variant: "error",
      });
      return false;
    }
    if (currentPronouns.length === 0) {
      setCurrentPronouns(["first person singular"]);
      toast({
        title: "No pronouns!",
        position: "top",
        description: "Please select a pronoun",
        status: "error",
        duration: 1000,
        isClosable: true,
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const refresh = () => {
    if (checkDataComplete() === true) {
      const randomPronoun = randomArrayItem(currentPronouns);
      let randomGender;
      if (randomPronoun === "third person singular") {
        randomGender = randomArrayItem(indefiniteGenders);
      } else {
        randomGender = randomArrayItem(genders);
      }
      const randomVerb = randomArrayItem(currentVerbs);
      const _tense = randomArrayItem(currentTenses);
      setGender(randomGender);
      setPronoun(randomPronoun);
      setFrenchPronoun(pronouns["french"][randomPronoun + " " + randomGender]);
      setPronounLabel(randomPronoun);
      const englishVerbTense = removeGender("english", randomPronoun);
      const frenchVerbTense = removeGender("french", randomPronoun);
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

  const genders = ["masculine", "feminine"];
  const indefiniteGenders = ["masculine", "feminine"];

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
      case "pronoun": {
        const _pronoun = pronounsDeDupedNoGender[index];
        if (checked !== false) {
          let _newcurrentPronouns = currentPronouns;
          _newcurrentPronouns.push(_pronoun);
          setCurrentPronouns([..._newcurrentPronouns]);
        } else {
          const _newcurrentPronouns = currentPronouns.filter(function (p) {
            return p !== _pronoun;
          });
          setCurrentPronouns(_newcurrentPronouns);
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
    if (
      !pronoun ||
      prevVerbs !== currentVerbs ||
      prevTenses !== currentTenses ||
      prevPronouns !== currentPronouns
    ) {
      refresh();
    }
  }, [
    gender,
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
    currentPronouns,
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
                currentPronouns={currentPronouns}
                pronouns={pronounsDeDupedNoGender}
              />
            )}
          </Box>
          <Grid templateColumns="repeat(2, 1fr)" m={2} mb={0}>
            <Flex direction={"row"}>
              <Center
                m={3}
                fontFamily={currentFonts.pronoun}
                color={"#232D3F"}
                h={50}
                w={100}
              >
                {pronounLabel}
              </Center>

              <Center
                w={50}
                h={50}
                borderRadius={"50%"}
                bg={gender && getGenderColour(getFirstLetter(gender))}
                color="white"
                fontWeight="bold"
                letterSpacing="wide"
                fontSize={25}
              >
                {gender && getFirstLetter(gender)}
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
              <ConjugationContainer
                conjugation={pronouns["english"][pronoun + " " + gender]}
              />
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
          <Flex direction={"column"} align={"center"} w={393}>
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
