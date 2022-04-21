import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { store } from '../store/TripUsStore';
import {gql, useMutation, useQuery} from "@apollo/client";
import TripNav from '../Components/TripNav';

function HotelFilter(props) {

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

    let checkIn = useRef(null);
    let checkout = useRef(null);
    let numStars = useRef(null);
    let numRooms = useRef(null);
    let sortOpt = useRef(null);
    let loc = useRef(null);
    

    const [checkInInput, setcheckInInput] = React.useState(null);
    const [checkoutInput, setcheckoutInput] = React.useState(null);
    const [numStarsInput, setnumStarsInput] = React.useState(null);
    const [numRoomsInput, setnumRoomsInput] = React.useState(null); 
    const [sortOptInput, setsortOptInput] = React.useState(null); 
    const [locInput, setlocInput] = React.useState(null); 
    const [clicked, setClicked] = React.useState(false)



    const handleClick = (e) => {
       
        if (checkIn.current.value === "") {
            setcheckInInput(null);
        } else {
            setcheckInInput(checkIn.current.value.trim());
        }
       
        if (checkout.current.value === "") {
            setcheckoutInput(null)
        } else {
            setcheckoutInput(checkout.current.value.trim());
        }

        if (numStars.current.value === "") {
            setnumStarsInput(null);
        } else {
            setnumStarsInput(numStars.current.value);
        }
         
        if (numRooms.current.value === "") {
            setnumRoomsInput(null);
        } else {
            setnumRoomsInput(numRooms.current.value);
        }

        if (sortOpt.current.value === "") {
            setsortOptInput(null);
        } else {
            setsortOptInput(sortOpt.current.value);
        }

        if (loc.current.value === "") {
            setlocInput(null);
        } else {
            setlocInput(loc.current.value);
        }

        setClicked(true)

    };

    const CheckBlank = () => {
        return <e>Cannot have blank fields</e>
    }
      

    const VALIDATE_ACC = gql`query validateAcc ($Username: String!){
        User(where: {Display_Name: {_eq: $Username}}) {
            User_ID
        }
    }`

    const CheckData = () => {
        if(checkoutInput < checkInInput){
            return <e>invalid check in/ check out data</e>
        }
        if(numRoomsInput < 1 || numRoomsInput > 15){
            return <e>invalid number of rooms</e>
        }
        
        let filterArr = []

        filterArr.push(checkInInput)
        filterArr.push(checkoutInput)
        filterArr.push(numRoomsInput)
        filterArr.push(sortOptInput)
        filterArr.push(numStarsInput)
        filterArr.push(locInput)
        store.dispatch({type: 'FILTER_DATA', payload: filterArr})
        console.log(checkInInput)
        console.log(checkoutInput)
        console.log(numRoomsInput)
        console.log(sortOptInput)
        console.log(`star: ${numStarsInput}`)
        console.log(props.auth.filtData)

        handleRoute('/addHotel')
        return <p>Finding hotels...</p>

        
    }
    
    
   
    return (

        <Container>
            <Nav />
            <Content theme={props.theme}>
                {/* <TripNav /> */}
                <SignUpForm>
                    <Title>Filter Hotel Results</Title>
                    <Form>
                        {/* <hr /> */}

                        <Row theme={props.theme.theme}>
                            <label>Location </label>
                            <input ref={loc} type="text" onKeyDown={handleKeyDown} placeholder="Where are you Traveling to?"/>
                        </Row>

                        <Row theme={props.theme.theme}>
                            <label>Checkin Date</label>
                            <input ref={checkIn} onKeyDown={handleKeyDown} type="date" />   
                        </Row> 
                        <Row theme={props.theme.theme}>
                            <label>Checkout Date</label>
                            <input ref={checkout} onKeyDown={handleKeyDown} type="date" />
                        </Row>

                        <Row theme={props.theme.theme}>
                            <label>Sort By</label>
                            <select ref={sortOpt}>
                                <option value="STAR">Star</option>
                                <option value="PRICE">Price</option>
                                <option value="DEALS">Deals</option>
                                <option value="PROXIMITY">Proximity</option>
                                <option value="HDR">HDR</option>
                            </select>
                        </Row>

                        <Row theme={props.theme.theme}>
                            <label>Minimum Number of Stars</label>
                            <select ref={numStars}>
                                <option value="3.0,3.5,4.0,4.5,5.0">3.0</option>
                                <option value="3.5,4.0,4.5,5.0">3.5</option>
                                <option value="4.0,4.5,5.0">4.0</option>
                                <option value="4.5,5.0">4.5</option>
                                <option value="5.0">5.0</option>
                            </select>
                        </Row>

                        <Row theme={props.theme.theme}>
                            <label>Number of Rooms</label>
                            <input ref={numRooms} type="number" onKeyDown={handleKeyDown} placeholder="Number of Rooms:" min={1} />
                        </Row>
                       

                        <Row>
                            <SubmitButton onClick={handleClick}>Filter Results</SubmitButton>
                            {checkInInput !== null && checkoutInput !== null &&  sortOptInput !== null && numRoomsInput !== null &&  numStarsInput !== null && locInput !== null
                                ? <CheckData/> : clicked && <CheckBlank/>}
                                
                                
                        </Row>
                    </Form>
                </SignUpForm>
            </Content>
            <Footer />
        </Container>
  )
}
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
    margin: 20px auto;
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

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(HotelFilter);