import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge, Box,IconButton, Popover, PopoverContent, PopoverTrigger, VStack } from '@chakra-ui/react';
import { BellIcon, CloseIcon ,WarningIcon } from '@chakra-ui/icons'; 
import { Text,Flex } from '@chakra-ui/react';

const Notifications = ({ notifications }) => {
  const [currentNotifications, setCurrentNotifications] = useState(notifications);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  useEffect(() => {
    setCurrentNotifications(notifications);

  }, [notifications]);
  const deleteNotification = async (notificationD) => {
    const updatedNotifications = currentNotifications.filter(
      (notification) => notification !== notificationD
    );
    if (updatedNotifications.length === 0) {
      setIsPopoverOpen(false);
    }
    setCurrentNotifications(updatedNotifications);
    const response = await axios.post('https://medd-9.onrender.com/deleteNotif', {notif:notificationD}, {
        withCredentials: true,
      });
      
  };

  console.log(notifications); // Check what the notifications prop contains

  return (
    <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
      <PopoverTrigger>
        <IconButton
          aria-label="Notifications"
          icon={<BellIcon />}
          variant="ghost"
          colorScheme="gray"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)} // Toggle popover on icon click

        />
      </PopoverTrigger>
      <PopoverContent
        width="300px"
      >
        <Box padding="1rem">
          <VStack align="stretch" spacing={2}>
            {currentNotifications &&
              currentNotifications.map((notification) => (
                <Flex
                  key={notification}
                  align="center"
                  justify="space-between"
                  maxWidth="250px"
                  fontSize="sm"
                  wordBreak="break-word"
                >
                  <Text flex="1">{notification}</Text>
                  <IconButton
                    aria-label="Delete Notification"
                    icon={<CloseIcon />}
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                    onClick={() => deleteNotification(notification)}
                  />
                </Flex>
              ))}
          </VStack>
        </Box>
      </PopoverContent>
    </Popover>
  );
};
export default Notifications;
