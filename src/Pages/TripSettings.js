import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { signInWithGoogle } from "../Firebase/firebase";
import Google from '../Images/Icons/Google.png';
import { store } from '../store/TripUsStore';
import {gql, useMutation, useQuery} from "@apollo/client";

function TripSettings(props) {
    console.log(props); //props.auth.userProfile
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    function handleLogOut() {
        store.dispatch({type: 'IS_AUTHENTICATED', payload: false });
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userProfile');
        sessionStorage.removeItem('GroupInfo');
        history("/");
    }
 
    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <SignUpForm>
                    <Title>Settings</Title>
                    <Form>
                        <Row theme={props.theme.theme} style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* <label>Email:</label> */}
                            <Button onClick={() => handleRoute('/tripName')}> Edit Trip Name</Button>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <Button onClick={() => handleRoute('/tripBio')}> Edit Trip Bio</Button>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <Button onClick={() => handleRoute('/tripSD')}> Edit Trip Start Date</Button>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <Button onClick={() => handleRoute('/tripED')}> Edit Trip End Date</Button>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <Button onClick={() => handleRoute('/tripDept')}> Edit Trip Departure</Button>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <Button onClick={() => handleRoute('/tripDest')}> Edit Trip Destination</Button>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <Button onClick={() => handleRoute('/tripImage')}> Change Trip Image</Button>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <Button style={{backgroundColor: '#AC9F3C'}} onClick={() => handleRoute('/myTrips')}> Back to My Trips </Button>
                        </Row>
                    </Form>
                </SignUpForm>
            </Content>
            <Footer />
        </Container>
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(TripSettings);

const Container = styled.div`
`;

const Content = styled.div`
    display: flex;
    padding: 0 10%;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
`;

const SignUpForm = styled.div`
    margin: 150px auto;
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    border-radius: 4px;
    padding: 25px 100px 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    
    p {
        margin: 0;
    }
`;

const Title = styled.p`
    font-size: 36px;
    margin: 0 0 50px 0;
    font-weight: 700;
`;

const Form = styled.form`
    width: 100%;
    margin-top: 20px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    label {
        margin-bottom: 10px;
    }

    input {
        border: none;
        outline: none;
        padding: 5px;
        font-size: 18px;
        border-bottom: solid 1px ${({ theme }) => theme.text};
        background-color: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        margin-right: 30px;
        transition: 600ms;
        font-size: 14px;

        &::placeholder {
            color: ${({ theme }) => theme.text};
            margin-left: 0;
        }

        &:hover {
            border-bottom: solid 2px green;
            transform: scale(1.1);
            margin-left: 20px;
            transition: 600ms;
        }  
    } 

    input[type="date"]::-webkit-calendar-picker-indicator {
        background-color: grey;
        border-radius: 50%;
        padding: 5px;
    }

    input[type="file"] {
        width: max-content;
    }

    p {
        text-align: center;
        color: red;
    }

    select {
        width: 130px;
        border-radius: 5px;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        padding: 5px;
    }
`;

const GoogleButton = styled.div`
    width: max-content;
    border: 2px solid #4285f4;
    padding: 5px 30px;
    border-radius: 45px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 300ms;
    background-color: #4285f4;
    margin: 20px 0;

    p {
        margin-left: 20px;
        font-size: 16px;
        color: white;
        font-weight: 700;
    }
    
    img {
        width: 25spx;
        height: 25px;
        border-radius: 50%;
        background-color: white;
    }

    :hover {
        opacity: .8;
        transition: 300ms;
    }
`;
const Button = styled.a`
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    background-color: #308446;
    transition: 600ms;
    cursor: pointer;
    display: flex;
    justify-content: center;
    width: 300px;
    margin-top: 10px;

    &:hover {
        transition: 600ms;
        transform: scale(1.2);
    }
`;

const Login = styled.p`
    text-decoration: underline;
    cursor: pointer;
`;