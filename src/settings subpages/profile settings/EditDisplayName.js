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

function EditDisplayName(props) {
    console.log(props); //props.auth.userProfile
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    let displayName = useRef(null);

    const [displayNameInput, setDisplayNameInput] = React.useState(null);
    const [clicked, setClicked] = React.useState(false)


    const handleClick = (e) => {
        if (displayName.current.value === "") {
            setDisplayNameInput(null);
        } else {
            setDisplayNameInput(displayName.current.value.toLowerCase().trim());
        }

        setClicked(true)
    };

    const CheckBlank = () => {
        return <p>Please enter a display name!</p>
    }

    const UPDATE_Name = gql `mutation update_user ($ID: Int!, $First_Name: String!) {
        update_User_by_pk(
            pk_columns: {User_ID: $ID}
            _set: {Display_Name: $First_Name
            }
        )
        {
            Display_Name
        }
    }`

    const SendData = () => {
        const [update_name, {data,loading,error}] = useMutation(UPDATE_Name);
        useEffect(() => {
            update_name({
                variables : {
                    ID: sessionStorage.getItem("userId"),
                    First_Name: displayNameInput
                }
            });
        }, []);

        if (loading)
            return <p>Updating your username...</p>

        if (data) {
            let userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
            userProfile.Display_Name = displayNameInput
            sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
            window.location.reload(false);
            return <p>Your username has been updated!</p>
        }
        return null


    }

    const VALIDATE_ACC = gql`query validateAcc ($Username: String!){
        User(where: {Display_Name: {_eq: $Username}}) {
            User_ID
        }
    }`

    const CheckData = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables : {Username : displayNameInput}
        });

        if (loading)
            return <p>Updating your username...</p>

        if ((/\s/.test(displayNameInput))) {
            return <e> Username cannot have spaces. </e>
        }

        if (data.User[0]){
            return <e> That username is already in use! Please select a different username. </e>
        }

        return <SendData/>

    }

    const handleKeypress = e => {
        //it triggers by pressing the enter key
        e.preventDefault();
        console.log(e)
        if (e.type === "submit") {
            handleClick();
        }
    };

    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <SignUpForm>
                    <Title>Edit Username</Title>
                    <Form onSubmit={handleKeypress}>
                        <Row theme={props.theme.theme} style={{marginBottom: '30px'}}>
                            {/* <label>Email:</label> */}
                            <input ref={displayName} type="text" placeholder="New Username"/>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Submit New Username</SubmitButton>
                            {displayNameInput !== null ? <CheckData/> : clicked && <CheckBlank/>}
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

export default connect(mapStateToProps)(EditDisplayName);

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