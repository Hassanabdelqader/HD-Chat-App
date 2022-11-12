import React from 'react';
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from '../../context/chatProvider';
import Singlechat from './Singlechat';

const Chat = ({ fetchDataGlobalChat }) => {
  const { user, selectedChat, setSelecetedChat, chat, setChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir={"column"}
      p={4}
      m={3}
      bg={"white"}
      color={"black"}
      width={{ base: "100%", md: "70%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Singlechat fetchDataGlobalChat={fetchDataGlobalChat} />
    </Box>
  );
};

export default Chat