import React, { useState } from 'react';
import styled from 'styled-components';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import Flight from "../Components/Flight";
import { Content } from '../Styles/global';
import {gql, useQuery} from "@apollo/client";
import {connect} from "react-redux";
import Loading from '../Components/Loading';
import PlusDark from '../Images/Icons/DarkMode/PlusLight.png'
import { store } from '../store/TripUsStore';
import request from "request";
import HotelCard from '../Components/HotelCard'
import HotelFilter from '../Components/HotelFilter'
import Group from "../Components/Group";
import * as util from 'util';
import { portalSuspended } from 'pg-protocol/dist/messages';

function AddHotel(props) {
  console.log(props.auth.filtData)
  
   

  let userId = null;
  if (!props.auth.userId) {
    userId = sessionStorage.getItem('userId');
  } else {
    sessionStorage.setItem('userId', props.auth.userId);
    userId = props.auth.userId;
  }

 


    const request = require('request');

    const options1 = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations',
      qs: {search_type: 'HOTEL', name: props.auth.filtData[5]},
      headers: {
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
        'X-RapidAPI-Key': '2b62108746msh76814bb9977a1f3p186515jsn0c0667276365',
        useQueryString: true
      }
    };

    // let testCity = "";
    const [isLoc, setIsLoc] = React.useState(false);
    React.useEffect(() => {
      request(options1, function (error, response, body1) {
        if (error) throw new Error(error);
        console.log(JSON.parse(body1))
        let dataArr1 = []
        const data1 = JSON.parse(body1)
        const keys1 = Object.keys(data1)
        keys1.forEach((key, index) => {
          dataArr1.push(data1[key])
        })
        console.log(dataArr1)
        console.log(dataArr1[0].cityID)
        store.dispatch({type: 'LOCATION_DATA', payload: dataArr1[0].id})
        // testCity = JSON.stringify(props.auth.locData);
        
        setIsLoc(true);
      });
    }, []);
 

    React.useEffect(() => {
      if (isLoc) {
        console.log(props.auth.locData);
        const options = {
          method: 'GET',
          url: 'https://priceline-com-provider.p.rapidapi.com/v1/hotels/search',
          qs: {
            date_checkin: props.auth.filtData[0],
            location_id: props.auth.locData,
            date_checkout: props.auth.filtData[1],
            sort_order: props.auth.filtData[3],
            amenities_ids: 'FINTRNT,FBRKFST',
            rooms_number: props.auth.filtData[2],
            star_rating_ids: props.auth.filtData[4]
            },
            headers: {
                'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
                'X-RapidAPI-Key': '2b62108746msh76814bb9977a1f3p186515jsn0c0667276365',
                useQueryString: true
            }
        };
    
        request(options, function (error, response, body) {
          console.log(error);
          if (error) {
            console.log(error);
            throw new Error(error);
          }
          console.log(JSON.parse(body))
          let dataArr = []
          if (!JSON.parse(body).hotels) {
            store.dispatch({type: 'HOTEL_DATA', payload: "none"})
            return
        }
          const data = JSON.parse(body).hotels
          const keys = Object.keys(data)
          keys.forEach((key, index) => {
              console.log(`${key}: ${data[key]}`)
              
              dataArr.push(data[key])
          })
          store.dispatch({type: 'HOTEL_DATA', payload: dataArr})
        });
      }
    }, [isLoc])

    const city = '47609'
    // const testCity = JSON.stringify(props.auth.locData);

    if (!props.auth.hotelData) {

        return (
            <Loading message="Finding Available Hotels..." />
        )

    }

    const NoResult = () => {
      return <p>No hotels found</p>

  }


    console.log(props.auth.hotelData)

    let filtered = []
    // filter out hotels that don't have a name 
    function hasName(value) {
      return value.name != null
    }

    if (props.auth.hotelData !== "none") {
    filtered = props.auth.hotelData.filter(hasName)
    } 
  else {
    filtered = props.auth.hotelData
}

  return (
    <Container>
      <Nav />
      <Title>
        <h1>Hotels</h1>
      </Title>
      
      <Content>

          {props.auth.hotelData === "none" ? <NoResult/> : filtered.map((hotel) => {
              return (<HotelCard hotel={hotel}/>);
          })}
      </Content>
      <Footer />
    </Container>
  )
}

const Container = styled.div`
 
`;

const Title = styled.div`
  text-align: center;
  margin-top: 100px;
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

export default connect(mapStateToProps)(AddHotel);