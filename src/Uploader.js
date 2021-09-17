import React from 'react'
import { useState } from 'react'
import { Button } from '@material-ui/core'
import { storage,db } from './Firebase'
import firebase from 'firebase'
import "./Uploader.css"
const Uploader = ({username}) => {
    const [caption,setCaption]=useState('')
    const [progress,setProgress]=useState(0)
    const [image,setImage]=useState(null)
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload=()=>{
        const uploadTask=storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress=Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error)=>{
                alert(error.message);
            },
            ()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("post").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imgUrl:url,
                        username:username
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                });
            }
        )
    }
    return (
        <div className="uploader">
            <progress className="progressbar" value={progress} max="100"/>
            <input type="text" placeholder="About the post" onChange={(e)=>setCaption(e.target.value)}/>
            <input type="file" onChange={handleChange}/>
            <button className="uploadbtn" onClick={handleUpload}>
                Upload Post
            </button> 
        </div>
    )
}

export default Uploader
