import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
import React, { useState } from "react";
import { AddIcon, DeleteIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import Listuser from "../chats/Listuser";

const GroupModal = ({ children }) => {
  const { user, selectedChat, setSelecetedChat, chat, setChat } = ChatState();
  const COLORS = [
    "#3B3486",
    "#EB6440",
    "#E14D2A",
    "#001253",
    "#393E46",
    "#557153",
  ];
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [searchResult, setsearchResult] = useState([]);

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

  const handlesubmit = async () => {
    if (!groupName || !selectedUsers || selectedUsers.length < 3) {
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
      const items = JSON.stringify(selectedUsers.map((item) => item._id));

      const formData = {
        name: groupName,
        users: items,
      };

      const { data } = await axios.post(
        `/api/chat/creategroup`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setChat([data, ...chat]);
      onClose();
    } catch (error) {
      toast({
        title: `Error`,
        description: `somthing went wrong`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
  };

  const handleremove = (user) => {
    const items = selectedUsers.filter((item) => item._id !== user._id);
    setSelectedUsers(items);
  };

  const handleGroup = (user) => {
    if (!user) return;
    for (let index = 0; index < selectedUsers.length; index++) {
      if (selectedUsers[index]._id === user._id) {
        toast({
          title: `${user.name} Added`,
          description: `${user.name} is already added`,
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top-center",
        });
        return;
      }
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  return (
    <>
      <Button
        onClick={onOpen}
        display={"flex"}
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        backgroundColor={"#54B435"}
        color={"white"}
        _hover={{
          backgroundColor: "#379237",
        }}
      >
        Add New Group
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Enter Group Name</FormLabel>
              <Input
                placeholder="Group name"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} mb={2}>
              <FormLabel>Add User</FormLabel>
              <Input placeholder="add user" onChange={handlesearch} />
            </FormControl>
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
                  onClick={() => handleremove(user)}
                  width={"auto"}
                >
                  <h1>{user.name}</h1>
                  <DeleteIcon />
                </Box>
              ))}
            </Box>

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <Listuser
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              backgroundColor={"#54B435"}
              color={"white"}
              _hover={{
                backgroundColor: "#379237",
              }}
              onClick={() => handlesubmit()}
            >
              Create New Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
