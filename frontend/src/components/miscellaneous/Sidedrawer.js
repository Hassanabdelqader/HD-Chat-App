import {
  Box,
  Button,
  Menu,
  MenuButton,
  Text,
  Tooltip,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { EmailIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import Chatloading from "./Chatloading";
import axios from "axios";
import Listuser from "../chats/Listuser";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

function Sidedrawer({ fetchDataGlobalChat }) {
  const {
    user,
    selectedChat,
    setSelecetedChat,
    chat,
    setChat,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [loadingChat, setloadingchat] = useState();

  const handlesignout = () => {
    setSelecetedChat("");
    localStorage.removeItem("info");
    history.push("/");
  };

  const handleSearch = async () => {
    setisLoading(true);
    if (!search) {
      toast({
        title: "Search",
        description: "Please Enter the Search Query ",
        status: "warning",
        position: "top-left",
        duration: 4000,
        isClosable: true,
      });
      setisLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(
        `/api/user/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (data.users.length === 0) {
        toast({
          title: "Not Found ",
          description: "we did not find user",
          status: "warning",
          position: "top-left",
          duration: 4000,
          isClosable: true,
        });
        setisLoading(false);
      } else {
        setisLoading(false);
        setsearchResult(data.users);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Search not Completed",
        status: "error",
        position: "top-left",
        duration: 3000,
        isClosable: true,
      });
      setisLoading(false);
      return;
    }
  };

  const handleChat = async (user_id) => {
    setloadingchat(true);
    try {
      const formData = {
        user_id,
      };

      const { data } = await axios.post(
        `/api/chat/Createchat`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!chat.find((c) => c._id === data._id)) {
        setChat([...chat, data]);
      }

      setloadingchat(false);
      setSelecetedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went Wrong",
        status: "error",
        position: "top-left",
        duration: 3000,
        isClosable: true,
      });
      setisLoading(false);
      return;
    }
  };

  return (
    <>
      <Box
        display="flex"
        w="100%"
        bg="white"
        color="black"
        p={2}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Tooltip label="Search User" aria-label="A tooltip" hasArrow>
          <Button colorScheme="blue" variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text m={1} p={2} d={{ base: "none", md: "flex" }}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} color={"black"}>
          HD
        </Text>
        <div>
          <Menu>
            <MenuButton p={2}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <EmailIcon w={6} h={6}></EmailIcon>
            </MenuButton>
            <MenuList>
              {notification.length === 0 && "no new Messages"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelecetedChat(notify.chat);
                    fetchDataGlobalChat();
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `new Messaage in ${notify.chat.chatName} `
                    : `new Message from ${notify.sender.name}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="xs" name={`${user.name}`} src={`${user.avatar}`} />
              {`${user.name}`}
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>my profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handlesignout}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <div>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Search Chat</DrawerHeader>
            <DrawerBody>
              <Box display={"flex"} pb={2}>
                <Input
                  mr={2}
                  placeholder="Search ... "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch} isLoading={isLoading}>
                  Search
                </Button>
              </Box>
              {isLoading ? (
                <Chatloading />
              ) : (
                searchResult &&
                searchResult.map((user) => (
                  <Listuser
                    key={user._id}
                    user={user}
                    handleFunction={() => handleChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

export default Sidedrawer;
