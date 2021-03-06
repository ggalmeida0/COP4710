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
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link , Navigate} from 'react-router-dom';
import { GRAPHQL_SERVER } from '../../env';
import { CLEAR_ERROR, SET_CART_STATE, SET_ERROR } from '../../redux/appReducer';
import { CircularProgress } from '@mui/material';

const steps = ['Shipping address', 'Payment details', 'Review your order'];


const theme = createTheme();

export const sumPrices = (cartItems) => 
    cartItems.length > 0 ? 
      cartItems.map(item => parseFloat(item.cost.slice(1))).reduce((item1,item2) => item1 + item2)
    : 0;

export const Checkout = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const cartItems = useSelector(state => state.cartItems);
  const errorMessage = useSelector((state) => state.errorMessage);
  const dispatch = useDispatch();
  const username = useSelector(state => state.username);
  const [activeStep, setActiveStep] = React.useState(0);
  const [paymentInfo, setPaymentInfo] = React.useState(null);
  const [orderId, setOrderId] = React.useState(null);
  React.useEffect(() => axios.post(GRAPHQL_SERVER,{query:query})
      .then(result => setPaymentInfo(result.data.data.getLatestOrder))
      .catch(error => console.error(error)),[]);
  const getStepContent = (step,paymentInfo,setPaymentInfo) => {
    const props = {
      paymentInfo: paymentInfo,
      setPaymentInfo: setPaymentInfo,
      errorMessage:errorMessage,
      sumPrices:sumPrices
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

  const containInvalidFields = (fields) => {
    for(let i=0; i<fields.length;i++)
      if (!paymentInfo[fields[i]] || paymentInfo[fields[i]].length === 0) return true;
    return false;
  }

  const handleNext = () => {
    switch(activeStep){
      case 0:
        if (containInvalidFields(["street_address","city","state","zip","country"]))
          dispatch({type:SET_ERROR, payload:"Please fill in all the fields"});
        else{
          dispatch({type:CLEAR_ERROR})
          setActiveStep(activeStep + 1);
        }
        break;
      case 1:
        if (containInvalidFields(["card_number","expiration_date","csv_code","name_on_card"]))
          dispatch({type:SET_ERROR, payload:"Please fill in all the fields"})
        else{
          dispatch({type:CLEAR_ERROR})
          setActiveStep(activeStep + 1);
        }
        break;
      case 2:
        const query = `
          mutation {
            storeOrder(order:
            {
              ordered_by:"${username}"
              total:${sumPrices(cartItems)}
              games: ["${cartItems.map(item => item.title).join('","')}"]
              zip: "${paymentInfo.zip}"
              country: "${paymentInfo.country}"
              state: "${paymentInfo.state}"
              city: "${paymentInfo.city}"
              street_address: "${paymentInfo.street_address}"
              card_number: "${paymentInfo.card_number}"
              expiration_date: "${paymentInfo.expiration_date}"
              csv_code: "${paymentInfo.csv_code}"
              name_on_card: "${paymentInfo.name_on_card}"
            })

            clearCart(username: "${username}") {success}
          } 
        `;
        axios.post(GRAPHQL_SERVER,{query:query})
          .then(result => setOrderId(result.data.data.storeOrder))
          .catch(error => console.error(error));
        dispatch({type:SET_CART_STATE, payload: null})
        setActiveStep(activeStep + 1);
        break;
    }
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const query = `
  {
      getLatestOrder(username: "${username}")
      {
        zip
        country
        state
        city
        street_address
        card_number
        expiration_date
        csv_code
        name_on_card
      }
  }`;
  return (
    !isLoggedIn ? <Navigate to="/login" replace={true}/>
    :
    !paymentInfo ? <CircularProgress/>
    :
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
              orderId === null ? <CircularProgress/> :
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #{orderId}. We have emailed your order
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
