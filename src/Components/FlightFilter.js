import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { store } from '../store/TripUsStore';
import {gql, useMutation, useQuery} from "@apollo/client";
import TripNav from '../Components/TripNav';

function FlightFilter(props) {
    sessionStorage.removeItem('FlightFilterData');

    if (props.auth.flightData) {
        window.location.reload(false)
    }

    React.useEffect(() => {
        store.dispatch({type: 'FLIGHT_DATA', payload: null});
    }, []);


    

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
    let numStars = useRef(null);
    let numRooms = useRef(null);
    let maxPrice = useRef(null);

    const [checkInInput, setcheckInInput] = React.useState(null);
    const [numStarsInput, setnumStarsInput] = React.useState(null);
    const [numRoomsInput, setnumRoomsInput] = React.useState(null);
    const [maxPriceInput, setMaxPrice] = React.useState(null);
    const [clicked, setClicked] = React.useState(false)



    const handleClick = (e) => {
       
        if (checkIn.current.value === "") {
            setcheckInInput(null);
        } else {
            setcheckInInput(checkIn.current.value.trim());
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

        if (maxPrice.current.value === "") {
            setMaxPrice(null);
        } else {
            setMaxPrice(maxPrice.current.value);
        }

        setClicked(true)

    };

    const CheckBlank = () => {
        return <e>Fields with * next to them cannot be blank!</e>
    }
      

    const VALIDATE_ACC = gql`query validateAcc ($Username: String!){
        User(where: {Display_Name: {_eq: $Username}}) {
            User_ID
        }
    }`

    const CheckData = () => {

        let filterArr = {
            departure : checkInInput,
            departurecode: numRoomsInput,
            arrivalcode: numStarsInput,
            maxprice : maxPriceInput
        }

        store.dispatch({type: 'FILTER_DATA', payload: filterArr})

        handleRoute('/addFlight')
        return <p>Finding flights...</p>

        
    }
    
   
    return (
        <Container>
         <Nav />
            <Content theme={props.theme}>
                <TripNav />
                <SignUpForm>
                    <Title>Filter Flight Results</Title>
                    <Form>
                        {/* <hr /> */}
                        <Row theme={props.theme.theme}>
                            <label>Departure Date *</label>
                            <input ref={checkIn} onKeyDown={handleKeyDown} type="date" />
                            
                        </Row>

                        
                        <Row theme={props.theme.theme}>
                            <label>Departure Airport *</label>
                            <input ref={numRooms} onKeyDown={handleKeyDown} placeholder="3 Letter Airport Code or City Name"/>
                        </Row>
                        <Row theme={props.theme.theme}>
                            <label>Arrival Airport *</label>
                            <input ref={numStars} onKeyDown={handleKeyDown} placeholder="3 Letter Airport Code or City Name"/>
                        </Row>

                        <Row theme={props.theme.theme}>
                            <label>Max Price</label>
                            <input ref={maxPrice} type="number" onKeyDown={handleKeyDown} placeholder="Max Flight Price in USD"/>
                        </Row>

                        <Row>
                            <SubmitButton onClick={handleClick}>Filter Results</SubmitButton>
                            {checkInInput !== null && numRoomsInput !== null &&  numStarsInput !== null
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
    flex-direction: column;
    padding: 100px 10% 0 10%;
    align-items: center;
    min-height: 100vh;
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

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(FlightFilter);