import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  VStack,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
   const toast = useToast();
   const history = useHistory();
   const [isLoading, setIsloading] = useState(false);

  
  const handleSubmit = async () => {
    setIsloading(true);
    if (!email || !password) {
      toast({
        title: "Error ",
        description: "please fill all data ",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false);
      return;
    }
    try {
       const config = {
         headers: {
           Accept: "application/json",
           "Content-Type": "application/json;charset=UTF-8",
         },
       };
       const formData = {
         email,
         password,
       };

       const { data } = await axios.post(
         `/api/user/login`,
         formData,
         {
           config,
         }
       );
      if (data) {
        toast({
          title: "Succfully ",
          description: "Login succsfully ",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setIsloading(false);
        localStorage.setItem("info", JSON.stringify(data));
        window.location.reload(false);
        // history.push("/chats");
      }
    } catch (error) {
      toast({
        title: "Wrong",
        description: "There is no user or the password is incorrect ",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false);
    }

  }

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={2}
      align="stretch"
    >
      <FormControl isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          type="email"
          placeholder={"Enter Your Email "}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Passsword </FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        // colorScheme="green"
        // variant="solid"
        size={"100%"}
        // bg="brand.900"

        // variants={{ base: "base", md: "md" }}
        // variant={["base", "sm", "md"]}
        p={"2"}
        isLoading={isLoading}
        onClick={(e) => handleSubmit()}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
