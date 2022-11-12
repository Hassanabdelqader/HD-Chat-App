import { Avatar, Box, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/chatProvider";
import {
  getMargin,
  isLastMessage,
  isSameSender,
} from "../miscellaneous/getUserInfo";
import "../messages.css";

const ScrollableMessages = ({ messages }) => {
  const { user } = ChatState();
    return (
      <>
        {!messages.length && (
                <Box display={"flex"} height={"100%"}
                justifyContent={"center"}
                >
                    <Text fontFamily={"work sans"} fontSize={"20px"}
                    >
                        Send a message to start Conversation

                    </Text>
          </Box>
        )}
        <ScrollableFeed>
          {messages &&
            messages.map((message, index) => (
              <div
                key={message._id}
                style={{ display: "flex", padding: "8px" }}
              >
                {(isSameSender(messages, message, index, user._id) ||
                  isLastMessage(messages, index, user._id)) && (
                  <>
                    <Tooltip
                      label={message.sender.name}
                      placement={"bottom-start"}
                      hasArrow
                    >
                      <Avatar
                        className="avatar"
                        mr={1}
                        mt={"7px"}
                        size={"sm"}
                        cursor={"pointer"}
                        name={message.sender.name}
                        src={message.sender.avatar}
                      />
                    </Tooltip>
                  </>
                )}
                {message.sender._id === user._id ? (
                  <>
                    <span
                      style={{
                        backgroundColor: `${
                          user._id === message.sender._id
                            ? "#BEE3F8"
                            : "#B9F5D0"
                        }`,
                        borderRadius: "20px",
                        padding: "7px 15px",
                        maxWidth: "75%",
                        marginBottom: "4px",
                        marginLeft: getMargin(
                          messages,
                          message,
                          index,
                          user._id
                        ),
                      }}
                    >
                      {message.content}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        backgroundColor: `${
                          user._id === message.sender._id
                            ? "#BEE3F8"
                            : "#B9F5D0"
                        }`,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                        marginBottom: "4px",
                        marginLeft: getMargin(
                          messages,
                          message,
                          index,
                          user._id
                        ),
                      }}
                    >
                      <span
                        style={{
                          color: "#808080",
                          fontSize: "9px",
                          marginTop: "1px",
                        }}
                      >
                        ~{message.sender.name}
                      </span>
                      <br></br>

                      {message.content}
                    </span>
                  </>
                )}
              </div>
            ))}
        </ScrollableFeed>
      </>
    );
};

export default ScrollableMessages;
