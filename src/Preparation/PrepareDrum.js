import React, { useState } from "react";
import axios from "axios";
import { Box, Textarea, Button, Heading, VStack, Text, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";
import targetServer from "../Server/TargetServer";

function PrepareDrum() {
  const [drumData, setDrumData] = useState("");
  const [drumList, setDrumList] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setDrumData(e.target.value);
  };

  const handleUpdateDrum = async () => {
    if (!drumData.trim()) {
      // Show an alert if textarea is empty
      setStatusMessage("Please enter drum data.");
      setShowAlert(true);
      return;
    }

    setIsLoading(true); // Start loading

    const newDrumList = drumData
      .split("\n")
      .map((line) => {
        const [drumName, avgWeight] = line.split(/\s+/).map(item => item.trim());
        return { drumName, avgWeight: parseFloat(avgWeight) };
      })
      .filter((item) => item.drumName && !isNaN(item.avgWeight)); // Filter out invalid entries

    setDrumList(newDrumList);

    try {
      const response = await axios.post(`${targetServer()}/ESC/DrumAll`, newDrumList);

      if (response.data === true) {
        setStatusMessage("Data successfully sent!");
        setDrumData(""); // Clear the input
        setDrumList([]); // Clear the displayed list
      } else {
        setStatusMessage("Failed to send data.");
      }
    } catch (error) {
      setStatusMessage("Error sending data.");
      console.error("Error sending data:", error);
    }

    setShowAlert(true); // Show the alert
    setIsLoading(false); // End loading
  };

  return (
    <Box 
      p="6" 
      bg="periwinkle" 
      borderRadius="lg" 
      boxShadow="lg" 
      maxW="lg" 
      mx="auto" 
      mt="10"
    >
      <VStack spacing="4" align="stretch">
        <Heading size="md" textAlign="center" color="purple.700">
          Prepare Drum Data
        </Heading>
        
        <Textarea
          placeholder="Enter drum data as DrumName AvgWeight"
          value={drumData}
          onChange={handleInputChange}
          minH="200px"
          resize="vertical"
          focusBorderColor="purple.400"
          fontSize="lg"
          p="4"
        />

        <Button 
          colorScheme="purple" 
          size="lg" 
          onClick={handleUpdateDrum}
          alignSelf="center"
          isLoading={isLoading} // Shows spinner on the button when loading
          loadingText="Updating"
        >
          Update Drum
        </Button>

        {showAlert && (
          <Alert status={statusMessage === "Data successfully sent!" ? "success" : "error"} mt="4" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>{statusMessage === "Data successfully sent!" ? "Success!" : "Error"}</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowAlert(false)} />
          </Alert>
        )}

        <Box mt="4">
          {drumList.map((drum, index) => (
            <Box key={index} p="2" borderBottom="1px solid purple">
              {drum.drumName} - {drum.avgWeight} kg
            </Box>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}

export default PrepareDrum;
