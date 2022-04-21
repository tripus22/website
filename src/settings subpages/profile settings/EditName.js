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

function EditName(props) {
    console.log(props); //props.auth.userProfile
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleClick();
        }
    }

    let firstName = useRef(null);
    let lastName = useRef(null);

    const [firstNameInput, setFirstNameInput] = React.useState(null);
    const [lastNameInput, setLastNameInput] = React.useState(null);
    const [clicked, setClicked] = React.useState(false)

    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })


    const handleClick = (e) => {
        if (firstName.current.value === "") {
            setFirstNameInput(null)
        } else {
            setFirstNameInput(firstName.current.value);
        }

        if (lastName.current.value === "") {
            setLastNameInput(null);
        } else {
            setLastNameInput(lastName.current.value);
        }

        setClicked(true)
    };

    const CheckBlank = () => {
        return <e>Please fill in first and last name!</e>
    }

    const UPDATE_Name = gql `mutation update_user ($ID: Int!, $First_Name: String!, $Last_Name: String!) {
        update_User_by_pk(
            pk_columns: {User_ID: $ID}
            _set: {First_Name: $First_Name, Last_Name: $Last_Name
            }
        )
        {
            First_Name
            Last_Name
        }
    }`

    const SendData = () => {
        const [update_name, {data,loading,error}] = useMutation(UPDATE_Name);
        useEffect(() => {
            update_name({
                variables : {
                    ID: sessionStorage.getItem("userId"),
                    First_Name: firstNameInput, 
                    Last_Name: lastNameInput
                }
            });
        }, []);

        if (loading)
            return <p>Updating your name...</p>

        if (data) {
            let userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
            userProfile.First_Name = firstNameInput
            userProfile.Last_Name = lastNameInput
            sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
            window.location.reload(false);
            return <p>Your name has been updated!</p>
        }
        return null


    }

    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <SignUpForm>
                    <Title>Change Name</Title>
                    <Form>
                        <Row theme={props.theme.theme} style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* <label>Email:</label> */}
                            <input ref={firstName} onKeyDown={handleKeyDown} type="text" placeholder="Enter First Name"/>
                            <input ref={lastName} onKeyDown={handleKeyDown} type="text" placeholder="Enter Last Name"/>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Submit New Name</SubmitButton>
                            {firstNameInput !== null && lastNameInput !== null ? <SendData/> : clicked && <CheckBlank/>}

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

export default connect(mapStateToProps)(EditName);

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