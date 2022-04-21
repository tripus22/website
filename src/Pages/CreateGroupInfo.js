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

function CreateGroupInfo(props) {
        console.log(props); //props.auth.userProfile
        const history = useNavigate();
        function handleRoute(route) {
            history(route);
        }
    
        let profileImage = useRef(null);
    
        const [profileImageInput, setProfileImageInput] = React.useState(null); //image
        const [clicked, setClicked] = React.useState(false)
    
        const getBase64 = file => {
            return new Promise(resolve => {
                let baseURL = "";
                // Make new FileReader
                let reader = new FileReader();
    
                // Convert the file to base64 text
                reader.readAsDataURL(file);
    
                // on reader load somthing...
                reader.onload = () => {
                    // Make a fileInfo Object
                    baseURL = reader.result;
                    resolve(baseURL);
                };
            });
        };
    
        const onChange = (file) => {
    
            if(!file) {
                setProfileImageInput(null);
                return;
            }
    
            getBase64(file)
                .then(base64 => {
                    setProfileImageInput(base64);
                })
    
        }
    
        const handleClick = (e) => {
            setClicked(true)
        };
    
        const CheckBlank = () => {
            return <e>Fields with * next to them cannot be blank!</e>
        }
    
        const UPDATE_GROUP_PROFILE_PIC = gql `mutation updateGroup ($Group_ID: Int!, $Group_Image: String!) {
            update_Group_by_pk(
                pk_columns: {Group_ID: $Group_ID}
            _set: {Group_Image: $Group_Image
            }
        )
            {
                Group_Image
            }
        }`
    
        const SendData = () => {
            // console.log(birthdayInput)
            // console.log(profileImageInput)
    
            const [update_group_profile_pic, {data,loading,error}] = useMutation(UPDATE_GROUP_PROFILE_PIC);
            useEffect(() => {
                update_group_profile_pic({
                    variables : {
                        Group_ID: props.auth.groupInfo.Group_ID,
                        Group_Image: profileImageInput
                    }
                });
            }, []);
    
            if (loading)
                return <p>Uploading image...</p>
    
            if (data) {
                window.location.reload(false);
                return <p>Image updated!</p>
            }
            // handleRoute('/EditBio')
            return null
    
        }
    
        return (
            <Container>
                <Nav />
                <Content theme={props.theme}>
                    <SignUpForm>
                        <Title>Add Group Information</Title>
                        <Form>
                           
                            <Row theme={props.theme.theme} style={{marginTop: '30px'}}>
                                <label>Add a Profile Image (.jpg, .jpeg, .png)</label>
                                <input ref={profileImage} type="file" accept=".jpg, .jpeg, .png" onChange={(event) => onChange(event.target.files[0] || null)}/>
                            </Row>
                          
                          
                            <Row>
                                <SubmitButton onClick={handleClick}>Submit Group Image</SubmitButton>
                                {profileImageInput !== null && clicked
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

export default connect(mapStateToProps)(CreateGroupInfo);

const Container = styled.div`
`;

const CreateTripForm = styled.div`
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