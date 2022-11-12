import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import Listuser from "../chats/Listuser";

const UpdategroupModel = () => {
  const { user, selectedChat, setSelecetedChat, fetchData, chat, setChat } =
    ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(
      selectedChat.users.filter((valueUser) => valueUser._id !== user._id)
    );
  const [renameloading, setRenameLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const COLORS = [
    "#3B3486",
    "#EB6440",
    "#E14D2A",
    "#001253",
    "#393E46",
    "#557153",
  ];

  const renameGroup = async () => {
    setRenameLoading(true);
    if (!groupChatName) {
      toast({
        title: `Please Fill Data`,
        description: `some filed are Empty and add more than 3 users`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      const formData = {
        name: groupChatName,
        chat_id: selectedChat._id,
      };

      const { data } = await axios.put(
        `/api/chat/renamegroup`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSelecetedChat(data);
      fetchData();
      setRenameLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: `Error`,
        description: `somthing went wrong`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setRenameLoading(false);
      return;
    }
  };
  const addUser = async (localUser) => {
    if (selectedChat.users.find((item) => item._id === localUser._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const formData = {
      user_id: localUser._id,
      chat_id: selectedChat._id,
    };

    const { data } = await axios.post(
      `/api/chat/addtogroup`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setSelecetedChat(data);
    setSelectedUsers([...selectedUsers, localUser]);
  };
    
    const removeUser = async (localUser) => {
      if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admins can Remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      const formData = {
        user_id: localUser._id,
        chat_id: selectedChat._id,
      };

      const { data } = await axios.put(
          `$/api/chat/removefromgroup`,
          formData,
          {
              headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            }
            );
      fetchData();
     setSelecetedChat(data); 
      setSelectedUsers(data.users.filter((valueUser) => valueUser._id !== user._id));
    };

  const handlesearch = async (query) => {
    if (!query.target.value) return;
    setLoading(true);
    setSearch(query.target.value);
    try {
      const { data } = await axios.get(
        `/api/user/users?search=${query.target.value}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setsearchResult(data.users);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <IconButton icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box display={"flex"} pl={2}>
              {selectedUsers.map((user) => (
                <Box
                  display={"flex"}
                  key={user._id}
                  mr={1}
                  px={2}
                  py={2}
                  borderRadius={"lg"}
                  cursor={"pointer"}
                  backgroundColor={COLORS[Math.floor(Math.random() * 5)]}
                  fontSize={12}
                  color={"white"}
                  onClick={() => removeUser(user)}
                  width={"auto"}
                >
                  <h1>{user.name}</h1>
                  <DeleteIcon />
                </Box>
              ))}
            </Box>
            <FormControl>
              <FormLabel>Enter Group Name</FormLabel>
              <Box display={"flex"}>
                <Input
                  placeholder="Group Name ..."
                  mr={1}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  colorScheme="green"
                  mr={3}
                  isLoading={renameloading}
                  onClick={() => renameGroup()}
                >
                  Update
                </Button>
              </Box>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Add User</FormLabel>
              <Input
                placeholder="Add User like : hassan"
                mb={2}
                onChange={(e) => handlesearch(e)}
              />
            </FormControl>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 3)
                .map((user) => (
                  <Listuser
                    key={user._id}
                    user={user}
                    handleFunction={() => addUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} backgroundColor={"green"} color={"white"}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdategroupModel;
