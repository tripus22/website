import React from 'react';
import styled from 'styled-components';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import Group from "../Components/Group";
import {gql, useQuery} from "@apollo/client";
import {connect} from "react-redux";
import Loading from '../Components/Loading';
import PlusDark from '../Images/Icons/DarkMode/PlusLight.png'
import JoinDark from '../Images/Icons/DarkMode/JoinGroupLight.png';
import { useNavigate } from "react-router";

function MyGroups(props) {
  let userId = null;
  if (props && props.auth && props.auth.userProfile && props.auth.userProfile.User_ID) {
    sessionStorage.setItem('userId', props.auth.userProfile.User_ID);
    userId = props.auth.userProfile.User_ID;
  } else {
    userId = sessionStorage.getItem('userId');
  }

  const history = useNavigate();
  function handleRoute(route) {
      // window.location.reload(false);
      history(route);
  }

  const GET_GROUPS = gql`query GetUserGroups ($User_ID: Int!){
      membership(where: {User_ID: {_eq: $User_ID}}) {
          Group {
              Group_ID
              Group_Image
              Join_Code
              memberships {
                Role
                User {
                  Display_Name
                  User_ID
                }
              },
              Group_Name
              Group_Bio
              Founding_Date
              Join_Code
              Leader_ID
              CoLeader_ID
          }
      }
  }`

  const {data, error, loading} = useQuery(GET_GROUPS, {
      variables : {User_ID : userId}
  });

  if(loading) {
      return (
        <Loading message="Finding Your Friends..." />
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
        <h1>My Groups</h1>
      </Title>
      {data && data.membership.length === 0
        ? <NoMembers>
            <GroupNavButton onClick={() => handleRoute('/joingroup')}>
              <p>Join A Group</p>
              <img src={JoinDark} alt="" />
            </GroupNavButton>
            or
            <GroupNavButton onClick={() => handleRoute('/createGroup')}>
              <p>Create A Group</p>
              <img src={PlusDark} alt="" />
            </GroupNavButton>
          </NoMembers> 
        : <>
            <GroupNav>
              <GroupNavButton onClick={() => handleRoute('/createGroup')}>
                <p>Create A Group</p>
                <img src={PlusDark} alt="" />
              </GroupNavButton>
              <GroupNavButton onClick={() => handleRoute('/joingroup')}>
                <p>Join A Group</p>
                <img src={JoinDark} alt="" />
              </GroupNavButton>
            </GroupNav>
            <Content>
              {data.membership.map((group) => {
                return (<Group groupInfo={group.Group} key={group.Group_ID} />);
              })}
            </Content>
          </>}
        <Footer />
    </Container>
  )
}

const Container = styled.div`
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10%;
    align-items: center;
    min-height: calc(100vh - 312px);
    align-items: center;
`;

const Title = styled.div`
  text-align: center;
  margin: 75px 0 0;
`;

const NoMembers = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  align-items: center;
  min-height: calc(100vh - 207px);
`;

const GroupNavButton = styled.div`
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

const GroupNav = styled.div`
  margin: 50px auto;
  display: flex;
  justify-content: space-around;
  max-width: 900px;
  
`;

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(MyGroups);