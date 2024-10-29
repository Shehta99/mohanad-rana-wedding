import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Grid, GridItem, Text, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import Select from 'react-select'; // Import React Select

function MagnetWireForm() {
    // Define state for each input field
    const [formData, setFormData] = useState({
        drum: '',
        drumNumber: '',
        grossWeight: '',
        wipStage: '',
        copperSize: '',
        woItem: ''
    });

    // State to store the concatenated label
    const [label, setLabel] = useState('');

    // State for item count
    const [itemCount, setItemCount] = useState(0);

    // List of Drums
    const drumOptions = [
        { value: "MC", label: "MC" }, { value: "MB", label: "MB" },
        { value: "MF", label: "MF" }, { value: "SB", label: "SB" },
        { value: "SC", label: "SC" }, { value: "SD", label: "SD" },
        { value: "SE", label: "SE" }, { value: "SF", label: "SF" },
        { value: "SG", label: "SG" }, { value: "SH", label: "SH" },
        { value: "SI", label: "SI" }, { value: "SJ", label: "SJ" },
        { value: "SK", label: "SK" }, { value: "TK", label: "TK" },
        { value: "SWK", label: "SWK" }, { value: "basket", label: "basket" },
        { value: "Pallet", label: "Pallet" }, { value: "Steel Drum", label: "Steel Drum" },
        { value: "CBOX", label: "CBOX" }, { value: "Plywood", label: "Plywood" },
        { value: "Wooden Drum", label: "Wooden Drum" }, { value: "CR.Spool", label: "CR.Spool" },
        { value: "PL.SP", label: "PL.SP" }, { value: "PL.SP 500", label: "PL.SP 500" },
        { value: "PL.BOX", label: "PL.BOX" }
    ];

    // List of WIP Stages
    const wipStageOptions = [
        { value: "Enamel", label: "Enamel" },
        { value: "Copper", label: "Copper" },
        { value: "Tinned", label: "Tinned" },
        { value: "Flat", label: "Flat" },
        { value: "ALM", label: "ALM" },
        { value: "Enamel ALM", label: "Enamel ALM" }
    ];

    const drumNumberOptions = [
        { value: "001", label: "001" },
        { value: "002", label: "002" },
        { value: "003", label: "003" },
        { value: "004", label: "004" }
        // Add more options as needed
      ];

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle Select changes
    const handleSelectChange = (selectedOption, action) => {
        setFormData({ ...formData, [action.name]: selectedOption ? selectedOption.value : '' });
    };

    // Concatenate Drum and Drum Number
    useEffect(() => {
        setLabel(`${formData.drum}${formData.drumNumber}`);
    }, [formData.drum, formData.drumNumber]);

    // Handle form reset (clear button)
    const handleClear = () => {
        setFormData({
            drum: '',
            drumNumber: '',
            grossWeight: '',
            wipStage: '',
            copperSize: '',
            woItem: ''
        });
    };

    // Handle form submit (save button)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
    };

    return (
        <Box p={8} boxShadow="lg" borderRadius="lg" bg="gray.50" maxW={{ base: "90%", md: "80%", lg: "60%" }} mx="auto" mt={10}>
            <Text fontSize="2xl" fontWeight="bold" mb={2} textAlign="center" color="purple.700">
                Magnet Wire Section
            </Text>
            <Text fontSize="lg" fontWeight="bold" mb={6} textAlign="center" color="red">
                Serial Number: {itemCount}
            </Text>

            {/* New Section for Drum, Drum Number, and Label in a single line */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={6} p={4} borderWidth="1px" borderRadius="md" borderColor="purple.300">
                {/* Drum Selection */}
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Drum</FormLabel>
                        <Select
                            name="drum"
                            value={drumOptions.find(option => option.value === formData.drum)}
                            onChange={handleSelectChange}
                            options={drumOptions}
                            placeholder="Select Drum"
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: 'purple.500',
                                    '&:hover': { borderColor: 'purple.600' },
                                }),
                            }}
                        />
                    </FormControl>
                </GridItem>

                {/* Drum Number */}
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Drum Number</FormLabel>
                        <Select
                            name="drumNumber"
                            value={drumNumberOptions.find(option => option.value === formData.drumNumber)}
                            onChange={handleSelectChange}
                            options={drumNumberOptions}
                            placeholder="Select Drum Number"
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: 'purple.500',
                                    '&:hover': { borderColor: 'purple.600' },
                                }),
                            }}
                        />
                    </FormControl>
                </GridItem>

                {/* Concatenated Label */}
                <GridItem>
                    <FormControl>
                        <Text fontSize="md" color="gray.700" mt={2}>
                            Drum ID: {label || 'N/A'}
                        </Text>
                    </FormControl>
                </GridItem>
            </Grid>

            {/* Section for Gross Weight and WIP Stage on the same line */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={6}>
                {/* Gross Weight (KG) */}
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Gross Weight (KG)</FormLabel>
                        <Input
                            type="text"
                            name="grossWeight"
                            value={formData.grossWeight}
                            onChange={handleInputChange}
                            placeholder="Enter Gross Weight (KG)"
                            borderColor="purple.500"
                            _hover={{ borderColor: "purple.600" }}
                        />
                    </FormControl>
                </GridItem>

                {/* WIP Stage Selection */}
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>WIP Stage</FormLabel>
                        <Select
                            name="wipStage"
                            value={wipStageOptions.find(option => option.value === formData.wipStage)}
                            onChange={handleSelectChange}
                            options={wipStageOptions}
                            placeholder="Select WIP Stage"
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: 'purple.500',
                                    '&:hover': { borderColor: 'purple.600' },
                                }),
                            }}
                        />
                    </FormControl>
                </GridItem>
            </Grid>

            {/* Other Form Fields */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                {/* Copper Size */}
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Copper Size</FormLabel>
                        <Input
                            type="text"
                            name="copperSize"
                            value={formData.copperSize}
                            onChange={handleInputChange}
                            placeholder="Enter Copper Size"
                            borderColor="purple.500"
                            _hover={{ borderColor: "purple.600" }}
                        />
                    </FormControl>
                </GridItem>

                {/* WO / Item */}
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>WO / Item</FormLabel>
                        <Input
                            type="text"
                            name="woItem"
                            value={formData.woItem}
                            onChange={handleInputChange}
                            placeholder="Enter WO / Item"
                            borderColor="purple.500"
                            _hover={{ borderColor: "purple.600" }}
                        />
                    </FormControl>
                </GridItem>
            </Grid>

            {/* Buttons */}
            <Stack direction="row" spacing={6} justify="center" mt={6}>
                <Button colorScheme="blue" onClick={handleSubmit}>
                    Save
                </Button>
                <Button colorScheme="red" onClick={handleClear}>
                    Clear
                </Button>
            </Stack>
        </Box>
    );
}

export default MagnetWireForm;
