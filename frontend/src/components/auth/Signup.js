import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";import {
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
} from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";

const Signup = () => {
    const { setUser } = ChatState();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [confirmedPassword, setconfirmedPassword] = useState();
  const [image, setImage] = useState();
  const toast = useToast();
  const history = useHistory();
  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = async ()=>{
    setIsloading(true);

    if (!email || !password || !name || !confirmedPassword) {
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

    if (password !== confirmedPassword) {
      toast({
        title: "Error ",
        description: "PassWord does not Match  ",
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
        }
      const formData = {
        name,
        password,
        email,
       pic:image,
      };
    
      const { data } = await axios.post(
        `/api/user/signup`,
        formData,
        {
          config,
        }
      );
      localStorage.setItem("info",JSON.stringify(data))
      toast({
        title: "Succfully ",
        description: "the user created succsfully ",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false);
      setUser(data);
      window.location.reload(false);
      //  history.push("/chats");
    } catch (error) {
      if (!error.response?.status) {
        toast({
          title: "somthing went wrong",
          description: "Wrong",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setIsloading(false);
      }
      if (error.response.status === 401) {
        toast({
          title: "this email is used ",
          description: "the user created succsfully ",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        setIsloading(false);
      } else if (error.response.status === 400) {
        toast({
          title: "Please fill all data correctly",
          description: "there is no data  ",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        setIsloading(false);
      } else {
      toast({
        title: "Error ",
        description: "Error in server",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false);
      return;
      }
    }
  }

  const postimage = (img) => {
    setIsloading(true);
    if (img === undefined) {
      toast({
        title: "Error ",
        description: "please uplad an image type",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false)
      return;
    }
    if (
      img.type === "image/jpeg" ||
      img.type === "image/png" ||
      img.type === "image/jpg"
    ) {
      const forma = new FormData();
      forma.append("file", img);
      forma.append("upload_preset", "chatapp");
      forma.append("cloud_name", "derxakgnz");
      fetch("https://api.cloudinary.com/v1_1/derxakgnz/image/upload", {
        method: "post",
        body: forma,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url.toString());
          setIsloading(false);
        })
        .catch((err) => {
          toast({
            title: "Error with uplading picture ",
            description: "Server Error",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          setIsloading(false);
        });
    } else {
      toast({
        title: "Error ",
        description: "please uplad te image type",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false);
      return;
    }

  };

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={1}
      align="stretch"
    >
      <FormControl isRequired>
        <FormLabel>Name </FormLabel>
        <Input
          type="text"
          placeholder={"Enter Your Name "}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

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
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Confirm Passsword </FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setconfirmedPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>We'll never share your password.</FormHelperText>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Picture </FormLabel>
        <Input
          type="file"
          placeholder={"Enter Your Picture "}
          p={2}
          accept="/image/*"
          onChange={(e) => postimage(e.target.files[0])}
        />
      </FormControl>
      <Button
        isLoading={isLoading}
        onClick = {(e)=>handleSubmit()}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
