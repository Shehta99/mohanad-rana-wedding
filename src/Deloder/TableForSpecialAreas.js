import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';

const DataTableSpecial = () => {
    // Sample data for the table
    const data = [
        { serial: 1, item: 'Item A', WO: 'WO123', size: 'Small', drumNumber: 'D001', WIP: 'In Progress', stage: 'Stage 1', grossWeight: 100, drumW: 10, netWeight: 90, notes: 'None', user: 'User1' },
        { serial: 2, item: 'Item B', WO: 'WO124', size: 'Medium', drumNumber: 'D002', WIP: 'Completed', stage: 'Stage 2', grossWeight: 200, drumW: 20, netWeight: 180, notes: 'None',  user: 'User2' },
        // Add more sample rows as needed
        { serial: 3, item: 'Item C', WO: 'WO125', size: 'Large', drumNumber: 'D003', WIP: 'Pending', stage: 'Stage 3', grossWeight: 150, drumW: 15, netWeight: 135, notes: 'Check',  user: 'User3' },
        { serial: 4, item: 'Item D', WO: 'WO126', size: 'Small', drumNumber: 'D004', WIP: 'In Progress', stage: 'Stage 1', grossWeight: 90, drumW: 5, netWeight: 85, notes: 'Urgent',  user: 'User4' },
        { serial: 5, item: 'Item E', WO: 'WO127', size: 'Medium', drumNumber: 'D005', WIP: 'Completed', stage: 'Stage 2', grossWeight: 250, drumW: 30, netWeight: 220, notes: 'None',  user: 'User5' },
        { serial: 3, item: 'Item C', WO: 'WO125', size: 'Large', drumNumber: 'D003', WIP: 'Pending', stage: 'Stage 3', grossWeight: 150, drumW: 15, netWeight: 135, notes: 'Check',  user: 'User3' },
        { serial: 4, item: 'Item D', WO: 'WO126', size: 'Small', drumNumber: 'D004', WIP: 'In Progress', stage: 'Stage 1', grossWeight: 90, drumW: 5, netWeight: 85, notes: 'Urgent',  user: 'User4' },
        { serial: 5, item: 'Item E', WO: 'WO127', size: 'Medium', drumNumber: 'D005', WIP: 'Completed', stage: 'Stage 2', grossWeight: 250, drumW: 30, netWeight: 220, notes: 'None',  user: 'User5' },
    ];

    return (
        <Box 
            padding="6" 
            bg="gray.50" 
            borderRadius="lg" 
            boxShadow="lg" 
            maxHeight="400px" 
            overflowY="auto" // Enables vertical scrolling
        >
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="purple.600">
                Items Table
            </Text>
            <Table variant="striped" colorScheme="" size="sm">
                <Thead bg="purple.600">
                    <Tr>
                        <Th color="white">Serial</Th>
                        <Th color="white">WO</Th>
                        <Th color="white">TDS Number</Th>
                        <Th color="white">Size</Th>
                        <Th color="white">Description</Th>
                        <Th color="white">Steps</Th>
                        <Th color="white">Composit Part</Th>
                        <Th color="white">Stock Took (KM)</Th>
                        <Th color="white">Drum Number</Th>
                        <Th color="white">Step Cores</Th>
                        <Th color="white">Notes</Th>
                        <Th color="white">User</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((row) => (
                        <Tr key={row.serial} _hover={{ bg: 'purple.100' }}>
                            <Td>{row.serial}</Td>
                            <Td>{row.item}</Td>
                            <Td>{row.WO}</Td>
                            <Td>{row.size}</Td>
                            <Td>{row.drumNumber}</Td>
                            <Td>{row.WIP}</Td>
                            <Td>{row.stage}</Td>
                            <Td>{row.grossWeight}</Td>
                            <Td>{row.drumW}</Td>
                            <Td>{row.netWeight}</Td>
                            <Td>{row.notes}</Td>
                            <Td>{row.user}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default DataTableSpecial;
