import React, { useContext } from 'react'
import {Routes,Route, Navigate } from 'react-router-dom'

import {AuthContext} from "../context/auth"

function AuthRoute({element:Component}){
    const  { user } =    useContext(AuthContext); 
     
     return  (  user ? <Navigate  to="/" /> : <>{ Component }</> )

  
}

export default     AuthRoute