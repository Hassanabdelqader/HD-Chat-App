import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';
import Chatloading from '../miscellaneous/Chatloading';
import GroupModal from '../miscellaneous/GroupModal';


const MyChats = () => {
  const { user, selectedChat,setUser, setSelecetedChat, chat, setChat } = ChatState();
  const toast = useToast();
  const [loggedUser, setloggedUser] = useState();

    useEffect(() => {
      setUser(JSON.parse(localStorage.getItem("info")));
      setloggedUser(JSON.parse(localStorage.getItem("info")));
      fetchData();
      fetchData();
    }, []);
  
  const getNameofSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name 
  }
  const getNameofAvatar = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].avatar : users[0].avatar; 
  
}
  const fetchData = async () => {
    console.log(loggedUser)
      try {
         const { data } = await axios.get(
           `/api/chat/getallChat`,
           {
             headers: {
               Authorization: `Bearer ${
                 JSON.parse(localStorage.getItem("info")).token
               }`,
             },
           }
         );
        setChat(data.with)
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

  } 


  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={3}
      m={3}
      bg="white"
      w={{ base: "100%", md: "40%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        color={"black"}
        fontSize={{ base: "30px", md: "35px" }}
        fontFamily="Work sans"
        display="flex"
        justifyContent="space-between"
        w="100%"
      >
        <Text>My Chat</Text>
        <GroupModal>
          <Button></Button>
        </GroupModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chat?.length ? (
          <Stack overflowY="scroll">
            {chat.map((localchat) => (
              <Box
                display={"flex"}
                onClick={() => setSelecetedChat(localchat)}
                cursor={"pointer"}
                bg={selectedChat === localchat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === localchat ? "#white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={localchat._id}
              >
                <Avatar
                  size="sm"
                  src={
                    !localchat.isGroupChat
                      ? getNameofAvatar(loggedUser, localchat.users)
                      : `https://p.kindpng.com/picc/s/361-3613116_business-process-outsourcing-icon-clipart-png-download-users.png`
                  }
                  mr={2}
                />

                <Box>
                <Text>
                  {!localchat.isGroupChat
                    ? getNameofSender(loggedUser, localchat.users)
                    : `${localchat.chatName}`}
                </Text>
                {localchat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{localchat.latestMessage.sender.name} : </b>
                    {localchat.latestMessage.content.length > 50
                      ? localchat.latestMessage.content.substring(0, 51) + "..."
                      : localchat.latestMessage.content}
                  </Text>
                )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats