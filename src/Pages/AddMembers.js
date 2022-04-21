import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { auth, signInWithGoogle, logout } from "../Firebase/firebase";
import Google from '../Images/Icons/Google.png';
import { Content } from '../Styles/global';
import {gql, useMutation, useQuery} from "@apollo/client";
import {store} from "../store/TripUsStore";

function AddMembers(props) {
    const history = useNavigate();

    function handleRoute(route) {
        window.location.reload(false);
        history(route);
    }
    let emailName = useRef(null);
    const [emailInput, setEmailInput] = React.useState(null);
    const [clicked, setClicked] = React.useState(false)

    const handleClick = (e) => {
        if (emailName.current.value === "") {
            setEmailInput(null)
        } else {
            setEmailInput(emailName.current.value.toLowerCase().trim());
        }
        setClicked(true)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
           handleClick();
        }
     }

    const CheckBlank = () => {
        return <e>Please enter a member email!</e>
    }

    const ADD_MEMBERSHIP = gql`mutation insert_membership_one ($member: membership_insert_input!) {
        insert_membership_one(object: $member){
            User_ID
            Group_ID
        }
    }`

    let globalGroupID = null

    const VALIDATE_ACC = gql`query validateAcc ($Email: String!){
        User(where: {Email: {_eq: $Email}}) {
            User_ID
        }
    }`

    function validateEmail (email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    let userID = null

    const SendData = () => {
        const {data, error, loading} = useQuery(VALIDATE_ACC, {
            variables : {Email : emailInput}
        });

        if (loading)
            return <p>Adding member to group...</p>
        if (!validateEmail(emailInput)) {
            return <e> Please enter a valid email! </e>
        } else if (!data.User[0]){
            return <e> This user does NOT exist! </e>
        }

        userID = data.User[0].User_ID

        return <AddMembership/>

    }

    const AddMembership = () => {
        // console.log(props.auth.groupInfo.Group_ID)
        const userObj = {
            "User_ID": userID,
            "Group_ID": props.auth.groupInfo.Group_ID
        }

        const [add_membership, {data,loading,error}] = useMutation(ADD_MEMBERSHIP);

        useEffect(() => {

            add_membership({
                variables: {member: userObj}
            });

        }, []);

        if (loading)
            return <p>Almost done...</p>

        if (error)
            return <p>This user is already in the group!</p>

        if (data)
            return <p>User successfully added to group!</p>

        return null
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
                <AddMembersForm>
                    <Title>Add Members</Title>
                    <Form onSubmit={handleKeypress}>
                        <Row theme={props.theme.theme}>
                            {/* <label>Email:</label> */}
                            <input ref={emailName} onKeyDown={handleKeyDown} type="text" name="groupmember" placeholder="Enter Member Email:"/><br></br>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Add Member</SubmitButton>
                            {emailInput !== null ? <SendData/> : clicked && <CheckBlank/>}
                        </Row>
                        <Row>
                            <SubmitButton onClick={() => handleRoute("/myGroups")}>Done!</SubmitButton>
                        </Row>

                    </Form>
                </AddMembersForm>
            </Content>
            <Footer />
        </Container>
    )
}

const mapStateToProps = (state) => {
    return state;
}


export default connect(mapStateToProps)(AddMembers);

const Container = styled.div`
`;

const AddMembersForm = styled.div`
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
    
    // label {
    //     font-size: 18px;
    //     margin-bottom: 5px;
    //     font-weight: 700;
    // }
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