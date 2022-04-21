import React, {useEffect,useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { auth, signInWithGoogle, logout } from "../Firebase/firebase";
import Google from '../Images/Icons/Google.png';
import { Content } from '../Styles/global';
import {gql, useMutation, useQuery} from "@apollo/client";
import Loading from '../Components/Loading';

function JoinGroup(props) {

    let groupid = useRef(null);
    const [groupidInput, setGroupIDInput] = React.useState(null);
    const [clicked, setClicked] = React.useState(false)

    let returnid = null;

    const history = useNavigate();

    function handleRoute(route) {
        history(route);
    }

    const handleClick = (e) => {
        if (groupid.current.value === "") {
            setGroupIDInput(null)
        } else {
            setGroupIDInput(groupid.current.value);
        }
        // setClicked(true)
    };

    const CheckBlank = () => {
        return <p>Group join code cannot be blank!</p>
    }

    const FIND_GROUP = gql`query findgroupID ($Join_Code: String!){
        Group(where: {Join_Code: {_eq: $Join_Code}}) {
            Group_ID,
        }
    }`

    const JOIN_GROUP = gql`mutation  insert_membership_one($member: membership_insert_input!){
        insert_membership_one(object: $member){
            User_ID
            Group_ID
        }
    }`

    const JoinGroup = () => {
        const userObj = {
            "User_ID": sessionStorage.getItem('userId'),
            "Group_ID": returnid
        }

        
        const [join_group, {data,loading,error}] = useMutation(JOIN_GROUP);
        useEffect(() => {
            join_group({
                variables : {member: userObj}
            });
        }, []);

        if (loading)
            return <p>Joining group...</p>

        if (data) {
            window.location.reload();
            return <p>Successfully joined group!</p>
        }
        if (error) {
            return <p>You are already in the group!</p>
        }
        return null
    }

    const SendData = () => {
        const {data, error, loading} = useQuery(FIND_GROUP, {
            variables : {Join_Code : groupidInput}
        })

        if (loading)
            return <p>Loading...</p>

        if (data) {
            if (data.Group.length > 0) {
                // console.log(data)
                returnid = data.Group[0].Group_ID;
            } else {
                return <p>You've entered an invalid group code</p>
            }
        }

        handleRoute('/MyGroups')

        return <JoinGroup/>
    }

    /*
    const SendData = () => {
        console.log(groupidInput)
        // console.log(sessionStorage.getItem('userId'))
        console.log(useQuery(FIND_GROUP, {variables : {Join_Code : groupidInput}}))

        
        const userObj = {
            "User_ID": sessionStorage.getItem('userId'),
            "Group_ID": (Number)(useQuery(FIND_GROUP, {variables : {Join_Code : groupidInput}}))
        }

        
        const [join_group, {data,loading,error}] = useMutation(JOIN_GROUP);
        useEffect(() => {
            join_group({
                variables : {member: userObj}
            });
        }, []);

        if (loading)
            return <p>Updating Group...</p>

        if (data) {
            return <p>Group Added!</p>
        }
        if (error) {
            return <p>Invalid Group Code!</p>
        }
        return null
    }
    */
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
                <JoinGroupForm>
                    <Title>Join Group</Title>
                    <Form onSubmit={handleKeypress}>
                        <Row theme={props.theme.theme}>
                            {/* <label>Email:</label> */}
                            <input ref={groupid} type="text" name="groupID" min={1} placeholder="Enter Group Join Code:"/><br></br>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Submit</SubmitButton>
                            {groupidInput !== null ? <SendData/> : clicked && <CheckBlank/>}
                        </Row>

                    </Form>
                </JoinGroupForm>
            </Content>
            <Footer />
        </Container>
    )
}


const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(JoinGroup);

const Container = styled.div`
`;

const JoinGroupForm = styled.div`
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