import React from 'react';
import { Box, Heading, Text, VStack, Image } from '@chakra-ui/react';
import inventoryImage from './assets/esc2.webp'; // Replace with your image path

const InventoryHome = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh" // Ensure it covers the full height
      backgroundColor="#f9f9f9"
      padding="20px"
      textAlign="center"  // Center-align all text elements
    >
      <VStack spacing={2} align="center" maxW="lg">  {/* Limit content width for better readability */}
        {/* Restyled image */}
        <Image
          src={inventoryImage}  // Path to the image file
          alt="Inventory Illustration"  // Alt text for accessibility
          boxSize={{ base: "250px", md: "400px" }}  // Larger image for medium screens
          borderRadius="20px"  // Rounded corners
          boxShadow="lg"  // Add shadow
          border="2px solid #ddd"  // Subtle border
          objectFit="cover"  // Cover without distortion
        />

        <Heading as="h5" size="xl" fontWeight="bold" color="purple.700">
          ESC Inventory Management System
        </Heading>
        <Text fontSize="md" color="gray.500" mt={2}>
          Created by ESC Software Team
        </Text>

        <Text fontSize="lg" color="gray.600">
          Manage your inventory with ease. Navigate to the sections below to get started.
        </Text>

    
       
      </VStack>
    </Box>
  );
};

export default InventoryHome;
