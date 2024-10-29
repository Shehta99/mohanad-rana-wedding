import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Button, ButtonGroup, Select, Stack, Text,Flex } from '@chakra-ui/react';
import DataTable from './tableData';
import DataTableSpecial from './TableForSpecialAreas';

function Deloder() {
    const [selectedArea, setSelectedArea] = useState(''); // State to manage the selected area

    const handleAreaChange = (e) => {
        setSelectedArea(e.target.value); // Update the selected area
    };

    return (
        <>
            
            <Box padding="2" textAlign="center" boxShadow="md" borderRadius="lg" bg="white">
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    Select Areas and Actions
                </Text>
                <Stack spacing={4}>
                    <ButtonGroup spacing={4}>
                        <Select
                            placeholder="Select Area"
                            variant="outline"
                            size="lg"
                            borderColor="blue.400" // Set the border color
                            focusBorderColor="blue.600" // Set the border color on focus
                            onChange={handleAreaChange} // Handle area change
                        >
                            <option value="Area 1">Area 1</option>
                            <option value="Area 2">Area 2</option>
                            <option value="Area 3">Area 3</option>
                            <option value="Area 4">Area 4</option>
                            <option value="Area 5">Area 5</option>
                            <option value="Area 6">Area 6</option>
                            <option value="Area 7">Area 7</option>
                            <option value="Area 10">Area 10</option>
                        </Select>
                        <Select
                            placeholder="Select SC Type"
                            variant="outline"
                            size="lg"
                            borderColor="blue.400" // Set the border color
                            focusBorderColor="blue.600" // Set the border color on focus
                        >
                            <option value="SC-Metal">SC-Metal</option>
                            <option value="SC-Non Metal">SC-Non Metal</option>
                            <option value="Magnet Wire">Magnet Wire</option>
                        </Select>
                        
                    </ButtonGroup>
                    <Flex justifyContent="center">
                    <ButtonGroup>
                    <Button colorScheme="purple" size="lg">Deload Data</Button>
                    <Button colorScheme="purple" size="lg">Generate Excel</Button>
                    </ButtonGroup>
                    </Flex>
                </Stack>
            </Box>
            <br/>
            {/* Conditionally render the tables based on selected area */}
            {(selectedArea === 'Area 1' 
                || selectedArea === 'Area 4' 
                || selectedArea === 'Area 7' 
                ||selectedArea === 'Area 6' 
                ||selectedArea === 'Area 10') 
                && <DataTable />} 
                
            { (selectedArea === 'Area 2'
                ||selectedArea === 'Area 3'
                ||selectedArea === 'Area 5'
            )&&<DataTableSpecial />}
        </>
    );
}

export default Deloder;
