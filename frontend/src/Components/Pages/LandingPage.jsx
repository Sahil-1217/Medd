import React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Image,
  Text,
  Center,
  HStack,
} from "@chakra-ui/react";
import FloatingPhone from "../UI/FloatingPhone";
import Example from "../UI/FloatingPhone";
import logo from "../UI/Images/Meddstack1.PNG";
import { BouncyCardsFeatures } from "../UI/BouncyCardsFeatures";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Grid
        templateColumns="repeat(3, 1fr)"
        position={"fixed"}
        zIndex={100}
        height={100}
        roundedBottom={15}
        bg={"white"}
        style={{
          backdropFilter: "blur(7px)",
        }}
      >
        <GridItem w="100%" />

        <GridItem
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box m={0.5}>
            {" "}
            <Image src={logo} alt="PillStack Logo" />{" "}
          </Box>
        </GridItem>

        <GridItem
          w="100%"
          as={Flex}
          justifyContent="flex-end"
          alignItems={"center"}
        >
          <HStack spacing={5} mx={5}>
            <Button colorScheme="teal" onClick={() => navigate("/login")}>
              Login
            </Button>

            <Button
              bg={"#1a202c11"}
              border={"1px solid #1a202c"}
              colorScheme="teal"
              variant={"outline"}
              onClick={() => navigate("/patient-register")}
            >
              Sign Up
            </Button>

            {/* 🔹 Admin Panel Button */}
            {/* {
              <Button
                colorScheme="red"
                onClick={() => navigate("/administration")}
              >
                Admin Panel
              </Button>
            } */}
          </HStack>
        </GridItem>
      </Grid>

      <Box className="teal-blue" pt={100}>
        {/* Hero Section */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          p={10}
          gap={8}
        >
          {/* Left Content */}
          <Box flex="1" textAlign={{ base: "center", md: "left" }}>
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              color="white"
              fontWeight="bold"
            >
              Empowering Your Health Journey, One Click Away!
            </Text>
            <Text fontSize={{ base: "lg", md: "2xl" }} color="white" mt={3}>
              Your Trusted Online Clinic & Pharmacy for Convenient Care &
              Medication Solutions.
            </Text>
          </Box>

          {/* Right Image */}
          <Box flex="1" display="flex" justifyContent="center">
            <FloatingPhone />
          </Box>
        </Flex>
      </Box>

      {/* <Box className='shapeDivider' h={200} />
    <BouncyCardsFeatures /> */}
    </>
  );
}

export default LandingPage;
