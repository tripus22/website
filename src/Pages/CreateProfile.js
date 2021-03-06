import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { store } from '../store/TripUsStore';
import {gql, useMutation, useQuery} from "@apollo/client";

function CreateProfile(props) {
    // console.log(props); //props.auth.userProfile
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }
    if (!props.auth.userProfile) {
        window.location.href = '/signup'
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleClick();
        }
    }

    let firstName = useRef(null);
    let lastName = useRef(null);
    let displayName = useRef(null);
    let profileImage = useRef(null);
    let birthday = useRef(null);
    let impairments = useRef(null);
    let dependents = useRef(null);
    let bio = useRef(null);
    let gender = useRef(null);

    const [firstNameInput, setFirstNameInput] = React.useState(null);
    const [lastNameInput, setLastNameInput] = React.useState(null);
    const [displayNameInput, setDisplayNameInput] = React.useState(null);
    const [profileImageInput, setProfileImageInput] = React.useState(null); //image
    const [birthdayInput, setBirthDayInput] = React.useState(null);  //date
    const [impairmentsInput, setImpairmentsInput] = React.useState(null);
    const [dependentsInput, setDependentsInput] = React.useState(null);
    const [bioInput, setBioInput] = React.useState(null);
    const [genderInput, setGenderInput] = React.useState(null);
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

        if(!file || file === 'data:') {
            setProfileImageInput(null);
            return;
        }

        getBase64(file)
            .then(base64 => {
                setProfileImageInput(base64);
            })

    }

    const handleClick = (e) => {
        if (firstName.current.value === "") {
            setFirstNameInput(null)
        } else {
            setFirstNameInput(firstName.current.value.trim());
        }

        if (lastName.current.value === "") {
            setLastNameInput(null);
        } else {
            setLastNameInput(lastName.current.value.trim());
        }

        if (displayName.current.value === "") {
            setDisplayNameInput(null);
        } else {
            setDisplayNameInput(displayName.current.value.toLowerCase().trim());
        }

        // if (profileImage.current.value === "") {
        //     setProfileImageInput(null);
        // } else {
        //     setProfileImageInput(profileImage.current.value);
        // }

        if (birthday.current.value === "") {
            setBirthDayInput(null);
        } else {
            setBirthDayInput(birthday.current.value);
        }

        if (impairments.current.value === "") {
            setImpairmentsInput(null);
        } else {
            setImpairmentsInput(impairments.current.value);
        }

        if (dependents.current.value === "") {
            setDependentsInput(null);
        } else {
            setDependentsInput(dependents.current.value);
        }

        if (bio.current.value === "") {
            setBioInput(null);
        } else {
            setBioInput(bio.current.value);
        }

        if (gender.current.value === "") {
            setGenderInput(null);
        } else {
            setGenderInput(gender.current.value);
        }

        if (profileImageInput === null) {
            if (genderInput === "Female") {
                setProfileImageInput('data:image/jpg;base64,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');
            } else if (genderInput === "Male") {
                setProfileImageInput('data:image/jpg;base64,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')
            } else {
                setProfileImageInput('data:image/jpg;base64,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')
            }
        }

        setClicked(true)
    };

    const CheckBlank = () => {
        return <e>Fields with * next to them cannot be blank!</e>
    }

    const INSERT_USER = gql`mutation insert_User_one ($object: User_insert_input!) {
        insert_User_one(
            object: $object) {
            First_Name
            Last_Name
            Email
            Display_Name
            Bio
            Gender
            Profile_Image
            User_DOB
            Roles
            Impairments
            Dependents
            User_ID
        }
    }`

    const SendData = () => {
        // console.log(birthdayInput)
        // console.log(profileImageInput)

        const userObj = {
                "First_Name": firstNameInput,
                "Last_Name": lastNameInput,
                "Email": props.auth.userProfile.Email,
                "Password": props.auth.userProfile.Password,
                "Display_Name": displayNameInput,
                "Bio": bioInput,
                "Gender": genderInput,
                "User_DOB": birthdayInput,
                "Roles": null,
                "Profile_Image": profileImageInput,
                "Impairments": impairmentsInput,
                "Dependents": dependentsInput
        }

        const [insert_user, {data,loading,error}] = useMutation(INSERT_USER);

        useEffect(() => {

            insert_user({
                variables: {object: userObj}
            });

        }, []);

        if (loading)
            return <p style={{color: "green"}}>Almost done...</p>

        if (data) {
            //console.log(data)
            store.dispatch({type: 'IS_AUTHENTICATED', payload: true})
            store.dispatch({type: 'USER_PROFILE', payload: data.insert_User_one})
            sessionStorage.setItem('isAuthenticated', true);
            sessionStorage.setItem('userProfile', JSON.stringify(data.insert_User_one));
            handleRoute('/myGroups')
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
            return <p>Creating your TripUs profile...</p>

        if ((/\s/.test(displayNameInput))) {
            return <e> Username cannot have spaces. </e>
        }

        if (data.User[0]){
            return <e> That username is already in use! Please select a different username. </e>
        }

        return <SendData/>

    }

    return (
        <Container>
            <Nav />
            <Content theme={props.theme}>
                <SignUpForm>
                    <Title>Create Profile</Title>
                    <Form>
                        <Row theme={props.theme.theme} style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* <label>Enter Name *</label> */}
                            <input ref={firstName} onKeyDown={handleKeyDown} type="text" placeholder="First Name"/>
                            <input ref={lastName} onKeyDown={handleKeyDown} type="text" placeholder="Last Name"/>
                        </Row>
                        <Row theme={props.theme.theme} style={{marginBottom: '30px'}}>
                            <label>Username *</label>
                            <input ref={displayName} onKeyDown={handleKeyDown} type="text" placeholder="Username"/>
                        </Row>
                        {/* <hr /> */}
                        <Row theme={props.theme.theme}>
                            <label>Birthday *</label>
                            <input ref={birthday} onKeyDown={handleKeyDown} type="date" />
                        </Row>
                        <Row theme={props.theme.theme}>
                            <label>Bio </label>
                            <input ref={bio} type="text" onKeyDown={handleKeyDown} placeholder="Tell Us About Yourself"/>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <label>Impairments</label>
                            <input ref={impairments} onKeyDown={handleKeyDown} type="text" placeholder="Impairments:"/>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <label>Dependents</label>
                            <input ref={dependents} type="number" onKeyDown={handleKeyDown} placeholder="Children (0 - 12) and Senior Citizens (65+):" min={0} />
                        </Row>
                        <Row theme={props.theme.theme}>
                            <label>Gender *</label>
                            <select ref={gender}>
                                <option value={null}>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                                <option value="Other">Other</option>
                                <option value="Rather Not Say">Rather Not Say</option>
                            </select>
                        </Row>
                        <Row theme={props.theme.theme} style={{marginTop: '30px'}}>
                            <label>Profile Image (.jpg, .jpeg, .png)</label>
                            <input ref={profileImage} type="file" accept=".jpg, .jpeg, .png" onChange={(event) => onChange(event.target.files[0] || null)}/>
                        </Row>
                        <Row>
                            <SubmitButton onClick={handleClick}>Create Profile</SubmitButton>
                            {firstNameInput !== null && lastNameInput !== null && displayNameInput !== null && genderInput !== "Select Gender" && birthdayInput !== null
                                ? <CheckData/> : clicked && <CheckBlank/>}

                        </Row>

                    </Form>
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

export default connect(mapStateToProps)(CreateProfile);

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