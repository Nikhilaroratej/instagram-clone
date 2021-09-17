import React from 'react'
import "./Post.css"
import { useState ,useEffect} from 'react'
import Avatar from "@material-ui/core/Avatar"
import { db } from './Firebase'
import firebase from 'firebase'
import Uploader from './Uploader'
const Post = ({postId,username,user,caption,imgUrl}) => {
    const [comments,setComments]=useState([])
    const [comment,setComment]=useState('')

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe=db
            .collection("post")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            });
        }
        return ()=>{
            unsubscribe();
        };
    },[postId])
    const postComment=(event)=>{
        event.preventDefault();
        db.collection("post").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('')
    }
    return (
        <div className="postHead">
            <div className="posts">
            <div className="avatarsection">
            <Avatar
            className="avatarPost"
            alt={username}
            src="/static/images/avatar/1.jpg"
            />
            <h3>{username}</h3>
            </div>
            <img src={imgUrl}/>
            <h4><strong>{username}&nbsp;&nbsp;</strong>{caption}</h4>
            <div className="postcomment">
                {comments.map((comment)=>(
                    <p>
                        <strong>{comment.username}&nbsp;</strong>&nbsp;{comment.text}
                    </p>
                ))}
            </div>
            {user &&
                    <form className="commentbox">
                    <input
                    className="postinput"
                    type="text"
                    placeholder="Post comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    />
                    <button
                     className="postbutton"
                     disabled={!comment}
                     type="submit"
                     onClick={postComment}
                    >
                    Post
                    </button>
                </form> 
            }
            
        </div>
        </div>
    )
}

export default Post
