import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export const AddressForm = (props) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
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
            defaultValue={props.paymentInfo.street_address}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, street_address: event.target.value})}
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
            defaultValue={props.paymentInfo.city}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, city: event.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
            defaultValue={props.paymentInfo.state}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, state: event.target.value})}
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
            defaultValue={props.paymentInfo.zipcode}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, zipcode: event.target.value})}
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
            defaultValue={props.paymentInfo.country}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, country: event.target.value})}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
