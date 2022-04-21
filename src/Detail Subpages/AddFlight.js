import React from 'react';
import styled from 'styled-components';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import Flight from "../Components/Flight";
import {connect} from "react-redux";
import Loading from '../Components/Loading';
import { store } from '../store/TripUsStore';
import FlightCard from '../Components/FlightCard'
import TripNav from '../Components/TripNav';

function AddFlight(props) {
  let flightFilter

  if (props.auth.filtData) {
      flightFilter = props.auth.filtData
    sessionStorage.setItem('FlightFilterData', JSON.stringify(props.auth.filtData));
  } else {
    flightFilter = JSON.parse(sessionStorage.getItem('FlightFilterData'));
    store.dispatch({type: 'FILTER_DATA', payload: flightFilter});
  }

    // if (props.auth.locData) {
    //     sessionStorage.setItem('LocData1', props.auth.locData);
    // } else {
    //     loc = sessionStorage.getItem('LocData1');
    //     store.dispatch({type: 'LOCATION_DATA', payload: loc});
    // }
    //
    // if (props.auth.locData2) {
    //     sessionStorage.setItem('LocData2', props.auth.locData2);
    // } else {
    //     loc2 = sessionStorage.getItem('LocData2');
    //     store.dispatch({type: 'LOCATION_DATA2', payload: loc2});
    // }

    const request = require('request');

    const departureOptions = {
        method: 'GET',
        url: 'https://priceline-com-provider.p.rapidapi.com/v1/flights/locations',
        qs: {name: flightFilter.departurecode},
        headers: {
            'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
            'X-RapidAPI-Key': '2b62108746msh76814bb9977a1f3p186515jsn0c0667276365',
            useQueryString: true
        }
    };

    const arrivalOptions = {
        method: 'GET',
        url: 'https://priceline-com-provider.p.rapidapi.com/v1/flights/locations',
        qs: {name: flightFilter.arrivalcode},
        headers: {
            'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
            'X-RapidAPI-Key': '2b62108746msh76814bb9977a1f3p186515jsn0c0667276365',
            useQueryString: true
        }
    };

    const [isLoc, setIsLoc] = React.useState(false);
    const [isLoc2, setIsLoc2] = React.useState(false);
    React.useEffect(() => {
        request(departureOptions, function (error, response, body) {
            if (error) throw new Error(error);
            const result = JSON.parse(body)
            if (!result[0]) {
                store.dispatch({type: 'FLIGHT_DATA', payload: "none"})
                return
            }
            store.dispatch({type: 'LOCATION_DATA', payload: result[0].id})
            setIsLoc(true)
        });
    }, []);

    React.useEffect(() => {

        request(arrivalOptions, function (error, response, body) {
            if (error) throw new Error(error);
            const result = JSON.parse(body)
            if (!result[0]) {
                store.dispatch({type: 'FLIGHT_DATA', payload: "none"})
                return
            }
            store.dispatch({type: 'LOCATION_DATA2', payload: result[0].id})
            setIsLoc2(true)
        });
    }, [isLoc]);




    React.useEffect(() => {
        console.log(props.auth.locData)
        console.log(props.auth.locData2)
        if (props.auth.locData && props.auth.locData2) {
            const options = {
                method: 'GET',
                url: 'https://priceline-com-provider.p.rapidapi.com/v2/flight/departures',
                qs: {
                    departure_date: props.auth.filtData.departure,
                    sid: 'iSiX639',
                    adults: 1,
                    destination_airport_code: props.auth.locData2,
                    origin_airport_code: props.auth.locData
                },
                headers: {
                    'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
                    'X-RapidAPI-Key': '2b62108746msh76814bb9977a1f3p186515jsn0c0667276365',
                    useQueryString: true
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(JSON.parse(body))
                let dataArr = []
                if (!JSON.parse(body).getAirFlightDepartures.results) {
                    store.dispatch({type: 'FLIGHT_DATA', payload: "none"})
                    return
                }
                const data = JSON.parse(body).getAirFlightDepartures.results.result.itinerary_data
                const keys = Object.keys(data)
                keys.forEach((key, index) => {
                    console.log(`${key}: ${data[key]}`)
                    dataArr.push(data[key])
                })
                store.dispatch({type: 'FLIGHT_DATA', payload: dataArr})
            });
        }
    }, [isLoc2, isLoc]);

    if (!props.auth.flightData) {

        return (
            <Loading message="Finding Available Flights..." />
        )

    }

    console.log(props.auth.flightData)

    const NoResult = () => {
        return <h1>No flights found. Please make sure that you have entered correct date and locations.</h1>
    }

    let dataArr = []
    if (props.auth.flightData !== "none" && flightFilter.maxprice) {
        props.auth.flightData.map((flight) => {
            if (flight.price_details.baseline_base_fare <= flightFilter.maxprice) {
                dataArr.push(flight)
            }
        })

        if (dataArr.length === 0) {
            store.dispatch({type: 'FLIGHT_DATA', payload: "none"})
        }
    } else {
        dataArr = props.auth.flightData
    }

  return (
    <Container>
      <Nav />
      <Content>
        <TripNav />
        <Title>Flights
            {props.auth.flightData !== "none" && <br></br> && <p>{dataArr[0].slice_data.slice_0.departure.airport.city} {dataArr[0].slice_data.slice_0.departure.airport.state} -> {dataArr[0].slice_data.slice_0.arrival.airport.city} {dataArr[0].slice_data.slice_0.arrival.airport.state}</p>}
        </Title>

        {props.auth.flightData === "none" ? <NoResult/> : dataArr.map((flight) => {
            return (<FlightCard flight={flight}/>);
        })}
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
    text-align: center; 
`;

const Title = styled.p`
  text-align: center;
  margin: 50px 0;
  font-size: 36px;
`;

const CreateGroup = styled.div`
  display: flex;
  border: none;
  padding: 0px 5px;
  border-radius: 20px;
  background-color: #308446;
  transition: 600ms;
  cursor: pointer;
  align-items: center;
  p {
    color: white;
    font-size: 16px;
    margin-right: 5px;
  }
  img{
    height: 30px;
    width: 30px;
  }
  
  &:hover {
      transition: 600ms;
      transform: scale(1.2);
    }
`;

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(AddFlight);