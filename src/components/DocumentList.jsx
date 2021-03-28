import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, Button } from '@blockstack/ui';
import { userSession, getUserData } from '../auth';
import { Info } from './Info';
import { fetchTasks, saveInfo } from '../storage';
import Loader from '../loader.gif';
import QRCode from 'react-qr-code';

export const DocumentList = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [id, setID] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = document.location.pathname.split('/')[2];
    if (id) {
      setID(id);
    }
    const doFetchTasks = async () => {
      const response = await fetchTasks(userSession, id);
      if (response.tasks === null) {
        setNotFound(true);
      } else {
        setInfo(response.info);
      }
      setIsPublic(!!response.public);
      setLoading(false);
    };
    doFetchTasks();
  }, []);

  const getHeader = () => {
    if (loading) {
      return 'Loading...';
    }
    if (notFound) {
      return '404. The id is either private or does not exist.';
    }
    if (id) {
      if (isPublic) {
        return `${id.split('.')[0]}'s info`;
      }
      return `${id.split('.')[0]}'s info is private`;
    }
    return 'My Info';
  };

  return (
    <Flex>
      <Box maxWidth="660px" width="100%" mx="auto" mt="75px">
        <Flex width="100%" flexWrap="wrap">
          <Box mb={4} width="100%">
            <Text textStyle="display.large" fontSize={7}>
              {getHeader()}
            </Text>
          </Box>
          {loading ? (
            <img src={Loader} style={{ height: '50px' }} alt="Loading..." />
          ) : (
            <>
              <Info placeholde="Name" value={info.name} input={name} setInput={setName} />
              <Info placeholder="Email" value={info.email} input={email} setInput={setEmail} />
              <Info placeholder="Age" value={info.age} input={age} setInput={setAge} />
              <Button onClick={() => saveInfo(userSession, { name, email, age }, true)}>
                Save Info
              </Button>
            </>
          )}
        </Flex>
        <hr style={{ marginTop: '20px' }} />
        <Box my={5}>
          <Text textStyle="display.large" fontSize={5}>
            Your QR Code:
          </Text>
          <Box my={5}>
            <QRCode value={getUserData().decentralizedID} />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};
