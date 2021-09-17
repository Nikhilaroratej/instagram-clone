import firebase from "firebase"
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAYPuuVGdVNpXGPIfQgd0Iz-d_K4EJ20wY",
    authDomain: "instagram-clone-fcfba.firebaseapp.com",
    projectId: "instagram-clone-fcfba",
    storageBucket: "instagram-clone-fcfba.appspot.com",
    messagingSenderId: "134022698666",
    appId: "1:134022698666:web:056501f127e16ce7a6a2d3",
    measurementId: "G-XL0MP4NJTZ"
  });
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
  export {db,auth,storage};