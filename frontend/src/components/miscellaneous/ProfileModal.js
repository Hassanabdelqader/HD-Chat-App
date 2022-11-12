import React from 'react'
import { useHistory } from 'react-router-dom';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({user,children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={"40px"}
        >
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              boxSize="150px"
              objectFit="cover"
              src={`${user.avatar}`}
              alt={`${user.avatar}`}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal