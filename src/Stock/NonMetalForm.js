import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Grid, GridItem, Text, FormControl, FormLabel, Stack, Divider } from '@chakra-ui/react';
import Select from 'react-select';

function NonMetalForm() {
  const [formData, setFormData] = useState({
    workOrder: null,
    step: null,
    tds: '',
    description: '',
    size: '',
    drum: null,
    drumNumber: '',
    stockTakeKM: '',
    stepCores: '',
    compositePart: '',
  });

  const [itemCount, setItemCount] = useState(0);
  const [drumLabel, setDrumLabel] = useState('');

  useEffect(() => {
    setDrumLabel(`${formData.drum}${formData.drumNumber}`.trim());
  }, [formData.drum, formData.drumNumber]);

  const workOrderOptions = [
    { value: 'WO-001', label: 'WO-001' },
    { value: 'WO-002', label: 'WO-002' },
    { value: 'WO-003', label: 'WO-003' },
  ];

  const stepOptions = [
    { value: 'Step 1', label: 'Step 1' },
    { value: 'Step 2', label: 'Step 2' },
    { value: 'Step 3', label: 'Step 3' },
  ];

  const drumNumberOptions = [
    { value: "001", label: "001" },
    { value: "002", label: "002" },
    { value: "003", label: "003" },
    { value: "004", label: "004" }
    // Add more options as needed
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData({ ...formData, [actionMeta.name]: selectedOption ? selectedOption.value : '' });
  };

  const handleClear = () => {
    setFormData({
      workOrder: null,
      step: null,
      tds: '',
      description: '',
      size: '',
      drum: null,
      drumNumber: '',
      stockTakeKM: '',
      stepCores: '',
      compositePart: '',
    });
    setDrumLabel('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setItemCount(prevCount => prevCount + 1);
  };

  return (
    <Box p={8} boxShadow="xl" borderRadius="lg" bg="gray.50" maxW={{ base: '95%', md: '80%', lg: '60%' }} mx="auto" mt={10}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="purple.700">
        Non-Metal Section
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center" color="red.500">
        Serial Number: {itemCount}
      </Text>

      <Grid templateColumns="1fr" gap={4}>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>Work Order</FormLabel>
            <Select
              name="workOrder"
              value={workOrderOptions.find(option => option.value === formData.workOrder)}
              onChange={handleSelectChange}
              options={workOrderOptions}
              placeholder="Select Work Order"
              isClearable
              styles={{ control: (base) => ({ ...base, borderColor: 'purple.500', '&:hover': { borderColor: 'purple.600' } }) }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>Step</FormLabel>
            <Select
              name="step"
              value={stepOptions.find(option => option.value === formData.step)}
              onChange={handleSelectChange}
              options={stepOptions}
              placeholder="Select Step"
              isClearable
              styles={{ control: (base) => ({ ...base, borderColor: 'purple.500', '&:hover': { borderColor: 'purple.600' } }) }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>TDS</FormLabel>
            <Input
              type="text"
              name="tds"
              value={formData.tds}
              onChange={handleInputChange}
              placeholder="Enter TDS"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.600' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Size</FormLabel>
            <Input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="Enter Size"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.600' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Description"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.600' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Drum</FormLabel>
            <Select
              name="drum number"
              value={drumOptions.find(option => option.value === formData.drum)}
              onChange={handleSelectChange}
              options={drumOptions}
              placeholder="Select Drum"
              isClearable
              styles={{ control: (base) => ({ ...base, borderColor: 'purple.500', '&:hover': { borderColor: 'purple.600' } }) }}
            />

          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
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

        <GridItem>
          <FormControl>
            <FormLabel>Stock Take (KM)</FormLabel>
            <Input
              type="text"
              name="stockTakeKM"
              value={formData.stockTakeKM}
              onChange={handleInputChange}
              placeholder="Enter Stock Take (KM)"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.600' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Step Cores</FormLabel>
            <Input
              type="text"
              name="stepCores"
              value={formData.stepCores}
              onChange={handleInputChange}
              placeholder="Enter Step Cores"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.600' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Composite Part</FormLabel>
            <Input
              type="text"
              name="compositePart"
              value={formData.compositePart}
              onChange={handleInputChange}
              placeholder="Enter Composite Part"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.600' }}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Stack direction="row" spacing={6} justify="center" mt={8}>
        <Button colorScheme="blue" onClick={handleSubmit}>Save</Button>
        <Button colorScheme="red" onClick={handleClear}>Clear</Button>
      </Stack>
    </Box>
  );
}

export default NonMetalForm;
