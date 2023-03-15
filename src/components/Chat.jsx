import { useEffect, useRef, useState } from "react"
import { addDoc, collection, onSnapshot, query, serverTimestamp, where, orderBy } from 'firebase/firestore'
import Logo from "../assets/groupxs-logo.png"
import { signOut } from "firebase/auth"
import { auth, db } from "../firebase"
import React from "react";
import { nanoid } from "nanoid";
import { Link, useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBBtn,
    MDBCardFooter,
    MDBInputGroup,
    MDBNavbar,
    MDBNavbarBrand,
    MDBIcon
  } from "mdb-react-ui-kit";


export const Chat = (props) => {
    const { room } = props
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const messageRef = collection(db, "messages")
    const ref = useRef()
    const navigate = useNavigate()
    
    if (room === ""){
        navigate('/')
    }
    useEffect(() => {
        ref.current?.scrollIntoView({behavior:"smooth"})
    }, [messages])


    useEffect(()=> {
        
        const queryMessages = query(
            messageRef, 
            where("room", "==", room),
            orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            
            let messages = []
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id})
            })
            setMessages(messages)

        })
        return () => unsubscribe()
    }, [room])

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (newMessage === "") return;

        await addDoc(messageRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
            room: room,
            id: nanoid()
        })
        
        setNewMessage("")
        
    }
    const logOut = async () => {
        await signOut(auth)
        setRoom(null)
      };
    
    return (
    <>
    {/* navbar */}
    <MDBNavbar light  bgColor='light'>
        <MDBContainer className='d-flex justify-content-between'>
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

      {/* Chat */}
    <MDBContainer fluid className="py-5 vh-100 ">
        <MDBRow className="d-flex justify-content-center ">
            <MDBCol md="8" lg="6" xl="4">
            <MDBCard >
                <MDBCardHeader
                className="d-flex justify-content-between align-items-center p-3"
                style={{ borderTop: "4px solid #ffa900" }}
                >
                <h5 className="mb-0">{room.toUpperCase( )}</h5>
                <div className="d-flex flex-row align-items-center">
                <Link to='/'>
                    <MDBIcon
                    fas
                    icon="times"
                    size="xs"
                    className="me-3 text-muted"
                    />
                </Link>
                </div>
                </MDBCardHeader>
    <div style={{position: "relative", height: "400px", overflowY:"scroll"}}>
        
        {messages.map((message) => (
            
                    <MDBCardBody ref={ref} key={message.id}>
                    {message.user === auth.currentUser.displayName ? (    
                    <>

                    <div className="d-flex justify-content-end">
                        <p className="small mb-1">{message.user}</p>
                        </div>
            
                        <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                        <div>
                            <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-warning">
                            {message.text}
                            </p>
                        </div>
                        <img
                            src={message.photoURL}
                            alt="avatar 1"
                            className='img-fluid rounded-pill'
                            style={{ width: "45px", height: "100%" }}
                        />
                    </div>

                    </>) : (     
                    <>
                    <div className="d-flex justify-content-between">
                        
                        <p className="small mb-1">{message.user}</p>
                        </div>
                        <div className="d-flex flex-row justify-content-start">
                        <img
                            src={message.photoURL}
                            alt="avatar 1" 
                            className='img-fluid rounded-pill'
                            style={{ width: "45px", height: "100%" }}
                        />
                        <div>
                            <p
                            className="small p-2 ms-3 mb-3 rounded-3"
                            style={{ backgroundColor: "#f5f6f7" }}
                            >
                            {message.text}
                            </p>
                        </div>
                    </div>
                    </>)}




       </MDBCardBody>
        ))}
    </div>
                <form onSubmit={handleSubmit}>
                <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                
                <MDBInputGroup className="mb-0">
                    <input
                    className="form-control"
                    placeholder="Type message"
                    type="text"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    />
                    <MDBBtn className="ms-3" type='submit'  color="warning" style={{ paddingTop: ".55rem" }}>
                    <MDBIcon fas icon="paper-plane" />
                    </MDBBtn>
                </MDBInputGroup>
                </MDBCardFooter>
                </form>
            </MDBCard>
            </MDBCol>
        </MDBRow>
    </MDBContainer>
    </>
    )
}