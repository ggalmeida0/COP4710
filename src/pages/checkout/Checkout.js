import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AddressForm } from './AddressForm';
import { PaymentForm } from './PaymentForm';
import { Review } from './Review';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GRAPHQL_SERVER } from '../../env';

const steps = ['Shipping address', 'Payment details', 'Review your order'];


const theme = createTheme();

const hasNull = (obj,attrs) => {
  for (const key in obj) 
    if (attrs.has(key) && obj[key] === null)  return true;
  return false;
}

export const Checkout = () => {
  const username = useSelector(state => state.username);
  const [activeStep, setActiveStep] = React.useState(0);
  const [paymentInfo, setPaymentInfo] = React.useState({});
  const [hasValidationError, setHasValidationError] = React.useState(false);
  const getStepContent = (step,paymentInfo,setPaymentInfo) => {
    const props = {
      paymentInfo: paymentInfo,
      setPaymentInfo: setPaymentInfo,
      hasValidationError: hasValidationError
    }
    switch (step) {
      case 0:
        return <AddressForm {...props}/>;
      case 1:
        return <PaymentForm {...props}/>;
      case 2:
        return <Review {...props}/>;
      default:
        throw new Error('Unknown step');
    }
  }

  const handleNext = () => {
    let fieldsForValidation = new Set();
    switch(activeStep){
      case 0:
        fieldsForValidation = new Set(["street_address","city","state","zipcode","country"]);
        break;
      case 1:
        fieldsForValidation = new Set(["card_number","expiration_date","csv_code","name_on_card"])
        break;
      case 2:
        const query = `
          mutation {
            storePaymentInfo(
              paymentInfo: {
              owned_by: "${username}"
              card_number: ${paymentInfo.card_number}
              expiration_date: "${paymentInfo.expiration_date}"
              csv_code: "${paymentInfo.csv_code}"
              zipcode: "${paymentInfo.zipcode}"
              country: "${paymentInfo.country}"
              state: "${paymentInfo.state}"
              city: "${paymentInfo.city}"
              street_address: "${paymentInfo.street_address}"
              name_on_card: "${paymentInfo.name_on_card}"
            }
            )
          } 
        `;
        axios.post(GRAPHQL_SERVER,{query:query})
          .catch(error => console.error(error));
        break;
    }
    const newValidationState = hasNull(paymentInfo,fieldsForValidation);
    setHasValidationError(newValidationState);
    if (!newValidationState) setActiveStep(activeStep + 1);
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const query = `
  {
    getPaymentInfo(username: "${username}")
      {
        card_number
        expiration_date
        csv_code
        zipcode
        country
        state
        city
        street_address
        name_on_card
      }
  }`;
  React.useEffect(() => axios.post(GRAPHQL_SERVER,{query:query})
      .then(result => setPaymentInfo(result.data.data.getPaymentInfo))
      .catch(error => console.error(error)),[]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="primary"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Link to="/">
            <Typography variant="h6" color="inherit" noWrap>
              Game Start
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep,paymentInfo,setPaymentInfo)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                    type="submit"
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}