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
  SlideFade,
  Stack,
} from "@chakra-ui/react";

import styles from "./navBar.module.css";

// Component imports

function NavBar({ isNavBarOpen }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [item1Open, setItem1Open] = useState(false);
  const [item2Open, setItem2Open] = useState(false);
  const [item3Open, setItem3Open] = useState(false);
  useEffect(() => {
    if (optionsOpen && !isNavBarOpen) {
      setOptionsOpen(false);
    }
  }, [optionsOpen]);

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
        onClick={() => setOptionsOpen(true)}
      >
        options
      </Box>
      {optionsOpen && (
        <Stack spacing={8}>
          {" "}
          <Box
            w={393}
            h={20}
            border={!item1Open ? "5px solid white" : "none"}
            bg="teal.500"
            onMouseEnter={() => setItem1Open(true)}
            onMouseLeave={() => setItem1Open(false)}
          >
            1
          </Box>
          <Box
            w={393}
            h={20}
            border={!item2Open ? "5px solid white" : "none"}
            bg="#B794F4"
            onMouseEnter={() => setItem2Open(true)}
            onMouseLeave={() => setItem2Open(false)}
          >
            2
          </Box>
          <Box
            w={393}
            h={20}
            border={!item3Open ? "5px solid white" : "none"}
            bg="teal.500"
            onMouseEnter={() => setItem3Open(true)}
            onMouseLeave={() => setItem3Open(false)}
          >
            3
          </Box>
        </Stack>
      )}
    </SlideFade>
  );
}

export default NavBar;
