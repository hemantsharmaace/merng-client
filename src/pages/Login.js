import React, { useState,useContext } from 'react'
import {Button, Form} from "semantic-ui-react" 
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useNavigate  } from "react-router";
import {AuthContext } from  "../context/auth"

import { useForm } from '../utils/hooks'

const Login = (props) => {
  const context = useContext(AuthContext)
  const [errors,setErrors] = useState([]) 
  const navigate = useNavigate();

  const  { onChange , onSubmit , values} = useForm(loginUserCallback, {
    username : "", 
    password : "", 
  })

  
  const [loginUser , { loading }] = useMutation(LOGIN_USER, {
    update(proxy,{data: { login : userData}}) { 
            // console.log(userData)
             context.login(userData)
            navigate('/'); 
     },
    onError(err) {
      if(err.graphQLErrors[0].extensions.errors) {
        setErrors(err.graphQLErrors[0].extensions.errors);
      }else {
         setErrors({"username" : err.graphQLErrors[0].message })
      }
    },
    variables :  values
  })

   function loginUserCallback() {
        loginUser()
   }

  return (
    <div className='form-container' >
    <Form onSubmit={onSubmit}  noValidate className={loading ? 'loading': ""}>
    <h1>Login</h1>
    <Form.Input label="Username" error={errors.username ? true : false }  placeholder="Username..." type="text" name="username" value={values.username} onChange ={onChange} />
     <Form.Input label="Password" error={errors.password ? true : false }  placeholder="Password..." type="password" name="password" value={values.password} onChange ={onChange} /> 
     <Button type='submit' primary>Login</Button>
    </Form>
    {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
        <ul className='list'>
          {Object.values(errors).map(value => {
            return  <li key={value}>{value}</li>
          })

          }
        </ul>
        </div> 
    )}
   
    </div>
  )
}

const LOGIN_USER = gql`
 mutation login( $username : String!  $password : String! ){  
      login( username : $username, password : $password){
        id 
        email 
        username  
        createdAt 
        token
      }
 }
`

export default Login