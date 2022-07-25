import React, { useContext, useState } from 'react'
import {Button, Form} from "semantic-ui-react" 
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { AuthContext } from '../context/auth'
import { useForm } from '../utils/hooks'
import { useNavigate  } from "react-router";

const Register = (props) => {
  const [errors,setErrors] = useState([])
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const  { onChange , onSubmit , values} = useForm(registerUser, {
    username : "",
    email :"",
    password : "",
    confirmPassword : ""
  })
 
  const [addUser , { loading }] = useMutation(REGISTER_USER, {
    update(proxy,{data : { register : userData}}) {
       context.login(userData)
       navigate('/'); 

    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors)
      setErrors(err.graphQLErrors[0].extensions.errors)
    },
    variables :  values
  })

   function registerUser() {
     addUser()
   }

  return (
    <div className='form-container' >
    <Form onSubmit={onSubmit}  noValidate className={loading ? 'loading': ""}>
    <h1>Register</h1>
    <Form.Input label="Username" error={errors.username ? true : false }  placeholder="Username..." type="text" name="username" value={values.username} onChange ={onChange} />
    <Form.Input label="Email" error={errors.email ? true : false } placeholder="Email..."  type="email" name="email" value={values.email} onChange ={onChange} /> 
    <Form.Input label="Password" error={errors.password ? true : false }  placeholder="Password..." type="password" name="password" value={values.password} onChange ={onChange} /> 
    <Form.Input label="Confirm Password" error={errors.confirmPassword ? true : false }   placeholder="Confirm Password..." type="password"  name="confirmPassword" value={values.confirmPassword} onChange ={onChange} /> 
    <Button type='submit' primary>Register</Button>
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

const REGISTER_USER = gql`
 mutation register(
  $username : String!
  $email : String!
  $password : String!
  $confirmPassword : String!
 ){
  register(
    registerInput : {
      username : $username,
      email : $email,
      password : $password,
      confirmPassword: $confirmPassword
    }
  ){
    id email username  createdAt token
  }
 }

`

export default Register