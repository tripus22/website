import React, {useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import {signInWithGoogle} from "../Firebase/firebase";
import Google from '../Images/Icons/Google.png';
import {gql, useQuery} from "@apollo/client";
import { store } from '../store/TripUsStore';

function Login(props) {
    console.log(props);
    let password = useRef(null);
    let email = useRef(null);

    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleClick();
        }
    }

    const VALIDATE_ACC = gql`query validateAcc ($Email: String!, $Password: String!){
        User(where: {Email: {_eq: $Email}, Password: {_eq: $Password}}) {
            User_ID,
            First_Name,
            Last_Name,
            Display_Name,
            Profile_Image,
            Email,
            User_DOB,
            Impairments,
            Dependents,
            Bio,
            Gender,
            Roles,
        }
    }`

    const VALIDATE_GOOGLE_ACC = gql`query validateAcc ($Email: String!){
        User(where: {Email: {_eq: $Email}}) {
            User_ID,
            First_Name,
            Last_Name,
            Display_Name,
            Profile_Image,
            Email,
            User_DOB,
            Impairments,
            Dependents,
            Bio,
            Gender,
            Roles,
        }
    }`

    const [emailInput, setEmailInput] = React.useState(null);
    const [passwordInput, setPasswordInput] = React.useState(null);
    let [googleEmail, setGoogleEmail] = React.useState(null)
    const [clicked, setClicked] = React.useState(false)

    const handleGoogleClick = async (e) => {
        googleEmail = await signInWithGoogle()
        if (googleEmail === null) {
            setGoogleEmail(null)
        } else {
            setGoogleEmail(googleEmail);
        }

    }

    const CheckGoogleUser = () => {
        const {data, error, loading} = useQuery(VALIDATE_GOOGLE_ACC, {
            variables : {Email : googleEmail}
        });

        if(loading) {
            return <p>Signing in...</p>
        }

        if(error) {
            return <e>{error}</e>;
        }

        if(data.User[0]){
            console.log(data);
            store.dispatch({type: 'IS_AUTHENTICATED', payload: true})
            store.dispatch({type: 'USER_PROFILE', payload: data.User[0]})
            sessionStorage.setItem('isAuthenticated', true);
            sessionStorage.setItem('userProfile', JSON.stringify(data.User[0]));
            handleRoute('/myGroups');
        } else {
            return <p style={{ color: 'red', marginBottom: '5px'}}>You have not signed up yet!</p>;
        }

        return null;
    }

    const handleClick = (e) => {
        setClicked(true)
        if (email.current.value === "") {
            setEmailInput(null)
        } else {
            setEmailInput(email.current.value.trim());
        }

        if (password.current.value === "") {
            setPasswordInput(null);
        } else {
            setPasswordInput(password.current.value);
        }
    };


    function validateEmail (email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    const CheckBlank = () => {
        return <e>Fields cannot be blank!</e>
    }

    const CheckUser = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables : {Email : emailInput, Password : passwordInput}
        });

        if(loading) {
            return <p style={{color: '#308446'}}>Signing in...</p>
        }

        if(error) {
            return <e>{error}</e>;
        }

        if(data.User[0]){
            store.dispatch({type: 'IS_AUTHENTICATED', payload: true})
            store.dispatch({type: 'USER_PROFILE', payload: data.User[0]})
            sessionStorage.setItem('isAuthenticated', true);
            sessionStorage.setItem('userProfile', JSON.stringify(data.User[0]));
            handleRoute('/myGroups');
        } else if (!validateEmail(emailInput)) {
            return <e>Please enter a valid email</e>
        } else {
            return <e>Wrong Password or Email!</e>;
        }

        return null;
    }

    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <LoginForm>
                    <Title>Login</Title>
                    <Form>
                        <Row theme={props.theme.theme}>
                            {/* <label>Email:</label> */}
                            <input ref={email} type="text" name="email" onKeyDown={handleKeyDown} placeholder="Email:"/><br></br>
                        </Row>
                        <Row theme={props.theme.theme}>
                            {/* <label>Password:</label> */}
                            <input ref={password} type="password" name="password" onKeyDown={handleKeyDown} placeholder="Password:" /><br></br>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Submit</SubmitButton>
                            {emailInput !== null && passwordInput !== null
                                ? <CheckUser/> : clicked && <CheckBlank/>}
                        </Row>

                    </Form>
                    <p>or</p>
                    <GoogleButton onClick={handleGoogleClick}>
                        <img src={Google} alt="Google"/>
                        <p>Sign in with Google </p>
                    </GoogleButton>
                    {googleEmail !== null && (<CheckGoogleUser/>)}
                    <SignUp onClick={() => handleRoute('/signup')}>
                        Don't Have A TripUs Account?
                    </SignUp>
                </LoginForm>
            </Content>
            <Footer />
        </Container>
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Login);

const Container = styled.div`
`;

const Content = styled.div`
    display: flex;
    padding: 0 10%;
    height: 100vh;
    justify-content: center;
    align-items: center;
`;

const LoginForm = styled.div`
    margin: 0 auto;
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    border-radius: 4px;
    padding: 25px 100px 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
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

    input {
        border: none;
        outline: none;
        padding: 5px;
        font-size: 18px;
        border-bottom: solid 1px ${({ theme }) => theme.text};
        background-color: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};

        &::placeholder {
            color: ${({ theme }) => theme.text};
            opacity: .6;
        }
    } 

    p {
        text-align: center;
        color: green;
    }
    e {
        text-align: center;
        color: red;
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

const SignUp = styled.p`
    text-decoration: underline;
    cursor: pointer;
`;