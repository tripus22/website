import React, {useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { signInWithGoogle } from "../Firebase/firebase";
import Google from '../Images/Icons/Google.png';
import { store } from '../store/TripUsStore';
import {gql, useQuery} from "@apollo/client";

function Signup(props) {
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleClick();
        }
    }

    let password = useRef(null);
    let passwordVerified = useRef(null);
    let email = useRef(null);

    const [emailInput, setEmailInput] = React.useState(null);
    const [passwordInput, setPasswordInput] = React.useState(null);
    const [passwordVerifyInput, setPasswordVerifyInput] = React.useState(null);
    const [clicked, setClicked] = React.useState(false)
    let [googleEmail, setGoogleEmail] = React.useState(null)

    const handleGoogleClick = async (e) => {
        googleEmail = await signInWithGoogle()
        console.log(googleEmail)
        if (googleEmail === null) {
            setGoogleEmail(null)
        } else {
            setGoogleEmail(googleEmail);
        }

    }


    const handleClick = (e) => {
        setClicked(true)

        if (email.current.value === "") {
            setEmailInput(null)
        } else {
            setEmailInput(email.current.value.trim().toLowerCase());
        }

        if (password.current.value === "") {
            setPasswordInput(null);
        } else {
            setPasswordInput(password.current.value);
        }

        if (passwordVerified.current.value === "") {
            setPasswordVerifyInput(null);
        } else {
            setPasswordVerifyInput(passwordVerified.current.value);
        }

    };

    const VALIDATE_ACC = gql`query validateAcc ($Email: String!){
        User(where: {Email: {_eq: $Email}}) {
            User_ID
            First_Name
            Last_Name
        }
    }`


    function validateEmail (email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    function validatePassword (password) {
        const decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        return decimal.test(password);
    }

    const CheckMismatch = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables : {Email : emailInput, Password : passwordInput}
        });

        if(loading) {
            return <p>Signing up...</p>
        }

        if(error) {
            return <e>{error}</e>;
        }

        if (!validatePassword (passwordInput)){
            return <e>Password must be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character</e>
        }

        if (!validateEmail (emailInput)) {
            return <e> Please enter a valid email </e>
        } else if(passwordInput === passwordVerifyInput && !data.User[0]) {
            store.dispatch({type: 'USER_PROFILE', payload: {Email: emailInput, Password: passwordInput} })
            handleRoute('/createprofile');
        } else if (data.User[0]) {
            return <e> That email is already registered! </e>
        } else {
            return <e> Passwords don't match! </e>
        }

        return null;
    }

    const CheckBlank = () => {
        return <e>Fields cannot be blank!</e>
    }

    const CheckGoogleUser = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables : {Email : googleEmail}
        });

        if(loading) {
            return <p>Signing up...</p>
        }

        if(error) {
            return <e>{error}</e>;
        }

        if(data.User[0]){
            console.log(data);
            store.dispatch({ type: 'UserId', payload: data.User[0].User_ID });
            store.dispatch({type: 'IS_AUTHENTICATED', payload: true })
            sessionStorage.setItem('isAuthenticated', true);
            handleRoute('/myGroups');
        } else {
            store.dispatch({type: 'USER_PROFILE', payload: {Email: googleEmail, Password: null} })
            handleRoute('/createprofile');
        }

        return null;
    }

    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <SignUpForm>
                    <Title>Sign Up</Title>
                    <Form>
                        <Row theme={props.theme.theme}>
                            {/* <label>Email:</label> */}
                            <input ref={email} onKeyDown={handleKeyDown} type="email" name="email" placeholder="Email:"/><br></br>
                        </Row>
                        <Row theme={props.theme.theme}>
                            {/* <label>Password:</label> */}
                            <input ref={password} onKeyDown={handleKeyDown} type="password" name="password" placeholder="Password:" /><br></br>
                        </Row>
                        <Row theme={props.theme.theme}>
                            {/* <label>Password:</label> */}
                            <input ref={passwordVerified} onKeyDown={handleKeyDown} type="password" name="password" placeholder="Verify Password:" /><br></br>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Create Account</SubmitButton>
                            {emailInput !== null && passwordInput !== null && passwordVerifyInput !== null
                                ? <CheckMismatch/> : clicked && <CheckBlank/>}
                        </Row>

                    </Form>
                    <p>or</p>
                    <GoogleButton onClick={handleGoogleClick}>
                        <img src={Google} alt="Google"/>
                        <p>Sign Up with Google </p>
                    </GoogleButton>
                    {googleEmail !== null && (<CheckGoogleUser/>)}
                    <Login onClick={() => handleRoute('/login')}>
                        Already Have A TripUs Account?
                    </Login>
                </SignUpForm>
            </Content>
            <Footer />
        </Container>
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Signup);

const Container = styled.div`
`;

const Content = styled.div`
    display: flex;
    padding: 0 10%;
    height: 100vh;
    justify-content: center;
    align-items: center;
`;

const SignUpForm = styled.div`
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

const Login = styled.p`
    text-decoration: underline;
    cursor: pointer;
`;