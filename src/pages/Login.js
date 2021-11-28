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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { LOGGED_IN } from '../redux/appReducer';
import { GRAPHQL_SERVER } from '../env';
import { sha256 } from 'js-sha256';
import { useNavigate } from 'react-router';


const theme = createTheme();

export const Login = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [failedLogin, updateFailedLogin] = React.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = 
      `{
        login(username: "${data.get('username')}" passwordHash: "${sha256(data.get('password'))}")
      }`;
    axios.post(GRAPHQL_SERVER, {query:query}).then(
      (result) => {
        if (result.data.data.login){
          dispatch({ type:LOGGED_IN, payload: data.get('username')});
          navigateTo('/')
        }
        else updateFailedLogin(true);
      }).catch((err) => console.error(err));
  };
  return (
    <ThemeProvider theme={theme}>
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
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username" label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              error={failedLogin}
              onChange={() => updateFailedLogin(false)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={failedLogin}
              helperText={failedLogin ? "invalid credentials" : ""}
              onChange={() => updateFailedLogin(false)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
