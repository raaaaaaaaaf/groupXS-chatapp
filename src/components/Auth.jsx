import React, { useState } from 'react';
import {auth, provider, storage, db} from '../firebase'
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import Swal from 'sweetalert2'
import Logo from "../assets/groupxs-logo.png"
import { doc, setDoc } from "firebase/firestore"; 
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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

export const Auth = () => {

    const navigate = useNavigate()

    // Google
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
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: 'Try Again!',
          
        })
          console.error(err);
      }
  }
  // Email and Password
    const handleLogin = async (e) => {
      e.preventDefault()
      const email = e.target[0].value;
      const password = e.target[1].value;

      try {
        await signInWithEmailAndPassword(auth, email, password)
        Swal.fire({
          icon: 'success',
          title: 'Login Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: 'Check your credentials!',
          
        })
        console.error(err);
      }
      navigate('/')
    }
    
    return (
    <>

    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center vh-100'>
        <MDBCol col='12'>
        <form onSubmit={handleLogin}>
          <MDBCard className='bg-white text-black my-5 mx-auto ' style={{borderRadius: '1rem', maxWidth: '400px'}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100 '>

              <img src={Logo}/>
              <p className="text-black-50 mb-5"></p>
              

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

                <MDBBtn 
                type='submit' 
                outline className='px-5  w-100' 
                color='black' 
                ze='lg'>
                    Login
                </MDBBtn>
              
              <div className='d-flex flex-row mt-3 mb-5'>
                <MDBBtn onClick={signInWithGoogle} tag='a' color='none' className='m-3' style={{ color: 'black' }}>
                  <MDBIcon fab icon='google' size="lg"/>
                </MDBBtn>
              </div>

              <div>
                <p className="mb-0">Don't have an account? <Link to="/signup" class="text-primary-50 fw-bold">Sign Up</Link></p>

              </div>
            </MDBCardBody>
          </MDBCard>
        </form>
        </MDBCol>
      </MDBRow>

    </MDBContainer>
    </>
    )
}
