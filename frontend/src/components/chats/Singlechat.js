import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import Lottie from "react-lottie";
import animationData from "../../animation/typing.json";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdategroupModel from "../miscellaneous/UpdategroupModel";
import axios from "axios";
import "../messages.css";
import ScrollableMessages from "../miscellaneous/ScrollableMessages";
import io from "socket.io-client";

//process.env.REACT_APP_BASE_URL
var socket, selectedChatBackup;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Singlechat = ({ fetchDataGlobalChat }) => {
  const {
    user,
    selectedChat,
    setSelecetedChat,
    notification,
    setNotification,
  } = ChatState();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  useEffect(() => {
    socket = io("https://app-for-hd.herokuapp.com/");
    // socket.emit("connection");
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("start typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchData();
    selectedChatBackup = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("got message", (newMessageFromSocket) => {
      if (
        !selectedChatBackup ||
        selectedChatBackup._id !== newMessageFromSocket.chat._id
      ) {
        let flag = true;
        notification.forEach((notify) => {
          if (notify.chat._id === newMessageFromSocket.chat._id) flag = false;
        });
        if (flag) {
          setNotification([newMessageFromSocket, ...notification]);
        }
      } else {
        setMessage([...message, newMessageFromSocket]);
      }
    });
  });

  const getSenderInfo = (Selecteduser) => {
    return Selecteduser.users._id === user._id
      ? Selecteduser.users[1]
      : Selecteduser.users[0];
  };
  const fetchData = async () => {
    if (!selectedChat) return;

    setLoading(true);

    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}api/messages/${selectedChat._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setMessage(data);
    setLoading(false);
    socket.emit("join chat", selectedChat._id);
  };

  const handlechanging = (typyingMessage) => {
    setNewMessage(typyingMessage);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);

      socket.emit("start typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff > timerLength && typing) {
        setTyping(false);
        setIsTyping(false);
        socket.emit("stop typing", selectedChat._id);
        socket.emit("stop typing", selectedChat._id);
      }
    }, timerLength);
  };

  const sendMessage = async (event) => {
    if (!(event.key === "Enter")) return;
    if (!newMessage) return;
    socket.emit("stop typing", selectedChat._id);

    try {
      const newData = {
        chat_id: selectedChat._id,
        content: newMessage,
      };

      setNewMessage("");
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/messages`,
        newData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      socket.emit("new message", data);
      setMessage([...message, data]);
      fetchDataGlobalChat();
    } catch (error) {
      toast({
        title: "Error ",
        description: "somthing went Wrong",
        status: "error",
        position: "top-left",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width={"100%"}
            fontFamily={"work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelecetedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Text>{getSenderInfo(selectedChat).name.toUpperCase()}</Text>
                <ProfileModal user={getSenderInfo(selectedChat)} />
              </>
            ) : (
              <>
                <Text>{selectedChat.chatName}</Text>
                <UpdategroupModel />
              </>
            )}
          </Box>
          <Box
            display={"flex"}
            width={"100%"}
            height={"100%"}
            flexDir={"column"}
            p={3}
            backgroundColor={"#E8E8E8"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <>
                <Spinner
                  width={"40px"}
                  height={"40px"}
                  margin={"auto"}
                  alignSelf={"center"}
                />
              </>
            ) : (
              <>
                <div className={"messages"}>
                  <ScrollableMessages messages={message} />
                  <div
                    style={{
                      marginBottom: "0",
                      marginLeft: "0",
                    }}
                  >
                    {isTyping ? (
                      <div>
                        <Lottie
                          options={defaultOptions}
                          marginBottom={0}
                          marginLeft={0}
                          height={60}
                          width={50}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </>
            )}
          </Box>
          <Box width={"100%"}>
            <FormControl onKeyDown={(e) => sendMessage(e)} mt={3} isRequired>
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder={"Enter Message ..."}
                onChange={(e) => handlechanging(e.target.value)}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          <Box display={"flex"} height={"100%"}>
            <Text fontFamily={"work sans"} fontSize={"30px"}>
              Please Select Chat to Display
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default Singlechat;
