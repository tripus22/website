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

function EditEmail(props) {
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    let email = useRef(null);

    const [emailInput, setEmailInput] = React.useState(null);
    const [clicked, setClicked] = React.useState(false)
    let [googleEmail, setGoogleEmail] = React.useState(null)
    const [googleClicked, setGoogleClicked] = React.useState(false)

    const handleGoogleClick = async (e) => {
        googleEmail = await signInWithGoogle()
        console.log(googleEmail)
        if (googleEmail === null) {
            setGoogleEmail(null)
        } else {
            setGoogleEmail(googleEmail);
        }
        setEmailInput(null)
        setGoogleClicked(true)
        setClicked(false)

    }


    const handleClick = (e) => {
        setClicked(true)
        setGoogleEmail(null)
        setGoogleClicked(false)
        if (email.current.value === "") {
            setEmailInput(null)
        } else {
            setEmailInput(email.current.value.trim().toLowerCase());
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

    const CheckBlank = () => {
        return <p>Fields cannot be blank!</p>
    }

    const CheckGoogleUser = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables : {Email : googleEmail}
        });

        if (loading)
            return <p>Loading...</p>
        console.log(data)
        if (!validateEmail(googleEmail)) {
            return <e> Please enter a valid email! </e>
        } else if (data.User[0]){
            return <e> That email is already registered! </e>
        }

        return <UpdateEmailGoogle/>
    }

    const UpdateEmailGoogle = () => {
        const [update_email, {data,loading,error}] = useMutation(UPDATE_EMAIL);

        useEffect(() => {
            update_email({
                variables : {
                    ID: sessionStorage.getItem("userId"),
                    Email: googleEmail
                }
            });
        }, []);

        if (loading) {
            return <p>Updating your email...</p>
        }

        if (data) {
            let userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
            userProfile.Email = googleEmail
            sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
            window.location.reload(false);
            return <p>Email updated!</p>
        }
        return null

    }

    const UPDATE_EMAIL = gql `mutation update_user ($ID: Int!, $Email: String!) {
        update_User_by_pk(
            pk_columns: {User_ID: $ID}
            _set: {Email: $Email
            }
        )
        {
            Email
        }
    }`

    const UpdateEmail = () => {
        const [update_email, {data,loading,error}] = useMutation(UPDATE_EMAIL);

        useEffect(() => {
            update_email({
                variables : {
                    ID: sessionStorage.getItem("userId"),
                    Email: emailInput
                }
            });
        }, []);

        if (loading) {
            return <p>Updating your email...</p>
        }

        if (data) {
            let userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
            userProfile.Email = emailInput
            sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
            window.location.reload(false);
            return <p>Email updated!</p>
        }
        return null

    }

    const SendData = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables : {Email : emailInput}
        });

        if (loading)
            return <p>Loading...</p>

        if (!validateEmail(emailInput)) {
            return <e> Please enter a valid email! </e>
        } else if (data.User[0]){
            return <e> That email is already registered! </e>
        }

        return <UpdateEmail/>

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
                    <Title>Edit Email</Title>
                    <Form onSubmit={handleKeypress}>
                        <Row theme={props.theme.theme}>
                            {/* <label>Email:</label> */}
                            <input ref={email} type="email" name="email" placeholder="Enter New Email:"/><br></br>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Change Email</SubmitButton>
                            {emailInput !== null ? <SendData/> : clicked && <CheckBlank/>}
                        </Row>

                    </Form>
                    <p>or</p>
                    <GoogleButton onClick={handleGoogleClick}>
                        <img src={Google} alt="Google"/>
                        <p>Use a New Google Account</p>
                    </GoogleButton>
                    {googleEmail !== null && googleClicked && (<CheckGoogleUser/>)}
                </SignUpForm>
            </Content>
            <Footer />
            console.log(email.current.value)
        </Container>
        
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(EditEmail);

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