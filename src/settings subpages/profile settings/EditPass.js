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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleClick();
        }
    }

    let password = useRef(null);
    let passwordVerified = useRef(null);
    let oldPassword = useRef(null)

    const [passwordInput, setPasswordInput] = React.useState(null);
    const [passwordVerifyInput, setPasswordVerifyInput] = React.useState(null);
    const [oldPasswordInput, setOldPasswordInput] = React.useState(null)
    const [clicked, setClicked] = React.useState(false)


    const handleClick = (e) => {
        setClicked(true)

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

        if (oldPassword.current.value === "") {
            setOldPasswordInput(null);
        } else {
            setOldPasswordInput(oldPassword.current.value);
        }

    };

    const VALIDATE_ACC = gql`query validateAcc ($ID: Int!){
        User(where: {User_ID: {_eq: $ID}}) {
            Password
            Email
        }
    }`

    const UPDATE_PASS = gql `mutation update_user ($ID: Int!, $Password: String!) {
        update_User_by_pk(
            pk_columns: {User_ID: $ID}
            _set: {Password: $Password
            }
        )
        {
            Email
        }
    }`


    const CheckMismatch = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables: {ID: sessionStorage.getItem("userId")}
        });

        if (loading) {
            return <p>Changing password...</p>
        }

        if (error) {
            return <e>{error}</e>;
        }

        if (passwordVerifyInput !== passwordInput) {
            return <e> Passwords don't match! </e>
        } else if (oldPasswordInput !== data.User[0].Password) {
                return <e> Incorrect old password!</e>
        } else {
            return <UpdatePass/>
        }

        return null;
    }

    const UpdatePass = () => {
        const [update_pass, {data,loading,error}] = useMutation(UPDATE_PASS);

        useEffect(() => {
            update_pass({
                variables : {
                    ID: sessionStorage.getItem("userId"),
                    Password: passwordInput
                }
            });
        }, []);

        if (loading) {
            return <p>Updating your password...</p>
        }

        if (data) {
            window.location.reload(false);
            return <p>Password updated!</p>
        }
        return null

    }

    const CheckBlank = () => {
        return <e>Fields cannot be blank!</e>
    }


    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <SignUpForm>
                    <Title>Change Password</Title>
                    <Form>
                    <Row theme={props.theme.theme}>
                            {/* <label>Password:</label> */}
                            <input ref={oldPassword} onKeyDown={handleKeyDown} type="password" name="password" placeholder="Old Password:" /><br></br>
                        </Row>
                        <Row theme={props.theme.theme}>
                            {/* <label>Password:</label> */}
                            <input ref={password} onKeyDown={handleKeyDown} type="password" name="password" placeholder="New Password:" /><br></br>
                        </Row>
                        <Row theme={props.theme.theme}>
                            {/* <label>Password:</label> */}
                            <input ref={passwordVerified} onKeyDown={handleKeyDown} type="password" name="password" placeholder="Verify New Password:" /><br></br>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Set New Password</SubmitButton>
                            {passwordInput !== null && passwordVerifyInput !== null
                                ? <CheckMismatch/> : clicked && <CheckBlank/>}
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