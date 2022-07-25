import React, { useContext,useState,useRef } from 'react'
import gql  from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { Image,Grid, Card, Button, Icon, Label,Form } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from "../components/DeleteButton"
import { Navigate, useNavigate,useParams } from 'react-router-dom';
import MyPopUp from '../utils/MyPopUp';
 
const SinglePost = () => {
   
    let params = useParams();

    const {user} = useContext(AuthContext)
    const commentInputRef = useRef(null)
    const navigate = useNavigate();
    const [comment,setComment] = useState('')
    const postId = params.postId;
    const {data: {getPost} = {}}  = useQuery( FETCH_POST_QUERY, {
        variables : {
            postId: postId
        }
    }   )

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION,{
        update(proxy,result) {
            setComment('')
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body:comment
        }
         

    })

   

    function deletePostCallback(){
        navigate("/")
    }
    let postMarkup;
     if(!getPost){
        postMarkup = <p>Loading post....</p>
    } else {

        const {id , body,createdAt, username,comments, likes, likeCount, commentCount} = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                    <Image
                    floated='right'
                    size='small'
                    src='/images/avatar/large/steve.jpg'
                    float="right"
                     /> 
                    </Grid.Column>
                    <Grid.Column width={10}>
                     <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                {username}
                            </Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr />
                         <Card.Content extra>

                        <LikeButton user={user} post={{id,likeCount,likes}} />
                        <MyPopUp content="Comments on the post">
                        <Button as="div" labelPosition='right' onClick={() => console.log("comment on post")}><Button basic  color='blue'>
                            <Icon name="comments" />
                            </Button>
                            <Label basic color='blue' pointing="left">{commentCount}</Label>
                            </Button> 
                            </MyPopUp>
                            {user && user.username == username && ( 
                            <DeleteButton postId={id} callback={deletePostCallback}/> 
                          )}
                         </Card.Content>
                     </Card>
                     {user && (

                        <Card fluid>
                            <Card.Content>
                            <p> Post a comment</p>
                            <Form>
<div className='ui action input fluid'> 
<input type="text" placeholder='Enter comment' name="comment"  value={comment} onChange={(event)=> setComment(event.target.value)} ref={commentInputRef} />
<button type='submit' onClick={submitComment} className="ui button teal" disabled ={comment.trim() == ""}>SUBMIT</button>
</div>
                      
                            </Form>
                            </Card.Content>
                        </Card>
                     )}
                     {comments.map(comment => {
                      return  <Card fluid key={comment.id}> 
                            <Card.Content>
                                {user && user.username == comment.username && (

                                    <DeleteButton postId={id}  commentId ={comment.id}/>
                                )}
                                <Card.Header>
                                    {comment.username}
                                </Card.Header>
                                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{comment.body}</Card.Description>
                            </Card.Content>
                        </Card>
                     })}
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        )
    }

  return  postMarkup
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId){
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }

`

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body : String!) {
        createComment(postId: $postId, body: $body){
            id
            comments {
                id body createdAt username
            } 
            commentCount
        }
    }

`
export default SinglePost