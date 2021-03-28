import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, Button } from '@blockstack/ui';
import { userSession, getUserData } from '../auth';
import { Info } from './Info';
import { fetchTasks, saveInfo } from '../storage';
import Loader from '../loader.gif';
import QRCode from 'react-qr-code';
import FileInput from './FileInput';
import { Document, Page } from 'react-pdf';

export const DocumentList = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [file, setFile] = useState('');
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [id, setID] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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
              <Info placeholder="Name" value={info.name} input={name} setInput={setName} />
              <Info placeholder="Email" value={info.email} input={email} setInput={setEmail} />
              <Info placeholder="Age" value={info.age} input={age} setInput={setAge} />
              <Info placeholder="Gender" value={info.gender} input={gender} setInput={setGender} />
              <FileInput setFile={setFile} />
              {console.log(file)}
              <Button my={4} onClick={() => saveInfo(userSession, { name, email, age, gender, file }, true)}>
                Save Info
              </Button>
            </>
          )}
        </Flex>
        {!loading ? (
          <>
            <hr style={{ marginTop: '20px' }} />
            <Box my={5}>
              <Text textStyle="display.large" fontSize={5}>
                Your QR Code
              </Text>
              <Box my={5}>
                <QRCode
                  value={`{id: ${getUserData().decentralizedID}, name: ${info.name}, email: ${
                    info.email
                  }, age: ${info.age}, gender: ${info.gender}`}
                />
              </Box>
            </Box>
          </>
        ) : null}
        {!loading ? (
          <>
            <hr style={{ marginTop: '20px' }} />
            <Box my={5}>
              <Text textStyle="display.large" fontSize={5}>
                Your Documents
              </Text>
              <br />
              <Button my={4}><a href={info.file} download="document.pdf">Download</a></Button>
              <Box my={5}>
                <Document file={info.file} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pageNumber} />
                </Document>
                <Flex alignItems="center" justifyContent="center">
                  <Button mx={3} onClick={e => setPageNumber(prev => {
                    if (prev !== 1) return prev-1
                    else return prev
                  })}>{'<'}</Button>
                  <p style={{ color: 'gray' }}>Page {pageNumber} of {numPages}</p>
                  <Button mx={3} onClick={e => {setPageNumber(prev => {
                    if (prev !== numPages) return prev+1
                    else return prev
                  })}}>{'>'}</Button>
                </Flex>
              </Box>
            </Box>
          </>
        ) : null}
      </Box>
    </Flex>
  );
};
