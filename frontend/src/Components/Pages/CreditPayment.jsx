import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js"
import CheckoutForm from "../UI/Payment";
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import {
  Box,
  Text}
  from '@chakra-ui/react';
  import Navigation from "../UI/Navigation";
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
//const stripePromise = loadStripe("pk_test_51O3yL5I39njhw9EQbNUhiBjpOIiumwTdlgMLVwNx8e69uOiitybCgCIckh6rTt1XQMvqgFcoFFBbN3RUjLvtyIcO00i72iHKYH");
export default function CreditPayment() {
    const { address} = useParams();
    const [paymentParams, setPaymentParams] = useState(null);

    const[stripePromise,setStripePromise]=useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const navigate = useNavigate();
    const back =()=>  navigate(-1);

    useEffect(() => {
        // Fetch publishableKey using Axios
        axios.get("https://medd-9.onrender.com/order/config",{withCredentials:true})
          .then((response) => {
            console.log(response.data)
            const { publishableKey } = response.data;
            setStripePromise(loadStripe(publishableKey));
          })
          .catch((error) => {
            // Handle errors here
          });
      }, []);
      
      useEffect(() => {
        // Create PaymentIntent as soon as the page loads using Axios
        axios.post("https://medd-9.onrender.com/order/orderCredit", {},{ withCredentials: true }, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => {
            console.log(response.data);

            setClientSecret(response.data.clientSecret);
            setPaymentParams({address:address,intentid:response.data.paymentIntentId});

          })
          .catch((error) => {
            // Handle errors here
          });
      }, []);
  

      return (
        <>
        <Navigation pagetitle={"Online Payment"}  />

      
          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm paymentParams={paymentParams}/>
            </Elements>
          )}
        </>
      );
}
