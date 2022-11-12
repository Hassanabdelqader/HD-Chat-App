import { ChatState } from "../../context/chatProvider";


export const isSameSender = (messages, message, index, userID) => {
   return (
     index < messages.length - 1 &&
     (messages[index + 1].sender._id !== message.sender._id ||
       messages[index + 1].sender._id === undefined) &&
     messages[index].sender._id !== userID
   );
}

export const isLastMessage = (messages, index , userID) => {
    return (
      index === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userID &&
      messages[messages.length - 1].sender._id
    );
}

export const getMargin = (messages, message, index, userID) => {
    if (
        index < messages.length - 1 &&
        messages[index + 1].sender._id === message.sender._id &&
        messages[index].sender._id !== userID
    )
        return 33;
    else if (
        index < messages.length - 1 &&
        messages[index + 1].sender._id === message.sender._id &&
        messages[index].sender._id !== userID ||
        (index === messages.length - 1 && messages[index].sender._id !== userID)
    )
        return 0;
    
    if (messages[index].sender._id === userID)
        return "auto";
    
    
}


