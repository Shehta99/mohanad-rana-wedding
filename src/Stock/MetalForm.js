import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, GridItem, Input, Text, FormControl, FormLabel, Stack, Divider } from '@chakra-ui/react';
import Select from 'react-select';
import axios from 'axios';
import targetServer from '../Server/TargetServer';

function MetalSectionForm() {
    const [formData, setFormData] = useState({
        drum: '',
        drumNumber: '',
        grossWeight: '',
        wipStage: '',
        copperSize: '',
        woItem: ''
    });

    const [selectedDrum, setSelectedDrum] = useState('');  // State for selected Drum

    const drumOptions =  [
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

    const drumNumberOptions = [
        { value: "001", label: "001" },
        { value: "002", label: "002" },
        { value: "003", label: "003" },
        { value: "004", label: "004" }
    ];

    const wipStageOptions = [
        { value: "enamel", label: "Enamel" },
        { value: "Copper", label: "Copper" },
        { value: "Tinned", label: "Tinned" },
        { value: "Flat", label: "Flat" }
    ];

    const [itemCount, setItemCount] = useState(0);  
    const [drumLabel, setDrumLabel] = useState('');

    useEffect(() => {
        setDrumLabel(`${formData.drum}${formData.drumNumber}`.trim());
        drumNumberData();
    }, [formData.drum, formData.drumNumber]);

    const handleSelectChange = (selectedOption, actionMeta) => {
        const value = selectedOption ? selectedOption.value : '';
        setFormData({ ...formData, [actionMeta.name]: value });

        if (actionMeta.name === 'drum') {
            setSelectedDrum(value);  // Update selectedDrum state
        }
    };

    const drumNumberData = async () => {
        try {
            console.log("selected Drum: ",selectedDrum);
            
          const response = await axios.get(targetServer() + `/ESC/DrumData/${selectedDrum}`);
          // Process response as needed
          console.log("response drum : ",response.data);
          
        } catch (error) {
          console.error('Error fetching data from backend:', error.response ? error.response.data : error);
        }
    };

    const handleClear = () => {
        setFormData({
            drum: '',
            drumNumber: '',
            grossWeight: '',
            wipStage: '',
            copperSize: '',
            woItem: ''
        });
        setDrumLabel('');
        setSelectedDrum('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        setItemCount(prevCount => prevCount + 1);
    };

    return (
        <Box p={8} boxShadow="xl" borderRadius="lg" bg="gray.100" maxW={{ base: "90%", md: "70%", lg: "50%" }} mx="auto" mt={10}>
            <Text fontSize="2xl" fontWeight="bold" mb={2} textAlign="center" color="purple.700">
                Metal Section Form
            </Text>

            <Text fontSize="lg" mb={6} textAlign="center" color="red.500">
                Serial Number: {itemCount}
            </Text>

            <Divider mb={6} borderColor="purple.300" />

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                {/* Drum Selection */}
                <GridItem colSpan={{ base: 2, md: 1 }}>
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

                {/* Drum Number Selection */}
                <GridItem colSpan={{ base: 2, md: 1 }}>
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

                {/* Concatenated Drum Label */}
                <GridItem colSpan={2}>
                    <FormControl>
                        <Text fontSize="md" color="gray.700" mt={2}>
                            Drum ID: {drumLabel}
                        </Text>
                    </FormControl>
                </GridItem>

                {/* Gross Weight (KG) */}
                <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                        <FormLabel>Gross Weight (KG)</FormLabel>
                        <Input 
                            type="text" 
                            name="grossWeight" 
                            value={formData.grossWeight} 
                            onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })} 
                            placeholder="Enter Gross Weight (KG)" 
                            borderColor="purple.500"
                            _hover={{ borderColor: "purple.600" }}
                        />
                    </FormControl>
                </GridItem>

                {/* WIP Stage Selection */}
                <GridItem colSpan={{ base: 2, md: 1 }}>
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

                {/* Copper Size */}
                <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                        <FormLabel>Copper Size</FormLabel>
                        <Input 
                            type="text" 
                            name="copperSize" 
                            value={formData.copperSize} 
                            onChange={(e) => setFormData({ ...formData, copperSize: e.target.value })} 
                            placeholder="Enter Copper Size" 
                            borderColor="purple.500"
                            _hover={{ borderColor: "purple.600" }}
                        />
                    </FormControl>
                </GridItem>

                {/* WO / Item */}
                <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                        <FormLabel>WO / Item</FormLabel>
                        <Input 
                            type="text" 
                            name="woItem" 
                            value={formData.woItem} 
                            onChange={(e) => setFormData({ ...formData, woItem: e.target.value })} 
                            placeholder="Enter WO / Item" 
                            borderColor="purple.500"
                            _hover={{ borderColor: "purple.600" }}
                        />
                    </FormControl>
                </GridItem>
            </Grid>

            {/* Buttons */}
            <Stack direction="row" spacing={6} justify="center" mt={10}>
                <Button colorScheme="blue" size="lg" onClick={handleSubmit}>
                    Save
                </Button>
                <Button colorScheme="red" size="lg" onClick={handleClear}>
                    Clear
                </Button>
            </Stack>
        </Box>
    );
}

export default MetalSectionForm;
