import React from 'react'
import styled from 'styled-components'
import Arrow from '../Images/arrow.png';
import American from '../Images/American.png';
import {connect} from "react-redux";
import Moment from "react-moment";
import Liked from '../Images/Icons/liked.png';
import unLiked from '../Images/Icons/unliked.png';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { store } from '../store/TripUsStore';
import {useNavigate} from "react-router";

function FlightCard(props) {
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
        store.dispatch({type: 'TRIP_INFO', payload: tripInfo});
    }


    const upVote = gql`mutation update_Trip_Flights ($Trip_Flights_ID: Int!) {
        update_Trip_Flights_by_pk(
            pk_columns: {Trip_Flights_ID: $Trip_Flights_ID}, 
            _inc: { Upvotes: 1 }
            ) {
            Upvotes
        }
      }`

    const downVote = gql`mutation update_Trip_Flights ($Trip_Flights_ID: Int!) {
        update_Trip_Flights_by_pk(
            pk_columns: {Trip_Flights_ID: $Trip_Flights_ID}, 
            _inc: { Upvotes: -1 }
            ) {
            Upvotes
        }
      }`

    const [TripLikes] = useMutation(upVote);
    const [TripUnLike] = useMutation(downVote);
    const [heartType, setHeartImage] = React.useState(unLiked);

    const handleHeart = (e) => {
        if (heartType === unLiked) {
            TripLikes({
                variables : { Trip_Flights_ID: props.auth.tripInfo.Trip_ID }
            });

            setHeartImage(Liked)
        } else {
            TripUnLike({
                variables : { Trip_Flights_ID: props.auth.tripInfo.Trip_ID }
            });

            setHeartImage(unLiked)
        }
    }

    const handleBuy = (e) => {
        window.open("https://"+ decodeURIComponent(link).substring(6))
    }

    const history = useNavigate();
    function handleRoute(route) {
        history(route);
    }

    const baseAPIPath = props.flight.slice_data.slice_0;
    const link = props.flight.contract_page_url
    let durationString
    let duration = baseAPIPath.info.duration;
    duration = duration.split(":")
    if (duration[0] === "00" && duration[1] === "00") {
        durationString = `${parseInt(duration[2])}m`
    } else if (duration[0] === "00") {
        durationString = `${parseInt(duration[1])}h ${parseInt(duration[2])}m`
    } else {
        durationString = `${parseInt(duration[0])}d ${parseInt(duration[1])}h ${parseInt(duration[2])}m`
    }

    let stopCountString;
    let flightNumber;
    const departureTime = baseAPIPath.flight_data.flight_0.departure.datetime.time_12h;
    let arrivalTime = baseAPIPath.flight_data.flight_0.arrival.datetime.time_12h;
    if (parseInt(Object.keys(baseAPIPath.flight_data).length) === 1) {
        stopCountString = "Nonstop"
        flightNumber = `Flight #${baseAPIPath.flight_data.flight_0.info.flight_number}`;
    } else if (parseInt(Object.keys(baseAPIPath.flight_data).length) === 2) {
        stopCountString = `${Object.keys(baseAPIPath.flight_data).length - 1} Stop`;
        arrivalTime = baseAPIPath.flight_data.flight_1.arrival.datetime.time_12h;
        flightNumber = "Multiple Flights";
    } else {
        const lastFlight = Object.keys(baseAPIPath.flight_data).at(-1);
        stopCountString = `${Object.keys(baseAPIPath.flight_data).length - 1} Stops`;
        arrivalTime = baseAPIPath.flight_data[lastFlight].arrival.datetime.time_12h;
        flightNumber = "Multiple Flights";
    }

    const FlightDate = () => {
        if (baseAPIPath.departure.datetime.date === baseAPIPath.arrival.datetime.date) {
            return <AirPortCode><Moment format='MMMM Do'>{baseAPIPath.departure.datetime.date}</Moment></AirPortCode>
        } else {
            return <AirPortCode><Moment format='MMMM Do'>{baseAPIPath.departure.datetime.date}</Moment > - <Moment format="MMMM Do">{baseAPIPath.arrival.datetime.date}</Moment></AirPortCode>
        }    
    }

    let shortenedName = baseAPIPath.arrival.airport.name
    let shortenedName2 = baseAPIPath.departure.airport.name

    if (shortenedName.length > 25) {
        shortenedName = baseAPIPath.arrival.airport.name.substring(0,20)
        shortenedName += "..."
    }

    if (shortenedName2.length > 25) {
        shortenedName = baseAPIPath.departure.airport.name.substring(0,20)
        shortenedName += "..."
    }

  return (
        <Card theme={props.theme.theme}>
            <Heart onClick={handleHeart} src={heartType} />
            <BuyFlight onClick={handleBuy}>Buy Flight</BuyFlight>
            <Airport>
                <Row center>
                    {baseAPIPath.departure && baseAPIPath.departure.airport && <AirPortCode>{shortenedName2}<br></br>({baseAPIPath.departure.airport.code})</AirPortCode>}
                </Row>
                <Row>
                    <p>Departs</p>
                    {baseAPIPath.flight_data.flight_0.departure && baseAPIPath.flight_data.flight_0.departure.datetime && <FlightTime>{departureTime}</FlightTime>}
                </Row>
                <Row>
                    {baseAPIPath.flight_data.flight_0 && <p>{flightNumber}</p>}
                    {baseAPIPath.flight_data.flight_0 && <p>{stopCountString}</p>}
                </Row>
            </Airport>
            <FlightDuration>
                {baseAPIPath.departure && baseAPIPath.departure.datetime && baseAPIPath.arrival.datetime && <FlightDate />}

                <img src={Arrow} />
                {baseAPIPath.info && baseAPIPath.info.duration && <p style={{fontSize: '24px'}}>{durationString}</p>}
                {baseAPIPath && baseAPIPath.airline && <p>{baseAPIPath.airline.name}</p>}
                {baseAPIPath && baseAPIPath.airline && baseAPIPath.airline.logo && <img style={{width: '40px', height: '40px', marginBottom: '0'}} src={baseAPIPath.airline.logo} alt={baseAPIPath.airline.name} />}
            </FlightDuration>

            <Airport>
                <Row center>
                    {baseAPIPath.arrival && baseAPIPath.arrival.airport && <AirPortCode>{shortenedName}<br></br>({baseAPIPath.arrival.airport.code})</AirPortCode>}
                </Row>
                <Row end>
                    <p>Arrives</p>
                    {baseAPIPath.flight_data.flight_0.arrival && baseAPIPath.flight_data.flight_0.arrival.datetime && <FlightTime>{arrivalTime}</FlightTime>}
                </Row>
                <Row end>
                    {baseAPIPath.flight_data.flight_0 && <p>{baseAPIPath.flight_data.flight_0.info.cabin_name}</p>}
                    {baseAPIPath.flight_data.flight_0 && <p>Base Fare: ${props.flight.price_details.baseline_base_fare}</p>}
                </Row>
            </Airport>
        </Card>
  )
}

