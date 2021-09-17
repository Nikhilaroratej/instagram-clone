import logo from './logo.svg';
import React from 'react';
import { useState,useEffect} from 'react';
import {db,auth} from "./Firebase"
import "./App.css"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Post from './Post';
import {Button,Input} from "@material-ui/core"
import Uploader from './Uploader';
import InstagramEmbed from "react-instagram-embed"
function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [post,setPost]=useState([])
  const [username,setUsername]=useState('')
  const [openSignin,setopenSignin]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [open,setOpen]=useState(false)
  const [user,setUser]=useState(null)
  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authuser)=>{
      if(authuser){
        console.log(authuser);
        setUser(authuser);
      }
      else{
        setUser(null)
      }
    })
    return ()=>{
      unsubscribe();
    }
  },[user,username])
  useEffect(()=>{
      db.collection("post").orderBy("timestamp","desc").onSnapshot((snapsort)=>{
        setPost(snapsort.docs.map((doc)=>({
          id:doc.id,
          post:doc.data()
        })))
      })
  },[])
  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password).then((authuser)=>{
      authuser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message))
    setOpen(false);
  }
  const signIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password).catch((error)=>{
      alert(error.message)
      setopenSignin(false);
    })
  }
  return (
   <div className="app">    
     {/* signup part */}
     <Modal
      open={open}
      onClose={()=>setOpen(false)}
    >
      <div style={modalStyle} className={classes.paper}>
        <form className="signup">
          <center>
          <img
          className="modalImage"
          src="https://th.bing.com/th/id/R.4b4d4a704321c935ec6b48c8c4c64d0d?rik=%2bAIP3srC8ZzaSQ&riu=http%3a%2f%2f1000logos.net%2fwp-content%2fuploads%2f2017%2f02%2fInstagram-app-logo.jpg&ehk=3yEi%2b4NelrIDb7cVAQXmrv4YuRIdQsC%2fASwmqGi70%2bk%3d&risl=&pid=ImgRaw"
          alt="logo" 
          />
          </center><br/>
          <hr/><br/>
          <Input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          />
          <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
      </div>
    </Modal>
{/* sign in part */}
    <Modal
      open={openSignin}
      onClose={()=>setopenSignin(false)}
    >
      <div style={modalStyle} className={classes.paper}>
        <form className="signup">
          <center>
          <img
          className="modalImage"
          src="https://th.bing.com/th/id/R.4b4d4a704321c935ec6b48c8c4c64d0d?rik=%2bAIP3srC8ZzaSQ&riu=http%3a%2f%2f1000logos.net%2fwp-content%2fuploads%2f2017%2f02%2fInstagram-app-logo.jpg&ehk=3yEi%2b4NelrIDb7cVAQXmrv4YuRIdQsC%2fASwmqGi70%2bk%3d&risl=&pid=ImgRaw"
          alt="logo" 
          />
          </center>
          <hr/>
          <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
      </div>
    </Modal>
     <div className="appHeader">
       <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"/>
       {user ? (<button className="logoutbtn" onClick={()=>auth.signOut()}>Log out</button>):
     (<div className="usersignin">
        <button className="signinbtn" onClick={()=>setopenSignin(true)}>Sign In</button>
        <button className="signupbtn" onClick={()=>setOpen(true)}>Sign Up</button>
     </div>)
     }
     </div>
     <div className="uploaderhead">
     {user?.displayName?(
        <Uploader username={user.displayName}/>
     ):(
       <h3 className="error">You are not able to comment or upload any posts please login</h3>
     )
     }
     </div>
     {
       post.map(({id,post})=>(
         <Post
         key={id}
         postId={id}
         user={user}
         username={post.username}
         caption={post.caption}
         imgUrl={post.imgUrl}
         />
       ))
     }
    
   </div>
  );
}

export default App;