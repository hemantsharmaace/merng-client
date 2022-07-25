import React from 'react'
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { Container } from 'semantic-ui-react'
import { AuthProvider } from "./context/auth"
import MenuBar from './components/MenuBar';
import AuthRoute  from './utils/AuthRoute';
import SinglePost from './pages/SinglePost';
function App() {
  return (  
    <AuthProvider>
      <Router>
      <Container>
      <MenuBar /> 
          <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/login' element={<AuthRoute  element={<Login />} />} />

              <Route exact path='/register' element={<AuthRoute  element={<Register />} />} />
              <Route exact path='/posts/:postId' element={<SinglePost />} />

            </Routes> 
            </Container>
        </Router>  
      </AuthProvider>
  );
}

export default App;
