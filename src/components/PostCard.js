import React, {useContext} from 'react'
import { Button, Card, Image,Icon,Label , Popup} from 'semantic-ui-react'
import moment from "moment"
import {Link} from "react-router-dom"
import LikeButton from "./LikeButton"
import { AuthContext } from '../context/auth'
import DeleteButton from "./DeleteButton"
const PostCard = ({post  : {body,createdAt ,id , username , likeCount,commentCount,likes}}) => {

  const {user} = useContext(AuthContext)


 function commentOnPost(){
    
 }
  return (
    <Card fluid>
    <Card.Content>
      <Image
        floated='right'
        size='mini'
        src='/images/avatar/large/steve.jpg'
      />
      <Card.Header>{username}</Card.Header>
      <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
      <Card.Description>
        {body}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
    <LikeButton user={user} post={{id,likes,likeCount}}/> 
    <Popup
    content="Comment on the post" inverted trigger ={
      <Button   labelPosition='right' as={Link} to={`/posts/${id}`} onClick={commentOnPost}>
      <Button color='blue' basic>
        <Icon name='comments' /> 
      </Button>
      <Label  basic color='blue' pointing='left'>
        {commentCount}
      </Label>
    </Button> 
    }
    />
 
    {user && user.username == username && (
    
                                
        <DeleteButton postId={id} />
 
    )}
    </Card.Content>
  </Card>
  )
}

export default PostCard