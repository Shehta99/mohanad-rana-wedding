import React, { useState } from 'react';
import {Center, Select
} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrepareDrum from './PrepareDrum';
import PreparationWO from './PrepareWO';

function Preparation() {
  const [selection, setSelection] = useState(''); // New state for selection dropdow
  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  return (
    <>
      {/* Selection Dropdown */}
      <Center mb={4}>
        <Select
          value={selection}
          onChange={handleSelectionChange}
          placeholder="Select View"
          width={{ base: "90%", sm: "80%", md: "70%" }}
          border='2px'
          borderStyle='double'
        >
          <option value="Drum">Update Drum</option>
          <option value="WO">Update workOrders</option>
        </Select>
      </Center>
     
    {selection=='WO'&&<PreparationWO/>}
      {selection=='Drum'&&<PrepareDrum/>}
    </>
  );
}

export default Preparation;
