import React from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import TripNav from "../Components/TripNav";

function ExcursionDetails(props) {
    console.log(props); //props.auth.userProfile
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }



    let myButton;
    if (true) {
        myButton = <Button onClick={() => handleRoute('/addExcursion')}> Add Plans</Button>;
    } else {
        myButton = <Button onClick={() => handleRoute('/editExcursion')}> Edit Plans</Button>;
    }


    return (
        <Container>
            
            <Nav />
            <Content theme={props.theme}>
            <TripNav />
                <SignUpForm>
                    <Title>Excursion Details</Title>
                    <Form>
                    
                    
                        <Row theme={props.theme.theme} style={{ display: 'flex', flexDirection: 'row' }}>
                            {myButton}
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

export default connect(mapStateToProps)(ExcursionDetails);

const Container = styled.div`
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 80px 10%;
    //align-items: center;
    gap: 10px;
    min-height: 100vh;
`;  

const SignUpForm = styled.div`
    margin: 60px auto;
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
    align-items: center;
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