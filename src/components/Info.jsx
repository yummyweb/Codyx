import React, { useState, useEffect } from 'react';
import { Flex, Box, Input } from '@blockstack/ui';
import styled from 'styled-components';

const TodoInput = styled(Input)`
  background: none;
  border: none;
  &:focus {
    border: none;
    box-shadow: none;
  }
`;

export const Info = ({ placeholder, value, setInput, input }) => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setInput(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      width="100%"
      backgroundColor={focused ? '#FAFAFC' : 'white'}
      border="1px solid #ECECEC"
      borderRadius="10px"
      px={3}
      py={0}
      my={4}
      _hover={{ backgroundColor: '#FAFAFC' }}
    >
      <Flex>
        <Box flexGrow={1}>
          <TodoInput
            placeholder={placeholder}
            fontSize={2}
            value={input}
            onBlur={() => {
              setFocused(false);
            }}
            onFocus={() => setFocused(true)}
            onChange={e => {
              setInput(e.target.value);
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
};
