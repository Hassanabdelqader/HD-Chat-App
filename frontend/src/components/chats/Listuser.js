import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const Listuser = ({ user, handleFunction }) => {
  return (
    <Box
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      display={"flex"}
      width={"100%"}
      alignItems={"center"}
      color={"black"}
      px={3}
      py={2}
      mb={2}
      onClick={handleFunction}
      borderRadius={"lg"}
    >
      <Avatar
        size="sm"
        mr={2}
        cursor={"pointer"}
        name={user.name}
        src={user.avatar}
      />
      <Box mr={1}>
        <Text>{user.name}</Text>
        <Text fontSize={"xs"}>Email: {user.email}</Text>
      </Box>
    </Box>
  );
};

export default Listuser