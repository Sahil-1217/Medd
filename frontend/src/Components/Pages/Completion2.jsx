import React, { useEffect,useState } from 'react';
import "../../comp.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import { Buffer } from 'buffer';

import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import {
  Box,
  Text}
  from '@chakra-ui/react';
export default function Completion() {
  // Use the useParams hook to access the route parameters
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();
  const back =()=>  navigate("/home");

  useEffect(() => {
    // Perform a POST request to the backend here, if needed
    // You can use libraries like Axios or the built-in Fetch API
    // Example with Axios:
    
    axios.get('http://localhost:8001/order/recent', { withCredentials: true })
      .then(response => {
        setOrder(response.data);
        // Do additional handling here
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

   
	return (
      <>
       <Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
        <Text fontSize={'3xl'} color={'white'}></Text>
        <button className="btn" onClick={back}>back</button>
      </Box>
      { order? (<section
        className="h-100 gradient-custom"
        style={{ backgroundColor: "#eee" }}
      >
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="10" xl="8">
              <MDBCard style={{ borderRadius: "10px" }}>
                <MDBCardHeader className="px-4 py-5">
                  <MDBTypography tag="h5" className="text-muted mb-0">
                    Thank you for your Order
                  </MDBTypography>
                </MDBCardHeader>
                <MDBCardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p
                      className="lead fw-normal mb-0"
                      style={{ color: "#4bbbf3" }}
                    >
                      Receipt
                    </p>
                    <p className="small text-muted mb-0">
                      Receipt Voucher : {order._id}
                    </p>
                  </div>
                  <MDBCardBody>
          {order && order.items && order.items.map((item, index) => (
          <MDBCard key={index} className="shadow-0 border mb-4">
            <MDBCardBody>
              <MDBRow>
          {/* Customize this structure based on your item properties */}
          <MDBCol md="2">
            {/* Display item image */}
            <MDBCardImage
            src={`data:${item.image.contentType};base64, ${Buffer.from(item.image.data).toString('base64')}`}
            fluid
             alt={item.name} 
               // Assuming name is the property holding the item name
            />
          </MDBCol>
          {/* Display other item details */}
          <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
            <p className="text-muted mb-0">{item.name}</p>
          </MDBCol>
          <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
            <p className="text-muted mb-0 small">Qty: {item.quantity}</p>
          </MDBCol>
          <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
            <p className="text-muted mb-0 small">${item.price}</p>
          </MDBCol>
        </MDBRow>
        <hr
                        className="mb-4"
                        style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                      />
                      <MDBRow className="align-items-center">
                        <MDBCol md="2">
                          <p className="text-muted mb-0 small">Track Order</p>
                        </MDBCol>
                        <MDBCol md="10">
                          <MDBProgress
                            style={{ height: "6px", borderRadius: "16px" }}
                          >
                            <MDBProgressBar
                              style={{
                                borderRadius: "16px",
                                backgroundColor: "#4bbbf3",
                              }}
                              width={10}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>
                          <div className="d-flex justify-content-around mb-1">
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">
                              Out for delivary
                            </p>
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">
                              Delivered
                            </p>
                          </div>
                        </MDBCol>
                      </MDBRow>
                        </MDBCardBody>
                      </MDBCard>
                    ))}
                  </MDBCardBody>

                  {/* <MDBCard className="shadow-0 border mb-4">
                    <MDBCardBody>
                      <MDBRow>
                        <MDBCol md="2">
                          <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/13.webp"
                            fluid
                            alt="Phone"
                          />
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="text-center d-flex justify-content-center align-items-center"
                        >
                          <p className="text-muted mb-0">Samsung Galaxy</p>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="text-center d-flex justify-content-center align-items-center"
                        >
                          <p className="text-muted mb-0 small">White</p>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="text-center d-flex justify-content-center align-items-center"
                        >
                          <p className="text-muted mb-0 small">
                            Capacity: 64GB
                          </p>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="text-center d-flex justify-content-center align-items-center"
                        >
                          <p className="text-muted mb-0 small">Qty: 1</p>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="text-center d-flex justify-content-center align-items-center"
                        >
                          <p className="text-muted mb-0 small">$499</p>
                        </MDBCol>
                      </MDBRow>
                      <hr
                        className="mb-4"
                        style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                      />
                      <MDBRow className="align-items-center">
                        <MDBCol md="2">
                          <p className="text-muted mb-0 small">Track Order</p>
                        </MDBCol>
                        <MDBCol md="10">
                          <MDBProgress
                            style={{ height: "6px", borderRadius: "16px" }}
                          >
                            <MDBProgressBar
                              style={{
                                borderRadius: "16px",
                                backgroundColor: "#a8729a",
                              }}
                              width={65}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>
                          <div className="d-flex justify-content-around mb-1">
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">
                              Out for delivary
                            </p>
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">
                              Delivered
                            </p>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard> */}

                  

                  <div className="d-flex justify-content-between pt-2">
                    <p className="fw-bold mb-0">Order Details</p>
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">Total</span> {order.bill}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between pt-2">
                    <p className="text-muted mb-0">Invoice Number : 788152</p>
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">Delivery Charges</span>{" "}
                      Free
                    </p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p className="text-muted mb-0">
                      Invoice Date : { new Date(order.date_added).toLocaleString('en-US')
                      }
                    </p>
                   
                  </div>

                  <div className="d-flex justify-content-between mb-5">
                    <p className="text-muted mb-0">
                      Recepits Voucher : 18KU-62IIK
                    </p>
                    
                  </div>
                </MDBCardBody>
                <MDBCardFooter
                  className="border-0 px-4 py-5"
                  style={{
                    backgroundColor: "#4bbbf3",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  <MDBTypography
                    tag="h5"
                    className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
                  >
                    Total paid: <span className="h2 mb-0 ms-2">{order.bill}</span>
                  </MDBTypography>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>):((
            <p>No orders yet</p>
          ))}
    </>
    );
}

