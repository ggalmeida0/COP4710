import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DatePicker from '@mui/lab/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { GRAPHQL_SERVER } from '../env';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { sha256 } from 'js-sha256';
import { useDispatch} from 'react-redux';
import { LOGGED_IN } from '../redux/appReducer';
import {useNavigate} from 'react-router-dom';


const theme = createTheme();

export default function SignUp() {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [value, setValue] = React.useState();
  const [usernameExists , updateUsernameExists] = React.useState(false);
  const handleDatePicker = (newValue) => setValue(newValue);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = `
      mutation {
        signUp(
          user:{
            username: "${data.get("username")}"
            name: "${data.get("name")}"
            passwordHash: "${sha256(data.get("password"))}"
            phone: "${data.get("phone")}"
            email: "${data.get("email")}"
            dob: "${data.get("dob")}"
          }
      )}
    `
    axios.post(
      GRAPHQL_SERVER,
      { query: query }
      ).then((result)=>{
        if (!result.data.signUp) updateUsernameExists(true);
        else {
          dispatch({type: LOGGED_IN, payload:data.get('username')});
          navigateTo('/');
        }
      }).catch((error)=> console.error(error)
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    error={usernameExists}
                    helperText={usernameExists ? "username already exists" : ""}
                    onChange={() => updateUsernameExists(false)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    type="phone"
                    id="phone"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                  <DatePicker
                    label="Date of Birth"
                    inputFormat="yyyy-MM-dd"
                    value={value}
                    onChange={handleDatePicker}
                    renderInput={(params) => <TextField {...params} sx={{ mt: 2}} name="dob"/>}
                    mask="____-__-__"
                  />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
