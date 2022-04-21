import React, {useEffect} from 'react';
import styled from 'styled-components';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import Trip from "../Components/Trip";
import {gql, useMutation, useQuery} from "@apollo/client";
import {connect} from "react-redux";
import Loading from '../Components/Loading';
import PlusDark from '../Images/Icons/DarkMode/PlusLight.png'
import { useNavigate } from "react-router";
import TrashDark from '../Images/Icons/DarkMode/TrashLight.png'
import SettingsDark from '../Images/Icons/DarkMode/SettingsLight.png';

function MyTrips(props) {
  let groupId = null;
  let groupInfo = null;
  console.log(props);
  if (props && props.auth && props.auth.groupInfo) {
    sessionStorage.setItem('groupInfo', JSON.stringify(props.auth.groupInfo));
    groupId = props.auth.groupInfo.Group_ID;
    groupInfo = props.auth.groupInfo;
  } else {
    groupInfo = JSON.parse(sessionStorage.getItem('groupInfo'));
    groupId = groupInfo.Group_ID;
  }

  const userProfile = props.auth.userProfile;


  const history = useNavigate();
  function handleRoute(route) {
      history(route);
  }

  const DELETE_GROUP = gql`mutation deleteGroup ($Group_ID: Int!){
    delete_Group_by_pk(Group_ID: $Group_ID) {
      Group_ID
    }
  }`;

  const [pressedDelete, setPressedDelete] = React.useState(false)

  function DeleteGroupFunction() {
    setPressedDelete(true);
  }

  const HandleGroupDeletion = () => {
    const [deleteGroup] = useMutation(DELETE_GROUP);

    if(pressedDelete) {
      let proceed = window.confirm(`Are you sure you want to delete the ${groupInfo.Group_Name} group`);
      if (proceed) {
        console.log(groupId)

        useEffect(() => {

          deleteGroup({
            variables: {Group_ID: groupId}
          });

        }, []);

        setPressedDelete(current => !current);
      }
    }

    window.location.reload(false);
    handleRoute('/myGroups')
    return null;
  }


  const GET_TRIPS = gql`query GetTripTrips ($Group_ID: Int!){
    Trip_memberships(where: {Group_ID: {_eq: $Group_ID}}) {
      Trip {
        Trip_ID
        Destinations
        Start_Date
        End_Date
        Trip_Bio
        Trip_Name
        Trip_Image
        Departures
      }
    }
}`

  const {data, error, loading} = useQuery(GET_TRIPS, {
    variables : {Group_ID : groupId}
  });

  if(loading) {
    return (
      <Loading message="Let Your Adventure Begin..." />
    )
  }

  if(error) {
    return <p>{error}</p>;
  }

  const isCoLeader = groupInfo.memberships.map((member) => {
    if (member.User.User_ID === userProfile.User_ID && member.Role === "Co-Leader") {
      return true;
    }
    return false;
  });

  console.log(isCoLeader);
  return (
    <Container>
      <Nav />
      <Title>
        <h1>{groupInfo.Group_Name} Trip's</h1>
      </Title>
      <DeleteGroup src={TrashDark}/>
      {data && data.Trip_memberships.length === 0
        ? groupInfo.Leader_ID === userProfile.User_ID  || isCoLeader.includes(true)
          ? <NoTrips>
              <GroupNavButton onClick={() => handleRoute('/createTrip')}>
                <p>Create A Trip</p>
                <img src={PlusDark} alt="Add" />
              </GroupNavButton>
              or
              <GroupNavButton onClick={() => handleRoute('/GroupSettings')}>
                <p>Group Settings</p>
                <img src={SettingsDark} alt="Settings" />
              </GroupNavButton>
              or
              <DeleteGroup onClick={DeleteGroupFunction}>
                <p>Delete Group</p>
                <img src={TrashDark} alt="Delete" />
              </DeleteGroup>
              {pressedDelete && <HandleGroupDeletion />}
            </NoTrips> 
          : <Waiting>
              <h1>Group Leader or Co-Leader Needs to Make a Trip</h1>
            </Waiting>
        : <>
            {groupInfo.Leader_ID === userProfile.User_ID  || groupInfo.CoLeader_ID === userProfile.User_ID
              ?<TripNav>
                  <GroupNavButton style={{backgroundColor: '#AC9F3C'}} onClick={() => handleRoute('/myGroups')}> Back to My Groups </GroupNavButton>
                  <GroupNavButton onClick={() => handleRoute('/createTrip')}>
                    <p>Create A Trip</p>
                    <img src={PlusDark} alt="Add" />
                  </GroupNavButton>
                  <GroupNavButton onClick={() => handleRoute('/GroupSettings')}>
                    <p>Group Settings</p>
                    <img src={SettingsDark} alt="Settings" />
                  </GroupNavButton>
                  <DeleteGroup onClick={DeleteGroupFunction}>
                    <p>Delete Group</p>
                    <img src={TrashDark} alt="Delete" />
                  </DeleteGroup>
                  {pressedDelete && <HandleGroupDeletion />}
                </TripNav>
              : null }
            <Content>
              {data.Trip_memberships.map((trip) => {
                return (<Trip showAccessTrip  tripInfo={trip.Trip} key={trip.Trip_ID} />);
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

const NoTrips = styled.div`
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
  width: 200px;
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

const TripNav = styled.div`
  margin: 50px auto;
  display: flex;
  justify-content: space-around;
  width: 80%;
`;

const DeleteGroup = styled(GroupNavButton)`
  background-color: #c70000;

  img {
    width: 20px;
    height: 20px;
  }
`;

const Waiting = styled.div`
  min-height: calc(100vh - 198px);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 20%;
`

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(MyTrips);