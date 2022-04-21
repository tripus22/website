import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../../Components/Nav";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router";
import { signInWithGoogle } from "../../Firebase/firebase";
import Google from '../../Images/Icons/Google.png';
import { store } from '../../store/TripUsStore';
import {gql, useMutation, useQuery} from "@apollo/client";

function ChangeTripName(props) {
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    let tripName = useRef(null);

    const [tripNameInput, setTripNameInput] = React.useState(null); //image
    const [clicked, setClicked] = React.useState(false)

    const handleClick = (e) => {
        if (tripName.current.value === "") {
            setTripNameInput(null);
        } else {
            setTripNameInput(tripName.current.value);
        }
        setClicked(true)
    };

    const CheckBlank = () => {
        return <e>Please enter a trip name!</e>
    }

    const UPDATE_TRIP_NAME = gql `mutation updateTrip ($Trip_ID: Int!, $Trip_Name: String!) {
        update_Trip_by_pk(
          pk_columns: {Trip_ID: $Trip_ID}
        _set: {Trip_Name: $Trip_Name
        }
    )
        {
            Trip_Name
        }
    }`

    const SendData = () => {
        // console.log(tripNameInput)
        const [update_trip_name, {data,loading,error}] = useMutation(UPDATE_TRIP_NAME);
        useEffect(() => {
            update_trip_name({
                variables : {
                    Trip_ID: props.auth.tripInfo.Trip_ID,
                    Trip_Name: tripNameInput
                }
            });
        }, []);

        if (loading)
            return <p>Changing trip name...</p>
        if (data) {
            setTimeout(function(){
                return <p>Trip updated!</p>
            },10000)
            handleRoute('/TripSettings')
        }
    
        return null

    }

    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <SignUpForm>
                    <Title>Change Trip Name</Title>
                    <Form>
                       
                        <Row theme={props.theme.theme} style={{marginTop: '30px'}}>
                            <label>Enter Trip Name</label>
                            <input ref={tripName} type="text" placeholder="Enter Trip Name:"/>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Submit</SubmitButton>
                            {tripNameInput !== null && clicked
                            ? <SendData/> : clicked && <CheckBlank/>}
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

export default connect(mapStateToProps)(ChangeTripName);

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
        color: green;
    }
    e {
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

const SubmitButton = styled(GoogleButton)`
    width: 100%;
    background-color: #308446;
    border: 2px solid #308446;
    display: flex;
    justify-content: center;
    font-weight: 700;
    color: white;
`;

const Login = styled.p`
    text-decoration: underline;
    cursor: pointer;
`;