const Card = styled.div`
    width: 900px;
    border: 3px solid ${({ theme }) => theme.cardBorder};
    margin-bottom: 25px;
    background-color: ${({ theme }) => theme.body};
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const FlightDuration = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px 0;

    img {
        margin: 10px 0;
    }

    p {
        margin: 0;
    }
`;

const Airport = styled.div`
    flex: 1 0;
    display: flex;
    flex-direction: column;
    margin: 0 20px;
`;

const Row = styled.div`
    margin: 10px 0;
    display: flex;
    flex-direction: column;

    margin: ${props => props.center && '10px auto'};

    align-items: ${props => props.end ? 'flex-end' : 'flex-start'};

    p {
        margin: 0;
    }
    
`;

const AirPortCode = styled.p`
    font-size: 24px;
`;

const FlightTime = styled.p`
    font-size: 30px;
`;

const Heart = styled.img`
    position: relative;
    bottom: 105px;
    left: 865px;
    cursor: pointer;
`;
const BuyFlight = styled.p`
    position: relative;
    bottom: 105px;
    left: -15px;
    cursor: pointer;
    background-color: #308446;
    padding: 5px;
    border-radius: 4px;
    transition: 600ms;
    &:hover {
        transition: 600ms;
        transform: scale(1.2);
    }
`;

const mapStateToProps = (state) => {
    return state;
  }
  
  export default connect(mapStateToProps)(FlightCard);