import {Box, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Chat from "../components/chats/Chat";
import MyChats from "../components/chats/MyChats";
import Sidedrawer from "../components/miscellaneous/Sidedrawer";
import { ChatState } from "../context/chatProvider";

const ChatPage = (props) => {
    const { user, selectedChat, setSelecetedChat, chat, setChat } = ChatState();
  const toast = useToast();


  const fetchDataGlobalChat = async () => {
    try {
      const { data } = await axios.get(
        `/api/chat/getallChat`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setChat(data.with);
    } catch (error) {
      toast({
        title: "Error ",
        description: "we did not find user",
        status: "error",
        position: "top-left",
        duration: 4000,
        isClosable: true,
      });
    }
  }; 



  
  return (
    <div style={{ width: "100%" }}>
      {user && (
        <Box>
          <Sidedrawer fetchDataGlobalChat={fetchDataGlobalChat} />
        </Box>
      )}
      {user && (
        <Box
          display={"flex"}
          justifyContent="space-between"
          width={"100%"}
          height={"35rem"}
          p="10px"
        >
          <MyChats fetchDataGlobalChat={fetchDataGlobalChat} />
          <Chat fetchDataGlobalChat={fetchDataGlobalChat}  />
        </Box>
      )}
    </div>
  );
};

export default ChatPage;

