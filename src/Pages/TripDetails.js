import React, {useEffect} from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Nav from '../Components/Nav';
import TripNav from '../Components/TripNav';
import Footer from '../Components/Footer';
import TrashDark from '../Images/Icons/DarkMode/TrashLight.png'
import SettingsDark from '../Images/Icons/DarkMode/SettingsLight.png';
import {gql, useMutation } from "@apollo/client";
import {connect} from "react-redux";
import Trip from '../Components/Trip';
import FlightCard from '../Components/FlightCard';
import HotelCard from '../Components/HotelCard';
import ActivitiesCard from '../Components/ActivitiesCard';

function TripDetails(props) {
    let tripId = null;
    let tripInfo = null;
    // console.log(props);
    if (props && props.auth && props.auth.tripInfo) {
        sessionStorage.setItem('tripInfo', JSON.stringify(props.auth.tripInfo));
        tripId = props.auth.tripInfo.Trip_ID;
        tripInfo = props.auth.tripInfo;
    } else {
        tripInfo = JSON.parse(sessionStorage.getItem('tripInfo'));
        tripId = tripInfo.Trip_ID;
    }

    const history = useNavigate();
    function handleRoute(route) {
        // window.location.reload(false);
        history(route);
    }

    const DELETE_TRIP = gql`mutation deleteTrip ($Trip_ID: Int!) {
        delete_Trip_by_pk(Trip_ID: $Trip_ID) {
          Trip_Bio
        }
    }`
      
    const [pressedDelete, setPressedDelete] = React.useState(false)

    function DeleteTripFunction() {
    setPressedDelete(true);
    }

    const HandleTripDeletion = () => {
        const [deleteTrip] = useMutation(DELETE_TRIP);

        if(pressedDelete) {
            let proceed = window.confirm(`Do you want to delete ${tripInfo.Trip_Name} trip. This can not be undone!!!`);
            if (proceed) {
                useEffect(() => {
                    deleteTrip({
                    variables: {Trip_ID: tripId}
                    });

                }, []);
                setPressedDelete(current => !current);
                handleRoute('/myGroups')
                window.location.reload(false);
            }
        }

        return null;
    }

    return (
        <Container>
            <Nav />
            <Content>
                <Title>{tripInfo.Trip_Name}</Title>
                <TripNav />
                <TripNav2>
                    <TripNavButton style={{backgroundColor: '#AC9F3C'}} onClick={() => handleRoute('/myTrips')}> Back to My Trips </TripNavButton>
                    <TripNavButton onClick={() => handleRoute('/TripSettings')}>
                        <p>Trip Settings</p>
                        <img src={SettingsDark} alt="Settings" />
                    </TripNavButton>
                    <TripNavButton style={{backgroundColor: '#c70000'}} onClick={DeleteTripFunction}>
                        <p>Delete Trip</p>
                        <img src={TrashDark} alt="Delete" />
                    </TripNavButton>
                    {pressedDelete && <HandleTripDeletion />}
                </TripNav2>
                <Cards>
                    <Trip tripInfo={tripInfo}/>
                    <CardTitle>Flight Choices</CardTitle>
                    <CardTitle>Hotel Choices</CardTitle>
                    <HotelCard />
                </Cards>
            </Content>
            <Footer />
        </Container>
    )
};

const Container = styled.div`

`;

const Content = styled.div`
    min-height: 100vh;
    margin: 0 10%;
    padding: 40px 0 0 0;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Title = styled.p`
    font-size: 36px;
    margin: 0 0 50px 0;
    font-weight: 700;
`;

const TripNav2 = styled.div`
    margin: 50px auto;
    display: flex;
    justify-content: space-around;
    width: 100%;
`;

const TripNavButton = styled.div`
    display: flex;
    border: none;
    padding: 0px 5px;
    border-radius: 20px;
    background-color: #308446;
    transition: 600ms;
    cursor: pointer;
    align-items: center;
    width: 250px;
    margin: 20px 0;
    justify-content: center;

    p {
        color: white;
        font-size: 16px;
        margin-right: 5px;
    }

    img{
        height: 20px;
        width: 20px;
    }

    &:hover {
        transition: 600ms;
        transform: scale(1.2);
    }
`;

const Cards = styled.div`
    width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CardTitle = styled.div`
    font-size: 36px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
`;

const mapStateToProps = (state) => {
    return state;
  }
  
  export default connect(mapStateToProps)(TripDetails);