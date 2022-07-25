import React ,{useState} from 'react'
import gql from 'graphql-tag'
import { Button, Icon, Confirm } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import { FETCH_POSTS_QUERY } from '../utils/graphql'
import MyPopUp from '../utils/MyPopUp'
const DeleteButton = ({postId, commentId, callback}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);


    const mutation  = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation,{
        update(proxy){
            setConfirmOpen(false);
            //TODO remove post from cache
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
 
            if(!commentId){
              let newData = [...data.getPosts];
              newData = [data.getPosts, ...newData];
              proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  ...data,
                  getPosts: {
                    newData,
                  },
                },
              });
            }
          if(callback){
                      callback();
                }
        },
        variables: {
            postId,
            commentId
        }
    })

  return (
    <>
        <MyPopUp
    content={commentId?"Delete Comment" : "Delete Post"} >

    <Button as="div" color='red' floated='right' onClick={() =>setConfirmOpen(true)} >
        <Icon name='trash' style={{margin:0}} />
    </Button> 

    </MyPopUp>
    
    
    <Confirm open={confirmOpen} onCancel={()=>setConfirmOpen(false)} onConfirm={deletePostOrComment} />
    </>
  )
}


const DELETE_POST_MUTATION = gql`
mutation deletePost($postId : ID! ) {
    deletePost(postId: $postId)
} 
`


const DELETE_COMMENT_MUTATION = gql`
mutation deleteComment($postId : ID!, $commentId : ID! ) {
    deleteComment(postId: $postId,commentId: $commentId){
      id
      comments{
        id username createdAt body
      }
      commentCount
    }
} 
`
export default DeleteButton