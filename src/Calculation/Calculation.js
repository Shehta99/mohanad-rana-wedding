import React, { useState } from 'react';
import { Box, Badge, Select, Button, Stack, Text, useToast } from '@chakra-ui/react';

const Calculation = () => {
  const [selectedArea, setSelectedArea] = useState('');
  const toast = useToast();

  // Handle area selection change
  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  // Function to generate Excel sheet (dummy implementation)
  const generateExcel = () => {
    if (!selectedArea) {
      toast({
        title: "Select an Area",
        description: "Please select an area to generate the Excel sheet.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Implement your Excel generation logic here
    toast({
      title: "Excel Sheet Generated",
      description: `The Excel sheet for ${selectedArea} has been generated.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Example logic for generating Excel sheet could go here
    console.log(`Generating Excel sheet for ${selectedArea}...`);
  };

  return (
    <Box
      p={4}
      bg="white"
      boxShadow="md"
      borderRadius="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Badge colorScheme="purple" fontSize="lg" mb={4}>
        Calculation
      </Badge>
      <Text fontSize="lg" mb={2}>Select an Area:</Text>
      <Select
        placeholder="Select Area"
        variant="outline"
        borderColor="blue.400"
        focusBorderColor="blue.600"
        onChange={handleAreaChange}
        mb={4}
      >
        <option value="Area 2">Area 2</option>
        <option value="Area 3">Area 3</option>
        <option value="Area 5">Area 5</option>
        <option value="Area 9">Area 9</option>
      </Select>
      <Button
        colorScheme="blue"
        onClick={generateExcel}
      >
        Generate Excel Sheet
      </Button>
    </Box>
  );
};

export default Calculation;
