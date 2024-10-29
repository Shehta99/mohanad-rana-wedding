import React,{ useState } from 'react';
import { Box, ButtonGroup, Select, Stack, Text } from '@chakra-ui/react';
import NonMetalForm from './NonMetalForm';
import MetalSectionForm from './MetalForm';
import MagnetWireForm from './MagnetWireForm';

const StockTake = () => {
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedType, setSelectedType] = useState('');

    // Handle area selection change
    const handleAreaChange = (e) => {
        setSelectedArea(e.target.value);
    };

    // Handle type selection change
    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };
  return (
    <>
    
    <Box padding="6" textAlign="center" boxShadow="md" borderRadius="lg" bg="white">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Select Areas and Types
        </Text>
        <Stack spacing={4}>
            <ButtonGroup spacing={4}>
                <Select
                    placeholder="Select Area"
                    variant="outline"
                    size="lg"
                    borderColor="blue.400" // Set the border color
                    focusBorderColor="blue.600" // Set the border color on focus
                    onChange={handleAreaChange}
                    
                >
                    <option value="Area 1">Area 1</option>
                    <option value="Area 2">Area 2</option>
                    <option value="Area 3">Area 3</option>
                    <option value="Area 4">Area 4</option>
                    <option value="Area 5">Area 5</option>
                    <option value="Area 6">Area 6</option>
                    <option value="Area 7">Area 7</option>
                    <option value="Area 9">Area 9</option>
                </Select>
                <Select
                    placeholder="Select SC Type"
                    variant="outline"
                    size="lg"
                    borderColor="blue.400" // Set the border color
                    focusBorderColor="blue.600" // Set the border color on focus
                    onChange={handleTypeChange}
                >
                    <option value="SC-Metal">SC-Metal</option>
                    <option value="SC-Non Metal">SC-Non Metal</option>
                    <option value="Magnet Wire">Magnet Wire</option>
                </Select>
            </ButtonGroup>
        </Stack>
    </Box>
    <br/>
    {selectedType==="SC-Non Metal"&&<NonMetalForm/>}
    {selectedType==="SC-Metal"&&<MetalSectionForm/>}
    {selectedType==="Magnet Wire"&&<MagnetWireForm/>}
    </>
  );
};

export default StockTake;
