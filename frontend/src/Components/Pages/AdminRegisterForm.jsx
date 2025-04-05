import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio
} from 'mdb-react-ui-kit';
// eslint-disable-next-line no-unused-vars
import { Box, Button, FormControl, Select, Text, useToast } from "@chakra-ui/react";
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import wallpaper from '../UI/Images/tealWall.jpg';

import Navigation from "../UI/Navigation";
import '../UI/innerPages.css';

const AdminRegisterForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: '',
    department: '',
    adminCode: ''
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post('http://localhost:8001/administration', formData);
      if (response.data.message !== 'Admin already exists') {
        toast({
          title: 'Registration Successful',
          description: response.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/admin-dashboard');
      } else {
        toast({
          title: 'Registration Failed',
          description: "Admin username already exists",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      let errorMessage = "Registration failed due to an unexpected error.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error("Registration Error:", errorMessage);
    }
  };

  return (
    <MDBContainer fluid className='d-flex justify-content-center'
      style={{ height: 'max-content', backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <MDBRow className='d-flex justify-content-center align-items-center w-75' style={{ height: 'fit-content' }}>
        <MDBCol>
          <Navigation pagetitle={""} />
          <MDBCard className='my-4' style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(5px)'
          }}>
            <h3 className="text-uppercase fw-bold pt-5 ps-5">Admin Registration Form</h3>

            <MDBRow className='g-0 '>
              <MDBCol lg={'6'} md='12' sm={'12'}>
                <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                  <Text> Personal Information </Text>
                  <MDBInput wrapperClass='mb-4' label='Full Name' size='lg' name='name' type='text' onChange={onChange} />
                  <MDBInput wrapperClass='mb-4' label='Email' size='lg' name='email' type='email' onChange={onChange} />
                  <MDBInput wrapperClass='mb-4' label='Username' name='username' size='lg' type='text' onChange={onChange} />
                  <MDBInput wrapperClass='mb-4' label='Password' size='lg' name='password' type='password' onChange={onChange} />
                  <MDBInput wrapperClass='mb-4' name='mobile' label='Phone Number' size='lg' type='number' onChange={onChange} />
                </MDBCardBody>
              </MDBCol>

              <MDBCol md='6'>
                <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                  <Text> Admin Details </Text>

                  <Select className='mb-4' name='role' placeholder="Select Admin Role" onChange={onChange}>
                    <option value='Super Admin'>Super Admin</option>
                    <option value='Manager'>Manager</option>
                    <option value='Staff'>Staff</option>
                  </Select>

                  <Select className='mb-4' name='department' placeholder="Select Department" onChange={onChange}>
                    <option value='HR'>HR</option>
                    <option value='IT'>IT</option>
                    <option value='Finance'>Finance</option>
                  </Select>

                  <MDBInput wrapperClass='mb-4' label='Admin Code (For Security)' size='lg' name='adminCode' type='password' onChange={onChange} />
                </MDBCardBody>
              </MDBCol>
            </MDBRow>

            <MDBRow className='g-0 p-2'>
              <div className="d-flex justify-content-end pt-3">
                {formData.username !== '' &&
                  formData.name !== '' &&
                  formData.email !== '' &&
                  formData.password !== '' &&
                  formData.mobile !== '' &&
                  formData.role !== '' &&
                  formData.department !== '' &&
                  formData.adminCode !== '' ? (
                  <Button variant={'solid'} colorScheme="teal" size={'lg'} type="submit" onClick={onSubmit}>
                    Submit
                  </Button>
                ) : (
                  <Button isDisabled={true} variant={'solid'} colorScheme="teal" size={'lg'} type="submit">
                    Please fill all fields
                  </Button>
                )}
              </div>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AdminRegisterForm;
