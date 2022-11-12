import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const toast = useToast();
    const history = useHistory();
    const [user, setUser] = useState();
    const [chat, setChat] = useState([]);
    const [notification, setNotification] = useState([]);
    const [selectedChat, setSelecetedChat] = useState();
    
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/chat/getallChat`,
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


    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("info"))
        if (!userInfo) {
            
        history.push("/")
      
        }
        setUser(userInfo)
    }, [history])
    
    return (
      <ChatContext.Provider
        value={{ user, setUser, notification, setNotification, chat,fetchData, setChat, selectedChat, setSelecetedChat }}
      >
        {children}
      </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;