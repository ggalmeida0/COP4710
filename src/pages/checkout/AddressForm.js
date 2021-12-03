import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export const AddressForm = ({ paymentInfo, setPaymentInfo, errorMessage }) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Typography variant="h6" gutterBottom color="red">
        {errorMessage}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="address"
            name="address"
            label="Address line"
            fullWidth
            variant="standard"
            defaultValue={paymentInfo.street_address}
            onChange={(event) => setPaymentInfo({...paymentInfo, street_address: event.target.value})}
            error = {errorMessage.length > 0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            variant="standard"
            defaultValue={paymentInfo.city}
            onChange={(event) => setPaymentInfo({...paymentInfo, city: event.target.value})}
            error = {errorMessage.length > 0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
            defaultValue={paymentInfo.state}
            onChange={(event) => setPaymentInfo({...paymentInfo, state: event.target.value})}
            error = {errorMessage.length > 0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
            defaultValue={paymentInfo.zip}
            onChange={(event) => setPaymentInfo({...paymentInfo, zip: event.target.value})}
            error = {errorMessage.length > 0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="standard"
            defaultValue={paymentInfo.country}
            onChange={(event) => setPaymentInfo({...paymentInfo, country: event.target.value})}
            error = {errorMessage.length > 0}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
