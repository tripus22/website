import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import Transport from "../Components/Transport";
import { Content } from '../Styles/global';
import {gql, useQuery} from "@apollo/client";
import {connect} from "react-redux";
import Loading from '../Components/Loading';
import PlusDark from '../Images/Icons/DarkMode/PlusLight.png'
import { store } from '../store/TripUsStore';
import request from "request";

function AddTransport(props) {
  let userId = null;
    const [res, setRes] = React.useState(null);
  if (!props.auth.userId) {
    userId = sessionStorage.getItem('userId');
  } else {
    sessionStorage.setItem('userId', props.auth.userId);
    userId = props.auth.userId;
  }

  const GET_GROUPS = gql`query GetUserGroups ($User_ID: Int!){
      membership(where: {User_ID: {_eq: $User_ID}}) {
          Group {
              
              Group_Image
              memberships {
                  User_ID
              },
              Group_Name
              Group_Bio:
              Founding_Date
          }
      }
  }`

//   const myObj = {
//     name: "bus",
//     availble: true,
//     rating: 5,

//   };

//   store.dispatch({type: 'TRIP_DATA', payload :myObj})

  const {data, error, loading} = useQuery(GET_GROUPS, {
      variables : {User_ID : userId}
  });

  if(loading) {
      return (
          <Loading message="Finding Availible Transport..." />
      )
  }

  if(error) {
      return <p>{error}</p>;
  }
  console.log(data)

  return (
    <Container>
      <Nav />
      <Title>
        <h1>Transport Options</h1>
      </Title>
      <Content>
        {data && data.membership.length === 0
          ? <CreateGroup>
              <p>Create A Group</p>
              <img src={PlusDark} alt="" />
            </CreateGroup>
          : data.membership.map((group) => {

              return (<Transport groupInfo={group.Group} key={group.Group_ID}/>)
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

export default connect(mapStateToProps)(AddTransport);