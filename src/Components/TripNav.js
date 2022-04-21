import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useNavigate } from "react-router";


import FlightsDark from '../Images/Icons/DarkMode/FlightsLight.png';
import FlightsLight from '../Images/Icons/LightMode/Flights.png';

import HotelDark from '../Images/Icons/DarkMode/HotelLight.png';
import HotelLight from '../Images/Icons/LightMode/Hotel.png';

import TransportationDark from '../Images/Icons/DarkMode/TransportationLight.png';
import TransportationLight from '../Images/Icons/LightMode/Transportation.png';

import ActivitiesDark from '../Images/Icons/DarkMode/ActivitiesLight.png';
import ActivitiesLight from '../Images/Icons/LightMode/Activities.png';

import HomeDark from '../Images/Icons/DarkMode/HomeLight.png';
import HomeLight from '../Images/Icons/LightMode/Home.png';

function TripNav(props) {
    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }
    
    return (
        <Container theme={props.theme.theme}>
            <ButtonDiv onClick={() => handleRoute('/tripDetails')}>
            {props.theme.theme.type === 'dark'
                ? <img src={HomeDark} alt="" />
                : <img src={HomeLight} alt=""/>}

                <p>Trip Home</p>
            </ButtonDiv>

            <ButtonDiv onClick={() => handleRoute('/flightDetails')}>
            {props.theme.theme.type === 'dark'
                ? <img src={FlightsDark} alt="" />
                : <img src={FlightsLight} alt=""/>}

                <p>Flights</p>
            </ButtonDiv>

            <ButtonDiv onClick={() => handleRoute('/hotelDetails')}>
            {props.theme.theme.type === 'dark'
                ? <img src={HotelDark} alt="" />
                : <img src={HotelLight} alt=""/>}
                <p>Hotels</p>
            </ButtonDiv>
            {/* <ButtonDiv onClick={() => handleRoute('/transportDetails')}>
            {props.theme.theme.type === 'dark'
                ? <img src={TransportationDark} alt="" />
                : <img src={TransportationLight} alt=""/>}
                <p>Transportation</p>
            </ButtonDiv>
            <ButtonDiv onClick={() => handleRoute('/excursionDetails')}>
            {props.theme.theme.type === 'dark'
                ? <img src={ActivitiesDark} alt="" />
                : <img src={ActivitiesLight} alt=""/>}
                <p>Activities</p>
            </ButtonDiv> */}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin: 20px 0;
    border: 3px solid ${({ theme }) => theme.cardBorder};
    background-color: ${({ theme }) => theme.body};
`;

const ButtonDiv = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 600ms;

    &:hover {
        transform: scale(1.2);
        transition: 600ms;
    }

    img {
        width: 25px;
        height: 25px;
        background-color: #308446;
        border-radius: 50%;
        padding: 5px;
    }

    p {
        margin-left: 10px;
        letter-spacing: .3rem;
        font-weight: 700;
        color: ${({ theme }) => theme.text};
        font-size: 18px;
        z-index: 1;
    }

`;

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(TripNav);