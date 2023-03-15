import React, { useState, useEffect } from 'react';
import {auth, provider, storage, db} from '../firebase'
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import Swal from 'sweetalert2'
import Logo from "../assets/groupxs-logo.png"
import Add from '../assets/addAvatar.png'
import { doc, setDoc } from "firebase/firestore"; 
import {  ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,

}
  from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';


export const SignUp = () => {

    const navigate = useNavigate()


    const signInWithGoogle = async(e) => {
      e.preventDefault()

      try {
      const res =await signInWithPopup(auth, provider)
      // Get the authenticated user and their photo URL
      const user = auth.currentUser;
      const photoUrl = user.photoURL;

      // Upload the photo to Firebase Storage
      const fileName = `${user.uid}-${new Date().getTime()}`;
      const storageRef = ref(storage, fileName);
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        const uploadTask = uploadBytes(storageRef, blob);

        // Save the download URL in Firestore
        uploadTask.then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            
            setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: downloadURL
            }, { merge: true });
          });
        });
      };
      xhr.open('GET', photoUrl);
      xhr.send();
      navigate('/')
      } catch(err) {
          console.error(err);
      }
  }

    const handleRegister = async (e) => {
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

    try {

        const res = await createUserWithEmailAndPassword(auth, email, password)
      //Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(

            (error) => {
              Swal.fire(
                'Error...',
                'Input all fields',
                'question'
              )
            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
                    await updateProfile(res.user,{
                        displayName,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db,"users", res.user.uid),{
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL
                    })
                });
               
            }
        );
      } catch(err){
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: 'Check your credentials!',
          
        })
      }
            navigate('/')
    };

    return (
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center vh-100'>
        <MDBCol col='12'>
        <form onSubmit={handleRegister}>
          <MDBCard className='bg-white text-black my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <img src={Logo}/>
              <p className="text-black-50 mb-5"></p>
              
                <MDBInput 
                wrapperClass='mb-4 mx-5 w-100' 
                labelClass='text-black' 
                label='Display Name' 
                id='formControlLg' 
                type='text' 
                size="lg"/>

                <MDBInput 
                wrapperClass='mb-4 mx-5 w-100' 
                labelClass='text-black' 
                label='Email address' 
                id='formControlLg' 
                type='email' 
                size="lg"/>

                <MDBInput 
                wrapperClass='mb-4 mx-5 w-100' 
                labelClass='text-black' 
                label='Password' 
                id='formControlLg' 
                type='password' 
                size="lg"/>

                <MDBInput 
                style={{display:"none",}}
                id='file' 
                type='file' 
                className=''
                />
                <label htmlFor="file">
                <img style={{width: "32px"}} src={Add}/>
                <span>Add an avatar</span>
                </label>
                <br></br>
                <MDBBtn  
                type='submit' 
                outline className='px-5  w-100' 
                color='black' 
                size='lg'>
                    Sign Up
                </MDBBtn>
               
                
              <div className='d-flex flex-row mt-3 mb-5'>
                <MDBBtn 
                onClick={signInWithGoogle} 
                tag='a' color='none' 
                className='m-3' 
                style={{ color: 'black' }}>
                  <MDBIcon fab icon='google' size="lg"/>
                </MDBBtn>
              </div>

              <div>
                <p className="mb-0">Already have an account? <Link to="/" class="text-primary-50 fw-bold">Login</Link></p>

              </div>
            </MDBCardBody>
          </MDBCard>
        </form>
        </MDBCol>
      </MDBRow>

    </MDBContainer>
    )
}
