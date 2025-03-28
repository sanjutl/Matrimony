  import React from 'react';
  import { Elements } from '@stripe/react-stripe-js';
  import { loadStripe } from '@stripe/stripe-js';
  import CheckoutWrapper from './CheckoutForm';
  import { useParams } from 'react-router-dom';

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  const Checkout = () => {
      const {  userId } = useParams(); 
    return (
      <Elements stripe={stripePromise}>
        <CheckoutWrapper userId={userId} stripePromise={stripePromise}/>
      </Elements>
    );
  };

  export default Checkout;
