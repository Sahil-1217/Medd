import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UI/button.css";
import {
  Box,
  Text,
  Button,
  Center,
  TableContainer,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Tag,
  TagLabel,
  Stack,
  Badge,
  Divider,
  useDisclosure,
  AbsoluteCenter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { Buffer } from "buffer";
import Navigation from "../UI/Navigation";
import "../UI/innerPages.css";
import SidebarAdmin from "../Pages/sideAdmin";

function PharmacistReqs() {
  const [reqs, setReqs] = useState([]);
  const [isOpen1, setIsOpen1] = useState(false);
  const [viewReq, setViewReq] = useState({});
  const [available, setAvailable] = useState(false);
  const [ID, SetID] = useState(false);
  const [Degree, SetDegree] = useState(false);
  const [License, SetLicense] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  // use effect to fetch data from backend

  useEffect(() => {
    const getReqs = async () => {
      try {
        const { data } = await axios.get(
          "https://medd-9.onrender.com/admin/applications",
          {
            withCredentials: true,
          }
        );
        // sort by date
        // data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTimeout(() => {
          setAvailable(true);
        }, 3001);
        setReqs(data);
      } catch (error) {
        console.log(error);
      }
    };
    getReqs();
  }, [reqs]);
  const back = () => navigate(-1);

  const onClose1 = () => setIsOpen1(false);
  const handleClose = () => {
    SetDegree(false);
    SetLicense(false);
    SetID(false);
  };
  const handleAccept = async () => {
    console.log("clicked");
    try {
      console.log("hey there i am in the handleAccept :");
      // ]router.post('/applications/accept-registeration/:id',acceptRegRequest);

      await axios.post(
        `https://medd-9.onrender.com/admin/applications/accept-registeration/${viewReq._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setReqs(reqs.filter((req) => req._id !== viewReq._id));
      onClose1();
    } catch (error) {
      console.error(
        "Error accepting request:",
        error.response?.data || error.message
      );
    }
  };

  const handleReject = async () => {
    try {
      console.log(viewReq._id);
      await axios.post(
        `https://medd-9.onrender.com/admin/applications/reject-registeration/${viewReq._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setReqs(reqs.filter((req) => req._id !== viewReq._id));
      onClose1();
    } catch (error) {
      console.log(error);
    }
  };
  const handleView1 = async () => {
    onOpen();
    SetID(true);
    SetDegree(false);
    SetLicense(false);
  };
  const handleView2 = async () => {
    onOpen();
    SetID(false);
    SetDegree(true);
    SetLicense(false);
  };
  const handleView3 = async () => {
    onOpen();
    SetID(false);
    SetDegree(false);
    SetLicense(true);
  };

  return (
    <>
      <Navigation pagetitle={"Doctor Requests"} />
      <SidebarAdmin />
      <div className="content">
        <Box p={5} mb={10}></Box>

        <Center>
          <TableContainer w={"90%"}>
            <Table size="lg">
              <Thead>
                <Tr bg={"#2d2d2e"}>
                  <Th color={"white"}>Name</Th>
                  <Th color={"white"}>Userame</Th>
                  <Th color={"white"}>
                    <Center>Request Date </Center>
                  </Th>
                  <Th color={"white"}> </Th>
                </Tr>
              </Thead>
              <Tbody>
                {reqs &&
                  reqs.map((req) => {
                    // Check if user.createdAt is a valid date
                    const createdAtDate =
                      req.createdAt instanceof Date
                        ? req.createdAt.toLocaleDateString()
                        : new Date(req.createdAt).toLocaleDateString();
                    return (
                      <Tr key={req._id}>
                        <Td w={"20%"}> {req.Name} </Td>
                        <Td w={"20%"}>
                          <Text fontSize={"lg"} ml={5}>
                            {req.Username}
                          </Text>
                        </Td>
                        <Td w={"20%"}>
                          {" "}
                          <Center>{createdAtDate} </Center>
                        </Td>
                        <Td w={"20%"}>
                          <Center>
                            <Button
                              colorScheme="blue"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsOpen1(true);
                                setViewReq(req);
                              }}
                            >
                              View Detais
                            </Button>
                          </Center>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Center>
        <Center>
          <Modal onClose={onClose} size="xl" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Preview</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box height="700px" overflow="hidden">
                  {available &&
                    ID &&
                    viewReq.IDDocument.contentType == "application/pdf" && (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`data:${
                          viewReq.IDDocument.contentType
                        };base64, ${Buffer.from(
                          viewReq.IDDocument.data
                        ).toString("base64")}`}
                      />
                    )}
                  {available && ID && (
                    <img
                      width="100%"
                      height="100%"
                      src={`data:${
                        viewReq.IDDocument.contentType
                      };base64, ${Buffer.from(viewReq.IDDocument.data).toString(
                        "base64"
                      )}`}
                    />
                  )}

                  {available &&
                    Degree &&
                    viewReq.pharmacyDegreeDocument.contentType ==
                      "application/pdf" && (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`data:${
                          viewReq.pharmacyDegreeDocument.contentType
                        };base64, ${Buffer.from(
                          viewReq.pharmacyDegreeDocument.data
                        ).toString("base64")}`}
                      />
                    )}
                  {available && Degree && (
                    <img
                      width="100%"
                      height="100%"
                      src={`data:${
                        viewReq.pharmacyDegreeDocument.contentType
                      };base64, ${Buffer.from(
                        viewReq.pharmacyDegreeDocument.data
                      ).toString("base64")}`}
                    />
                  )}

                  {available &&
                    License &&
                    viewReq.workingLicenseDocument.contentType ==
                      "application/pdf" && (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`data:${
                          viewReq.workingLicenseDocument.contentType
                        };base64, ${Buffer.from(
                          viewReq.workingLicenseDocument.data
                        ).toString("base64")}`}
                      />
                    )}
                  {available && License && (
                    <img
                      width="100%"
                      height="100%"
                      src={`data:${
                        viewReq.workingLicenseDocument.contentType
                      };base64, ${Buffer.from(
                        viewReq.workingLicenseDocument.data
                      ).toString("base64")}`}
                    />
                  )}
                </Box>
                <br></br>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <br></br>
        </Center>

        <Drawer onClose={onClose1} isOpen={isOpen1} size={"sm"}>
          <DrawerOverlay />

          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Flex>
                <Avatar src="https://bit.ly/sage-adebayo" />
                <Box ml="3">
                  <Text fontWeight="bold">
                    {viewReq.Name}
                    <Badge ml="1" colorScheme="green">
                      PENDING
                    </Badge>
                  </Text>
                  <Text fontSize="sm"> {viewReq.Username}</Text>
                </Box>
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              {/* Username: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  DateOfBirth:{
    type: Date,
    required: true,
  },
    HourlyRate: {
        type: Number,
        required: true,
    },
    Affiliation: {
        type: String,
        required: true,
    },
    EducationalBackground: {
        type: String,
        required: true,
    } */}

              <Flex justifyContent={"center"} alignItems={"center"}>
                <Stack spacing={10}>
                  <Box position="relative">
                    <Divider />
                    <AbsoluteCenter bg="white" px="4">
                      Email
                    </AbsoluteCenter>
                  </Box>
                  <Text fontSize={"3xl"}>
                    {" "}
                    <Center> {viewReq.Email} </Center>{" "}
                  </Text>
                  <Box position="relative">
                    <Divider />
                    <AbsoluteCenter bg="white" px="4">
                      Hourly Rate
                    </AbsoluteCenter>
                  </Box>
                  <Text fontSize={"3xl"}>
                    {" "}
                    <Center> ${viewReq.HourlyRate} </Center>
                  </Text>
                  <Box position="relative">
                    <Divider />
                    <AbsoluteCenter bg="white" px="4">
                      Affiliation
                    </AbsoluteCenter>
                  </Box>
                  <Text fontSize={"3xl"}>
                    {" "}
                    <Center> {viewReq.Affiliation}</Center>
                  </Text>
                  <Box position="relative">
                    <Divider />
                    <AbsoluteCenter bg="white" px="4">
                      Educational Background
                    </AbsoluteCenter>
                  </Box>
                  <Text fontSize="3xl">
                    {" "}
                    <Center> {viewReq.EducationalBackground} </Center>
                  </Text>
                  <Button onClick={handleView1}>View ID Doc</Button>
                  <Button onClick={handleView2}>View Degree</Button>
                  <Button onClick={handleView3}>View License</Button>
                </Stack>
              </Flex>
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="green" m={1} onClick={handleAccept}>
                Accept
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                m={1}
                onClick={handleReject}
              >
                Reject
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

export default PharmacistReqs;
