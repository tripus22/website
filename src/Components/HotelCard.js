import React from 'react'
import styled from 'styled-components';
import France from '../Images/france.jpg';
import {connect} from "react-redux";
import Liked from '../Images/Icons/liked.png';
import unLiked from '../Images/Icons/unliked.png';
import Star from '../Images/Icons/Star.png';
import NoStar from '../Images/Icons/NoStar.png';
import Location from '../Images/Icons/Location.png';
import Breakfast from '../Images/Icons/Breakfast.png';
import Wifi from '../Images/Icons/Wifi.png';
import Pets from '../Images/Icons/Pets.png';
import Gym from '../Images/Icons/Gym.png';
import Handicap from '../Images/Icons/Handicap.png';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { store } from '../store/TripUsStore';

function HotelCard(props) {
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

    const upVote = gql`mutation update_Trip_Flights ($Trip_Hotels_ID: Int!) {
        update_Trip_Hotels_by_pk(
            pk_columns: {Trip_Hotels_ID: $Trip_Hotels_ID}, 
            _inc: { Upvotes: 1 }
            ) {
            Upvotes
        }
      }`

    const downVote = gql`mutation update_Trip_Flights ($Trip_Hotels_ID: Int!) {
        update_Trip_Hotels_by_pk(
            pk_columns: {Trip_Hotels_ID: $Trip_Hotels_ID}, 
            _inc: { Upvotes: -1 }
            ) {
            Upvotes
        }
      }`

    const [TripLikes] = useMutation(upVote);
    const [TripUnLike] = useMutation(downVote);
    const [heartType, setHeartImage] = React.useState(unLiked);

    const handleHeart = () => {
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

const baseAPIPath = props.hotel;
let starCount = baseAPIPath.starRating;
let hotelName = baseAPIPath.name
let line1 = baseAPIPath.location.address.addressLine1
let city = baseAPIPath.location.address.cityName
let countryName = baseAPIPath.location.address.countryName
let address = line1 + ", " + city + ", " + countryName
let rate = "From $" + baseAPIPath.ratesSummary.minPrice
let hotelPicture = baseAPIPath.thumbnailUrl


if(baseAPIPath.name.length > 41){
    hotelName = hotelName.substring(0,38) + "... "
}

function getStars() {
    if(starCount < 1){  
        return (<StarDiv>     
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />
         </StarDiv>)
    }
    else if(starCount < 2){  
        return (<StarDiv>     
       <StarImg src={Star} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />        
        </StarDiv>)
    }
    else if(starCount < 3){  
        return (<StarDiv>     
       <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />        
        </StarDiv>)
    }
    else if(starCount < 4){  
        return (<StarDiv>     
       <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={NoStar} />
        <StarImg src={NoStar} />        
        </StarDiv>)
    }
    else if(starCount < 5){  
        return (<StarDiv>     
       <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={NoStar} />        
        </StarDiv>)
    }
    else{  
        return (<StarDiv>     
       <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={Star} />
        <StarImg src={Star} />        
        </StarDiv>)
    }

  }
 
 


  return (
    <Container theme={props.theme.theme}>
        <Heart onClick={handleHeart} src={heartType} />
        <Column>
            <GroupPicture src={hotelPicture} alt="Picture"/>
        </Column>
        <Column style={{margin: '0 0 0 20px'}}>
            <Row>
                <Title>{hotelName && hotelName && hotelName}</Title>
                <p>{baseAPIPath.brand}</p>
                {getStars()}
                <LocationDiv>
                    <LocationImg src={Location}/>
                    <p>{address}</p>
                </LocationDiv>
                
                <AmenitiesDiv>
                {/* {<img src={getAmen[0]} /> */}
                {baseAPIPath.hotelFeatures.hotelAmenityCodes.includes("FINTRNT") &&  <img src={Wifi} />}
                {baseAPIPath.hotelFeatures.hotelAmenityCodes.includes("FBRKFST") &&  <img src={Breakfast} />}
                {baseAPIPath.hotelFeatures.hotelAmenityCodes.includes("FITSPA") &&  <img src={Gym} />}
                {baseAPIPath.hotelFeatures.hotelAmenityCodes.includes("PETALLOW") &&  <img src={Pets} />}
                {baseAPIPath.hotelFeatures.hotelAmenityCodes.includes("HANDFAC") &&  <img src={Handicap} />}
                </AmenitiesDiv>
                <Rate>{rate}</Rate>
            </Row>
        </Column>
        </Container>
  )
}

const Container = styled.div`
    /* min-width: calc(100% - 200px); */
    width: 900px;
    border: 3px solid ${({ theme }) => theme.cardBorder};
    border-radius: 4px;
    display: flex;
    margin-bottom: 50px;
    background-color: ${({ theme }) => theme.body};
`;

const Column = styled.div`
    p {
        font-size: 16px;
    }
`;

const GroupPicture = styled.img`
    margin: 10px 0 10px 0px;
    border-radius: 4px;
    max-width: 100%;
    height: 200px;
`;

const Row = styled.div`
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    display: flex;
    flex-direction: column;
    text-align: left;
    p {
        margin: 5px 0 ;
    }
    div {
        margin-bottom: 5px;
    }
`;

const Title = styled.p`
    font-size: 24px !important;
`;

const Heart = styled.img`
    position: relative;
    top: 15px;
    left: 850px;
    cursor: pointer;
    height: 24px;
    width: 24px;
`;

const StarDiv = styled.div`
    display: flex;
    width: max-content;
`;

const StarImg = styled.img`
    width: 24px;
    height: 24px;
    margin: 0 3px;
`;

const LocationDiv = styled.div`
    display: flex;
    align-items: center;
`;

const LocationImg = styled.img`
    width: 24px;
    height: 24px;
    margin-right: 5px;
`;

const AmenitiesDiv = styled.div`
    img {
        height: 24px;
        width: 24px;
        margin: 3px;
    }
`;

const Rate = styled.p`
    background-color: green;
    padding: 5px;
    width: max-content;
    border-radius: 4px;
    color: white;
`;

const mapStateToProps = (state) => {
    return state;
  }
  
  export default connect(mapStateToProps)(HotelCard);