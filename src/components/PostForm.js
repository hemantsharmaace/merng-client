import React,{useState} from 'react'
import {Button,Form} from "semantic-ui-react"
import {useForm} from "../utils/hooks"
import gql from "graphql-tag"
import { FETCH_POSTS_QUERY } from '../utils/graphql'

import { useMutation  } from '@apollo/client'

const PostForm = () => {
    const [errors,setErrors] = useState([]) 

    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        body: ""
    })
   
    const [createPost,{error}] =  useMutation(CREATE_POST_MUTATION,{
      
        variables: values,
        update(proxy,results){
            console.log(results)
            const data = proxy.readQuery({
                query:FETCH_POSTS_QUERY
            });
            let  newData = [results.data.createPost, ...data.getPosts];
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data: {
                      ...data,
                       getPosts: {
                        newData,
                    }
                    }}) 
            values.body = ""
        },
        onError(err) { 
          setErrors([err.graphQLErrors[0].message]);
          console.log(errors)
        }

    })

    function createPostCallback(){
        
        createPost()
    }
   return (
    <>
      <Form onSubmit={onSubmit}>
        
        <Form.Field> 
        <Form.Input error={errors.length > 0 ? true : false }  placeholder="Hi world" name="body" onChange={onChange} value={values.body} /> 

        </Form.Field>
        <Button type='submit' color="teal">
            Submit
        </Button> 
      </Form>

     
    {Object.keys(errors).length > 0 && (
    <div className='ui error message'>
    <ul className='list'>
      {Object.values(errors).map((value,index) => {
        return  <li key={index}>{value}</li>
      })

      }
    </ul>
    </div> 
    )} </>
  )
}
 
const CREATE_POST_MUTATION = gql`
mutation createPost($body: String!){
   
   createPost(body:$body){
    id body createdAt username
    likes{
        id username createdAt
    }
    likeCount
    comments{
        id body username createdAt
    }
    commentCount
   }


}

`


export default PostForm