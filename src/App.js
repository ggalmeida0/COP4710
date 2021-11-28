import  { Login } from "./pages/Login"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from "./pages/Dashboard";
import SignUp from './pages/SignUp';
import {Checkout} from './pages/checkout/Checkout';


const App = () => {
  return (
    < BrowserRouter >
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={ <Login/> } />
          <Route path="/signup" element={ <SignUp/> } />
          <Route path="/checkout" element={<Checkout/>}/>
        </Routes>
    </ BrowserRouter >
  );
}

export default App;
