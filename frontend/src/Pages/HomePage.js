import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("info"))
    if(userInfo){
      history.push("/chats")
    }
  }, [history])
  

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        // bg="white"
        // bg={["base", "sm", "md"]}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="20px"
        borderWidth="3px"
        // h="200px"
        bgGradient={[
          "linear(to-tr, teal.300, yellow.400)",
          "linear(to-t, blue.200, teal.500)",
          "linear(to-b, orange.100, purple.300)",
        ]}
      >
        <Text
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
          fontSize="6xl"
          fontWeight="extrabold"
        >
          HD Chat{" "}
        </Text>
      </Box>

      <Box
        bg="white"
        w="100%"
        borderRadius="2xl"
        borderWidth="4px"
        color="black"
      >
        <Tabs variant="soft-rounded" colorScheme="green" m={"4px"}>
          <TabList>
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
