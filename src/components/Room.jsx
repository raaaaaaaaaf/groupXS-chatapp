import React from 'react';
import Logo from '../assets/groupxs-logo.png'
import { signOut } from "firebase/auth"
import { auth } from "../firebase";
import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
}
from 'mdb-react-ui-kit';

function Room(props) {
  const { room } = props
  const { setRoom } = props
  const roomRef = useRef(null)
  const navigate = useNavigate()

    //Logout
  const logOut = async () => {
      await signOut(auth)
      setRoom(null)
    };

    const enterChat = () => {
      const roomName = roomRef.current.value.trim();
      if (roomName) {
        setRoom(roomName);
      } else {
        // handle case where room name is empty or invalid
        Swal.fire('Enter Chat Room...');
        navigate('/');
      }
    };
    
    useEffect(() => {
      if (room) {
        let timerInterval;
        Swal.fire({
          title: 'Loading...',
          html: 'I will close in <b></b> milliseconds.',
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const b = Swal.getHtmlContainer().querySelector('b');
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft();
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer');
          }
        });
        navigate('/chat');
      }
    }, [room]);
  

  return (
    <>
      <MDBNavbar light  bgColor='light'>
        <MDBContainer  className='d-flex justify-content-between'>
          <MDBNavbarBrand href='#'>
            <img
              src={Logo}
              height='30'
              alt=''
              loading='lazy'
            />
            
          </MDBNavbarBrand>

          <MDBIcon fas icon="sign-out-alt" onClick={logOut}/>
          
        </MDBContainer>
      </MDBNavbar>


    <MDBContainer fluid>

    <MDBRow className='d-flex justify-content-center align-items-center vh-100'>
      <MDBCol col='12'>

        <MDBCard className='bg-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '500px'}}>
          <MDBCardBody className='p-5 w-100 d-flex flex-column'>

            <h2 className="fw-bold mb-2 text-center">Enter Room Name</h2>
            
            <MDBInput 
            ref={roomRef}
            wrapperClass='mb-4 w-100' 
            id='formControlLg' 
            type='text' 
            size="lg"/>

            <MDBBtn 
            onClick={enterChat}
            size='lg'>
              Enter Chat
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>

      </MDBCol>
    </MDBRow>

  </MDBContainer>
  </>
)}

export default Room