import React, { useState } from 'react';
import axios from 'axios';
import {
  Textarea, Heading, Center, Button, Stack, Table,
  Thead, Tbody, Tr, Th, Td, TableContainer, Box, Alert, AlertIcon, Text
} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import targetServer from '../Server/TargetServer';

function PreparationWO() {
  const [value, setValue] = useState('');
  const [workOrders, setWorkOrders] = useState([]);
  const [loadingGetDistinct, setLoadingGetDistinct] = useState(false);
  const [loadingGetData, setLoadingGetData] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [Data, setData] = useState([]);
  const [showDistinct, setShowDistinct] = useState(true);
  const [uploadDataFlag, setUploadDataFlag] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleGetWorkOrders = () => {
    const orders = value.split('\n').map(order => order.trim()).filter(order => order);
    setWorkOrders(orders);
    return orders;
  };

  const handleSendToBackend = async () => {
    setLoadingGetDistinct(true);
    setUploadDataFlag(false);
    setUploadError(false);
    try {
      const orders = handleGetWorkOrders();
      const response = await axios.post(targetServer() + '/ESC/getDiff_WO', orders, {
        headers: { 'Content-Type': 'application/json' }
      });
      setWorkOrders(response.data);
      setShowDistinct(true);
    } catch (error) {
      console.error('Error sending data to backend:', error.response ? error.response.data : error);
    } finally {
      setLoadingGetDistinct(false);
    }
  };

  const uploadData = async () => {
    setLoadingUpload(true);
    setUploadError(false);
    try {
      const response = await axios.post(targetServer() + '/ESC/wipAll', {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data) {
        setUploadDataFlag(true);
        setValue('');
        setWorkOrders([]);
      } else {
        setUploadError(true);
      }
      setShowDistinct(true);
    } catch (error) {
      console.error('Error sending data to backend:', error.response ? error.response.data : error);
      setUploadError(true);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleBckdata = async () => {
    setLoadingGetData(true);
    try {
      const response = await axios.get(targetServer() + '/ESC/dataOfWo');
      setData(response.data);
      setShowDistinct(false);
    } catch (error) {
      console.error('Error fetching data from backend:', error.response ? error.response.data : error);
    } finally {
      setLoadingGetData(false);
    }
  };

  return (
    <>
      <Box mt={4}>
        <Heading size="lg" fontSize="24px" textAlign="center" mb={4}>
          Work Orders
        </Heading>
        <Center>
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder='Enter each work order on a new line'
            size='sm'
            height={{ base: "150px", md: "200px" }}
            width={{ base: "90%", sm: "80%", md: "70%" }}
            border='2px'
            borderStyle='double'
          />
        </Center>

        <Center mt={4}>
          <Stack direction={{ base: "column", sm: "row" }} spacing={4} align="center">
            <Button
              colorScheme="purple"
              width={{ base: "100%", sm: "auto" }}
              onClick={handleSendToBackend}
              isLoading={loadingGetDistinct}
            >
              Get Distinct Work Orders
            </Button>
            <Button
              colorScheme="green"
              width={{ base: "100%", sm: "auto" }}
              onClick={handleBckdata}
              isLoading={loadingGetData}
            >
              Get Data Of Difference
            </Button>
            <Button
              colorScheme="yellow"
              width={{ base: "100%", sm: "auto" }}
              onClick={uploadData}
              isLoading={loadingUpload}
            >
              Upload Data
            </Button>
          </Stack>
        </Center>

        {uploadDataFlag && (
          <Center mt={4}>
            <Alert status="success" width="80%">
              <AlertIcon />
              Data uploaded successfully!
            </Alert>
          </Center>
        )}

        {uploadError && (
          <Center mt={4}>
            <Alert status="error" width="80%">
              <AlertIcon />
              Failed to upload data. No Data Found.
            </Alert>
          </Center>
        )}

        <Box height="400px" overflowY="auto" mt={4}>
          <TableContainer>
            <Table size='sm' variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th borderBottom="2px solid lightgray">Work Order</Th>
                  {!showDistinct && <Th borderBottom="2px solid lightgray">TDS Number</Th>}
                  {!showDistinct && <Th isNumeric borderBottom="2px solid lightgray">Size</Th>}
                  {!showDistinct && <Th borderBottom="2px solid lightgray">Description</Th>}
                  {!showDistinct && <Th borderBottom="2px solid lightgray">Steps</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {showDistinct ? (
                  workOrders.map((order, index) => (
                    <Tr key={index} _hover={{ bg: 'gray.100' }} _active={{ bg: 'gray.200' }}>
                      <Td>{order}</Td>
                    </Tr>
                  ))
                ) : (
                  Data.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.wo}</Td>
                      <Td>{item.tdsNo}</Td>
                      <Td isNumeric>{item.size}</Td>
                      <Td>{item.description}</Td>
                      <Td>{item.steps}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Final Counter Label */}
        <Center mt={2}>
          <Text fontSize="sm" color="gray.500">
            Total Items: {showDistinct ? workOrders.length : Data.length}
          </Text>
        </Center>
      </Box>
    </>
  );
}

export default PreparationWO;
