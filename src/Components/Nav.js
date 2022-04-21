import React from 'react'
import styled from 'styled-components';
import { Button } from '../Styles/global';
import { useNavigate } from "react-router-dom";
import LightDarkMode from './LightDarkModeToggle';
import DarkModeLogo from '../Images/darkModeLogo.png';
import LightModeLogo from '../Images/lightModeLogo.png';
import { slide as Menu } from 'react-burger-menu';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import Moment from 'react-moment';

import WaveDay from '../Images/WaveDay.svg';
import Cloudy from '../Images/Cloudy.svg';

import SignUpLight from '../Images/Icons/LightMode/SignUp.png';
import SignUpDark from '../Images/Icons/DarkMode/SignUpLight.png';

import LoginLight from '../Images/Icons/LightMode/Login.png';
import LoginDark from '../Images/Icons/DarkMode/LoginLight.png';

import MyTripsLight from '../Images/Icons/LightMode/MyTrips.png';
import MyTripsDark from '../Images/Icons/DarkMode/MyTripsLight.png';

import PlusLight from '../Images/Icons/LightMode/Plus.png';
import PlusDark from '../Images/Icons/DarkMode/PlusLight.png';

import LogoutLight from '../Images/Icons/LightMode/Logout.png';
import LogoutDark from '../Images/Icons/DarkMode/LogoutLight.png';

import SettingsLight from '../Images/Icons/LightMode/Settings.png';
import SettingsDark from '../Images/Icons/DarkMode/SettingsLight.png';

import JoinGroupLight from '../Images/Icons/LightMode/JoinGroup.png';
import JoinGroupDark from '../Images/Icons/DarkMode/JoinGroupLight.png';

import '../Styles/nav.css';
import { store } from '../store/TripUsStore';
import auth from '../reducers/auth';


function Nav(props) {
    const history = useNavigate();

    function handleRoute(route) {
        history(route);
    }

    function handleLogOut() {
      store.dispatch({type: 'IS_AUTHENTICATED', payload: false });
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('userProfile');
      sessionStorage.removeItem('groupInfo');
      sessionStorage.removeItem('tripInfo');
      sessionStorage.removeItem('userId');
      history("/");
    }

    let isAuthenticated = null;
    let userProfile = null;
    if (sessionStorage.getItem('isAuthenticated')) {
      isAuthenticated = true;
      userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
      if (!props.auth.auth) {
        store.dispatch({type: 'IS_AUTHENTICATED', payload: true });
        store.dispatch({type: 'USER_PROFILE', payload: userProfile });
      }
    } else {
      isAuthenticated = props.auth.auth;
      userProfile = props.auth.userProfile;
    }

    var styles = {
        bmBurgerButton: {
          position: 'fixed',
          width: '36px',
          height: '30px',
          left: '36px',
          top: '36px'
        },
        bmBurgerBars: {
          background: 'white'
        },
        bmBurgerBarsHover: {
          background: '#308446'
        },
        bmCross: {
          background: '#bdc3c7'
        },
        bmMenuWrap: {
          position: 'fixed',
          height: '100%',
        },
        bmMenu: {
          background: '#2d2d2d',
          padding: '2.5em 1.5em 0',
          fontSize: '1.15em',
        },
        bmMorphShape: {
          fill: '#373a47'
        },
        bmItemList: {
          color: '#b8b7ad',
          padding: '0.8em',
          display: 'flex',
          flexDirection: 'column',
        },
        bmItem: {
          display: 'inline-block'
        },
        bmOverlay: {
          background: 'rgba(0, 0, 0, .7)'
        }
      }

    
    if (props.theme.theme.type === 'light') {
        styles.bmBurgerBars.background = '#2d2d2d';
        styles.bmMenu.background = 'white';
    }
    
    console.log(props);
    return (
        <Container>
            <Menu styles={styles}>
                <LogoDiv className='nav-logo' onClick={() => handleRoute('/')}>
                    {
                    props.theme.theme.type === 'dark'
                     ?  <img src={DarkModeLogo} alt="TripUs" />
                     :  <img src={LightModeLogo} alt="TripUs" /> 
                    }

                </LogoDiv>
                {isAuthenticated === false
                ? (
                <>
                  <IconButtonDiv style={{ display: 'flex' }} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={LoginDark} />
                    : <Icon src={LoginLight} />}
                    <Item theme={props.theme.theme} onClick={() => handleRoute('/login')}>Log In</Item>
                  </IconButtonDiv>
                  <IconButtonDiv style={{ display: 'flex' }} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={SignUpDark} />
                    : <Icon src={SignUpLight} />}
                    <Item theme={props.theme.theme} onClick={() => handleRoute('/signup')}>Sign Up</Item>
                  </IconButtonDiv>
                </>)
                : (
                <>
                  <IconButtonDiv style={{ display: 'flex' }} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={MyTripsDark} />
                    : <Icon src={MyTripsLight} />}
                    <Item theme={props.theme.theme} onClick={() => handleRoute('/myGroups')}> My Groups</Item>
                  </IconButtonDiv>
                  <IconButtonDiv style={{display: 'flex'}} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={PlusDark} />
                    : <Icon src={PlusLight} />}
                    <Item theme={props.theme.theme} onClick={() => handleRoute('/createGroup')}> Create Group</Item>
                  </IconButtonDiv>
                  <IconButtonDiv style={{display: 'flex'}} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={JoinGroupDark} />
                    : <Icon src={JoinGroupLight} />}
                    <Item theme={props.theme.theme} onClick={() => handleRoute('/joinGroup')}> Join Group</Item>
                  </IconButtonDiv>
                  <IconButtonDiv style={{display: 'flex'}} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={SettingsDark} />
                    : <Icon src={SettingsLight} />}
                    <Item theme={props.theme.theme} onClick={() => handleRoute('/settings')}> Settings</Item>
                  </IconButtonDiv>
                  <IconButtonDiv style={{ display: 'flex' }} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={LogoutDark} />
                    : <Icon src={LogoutLight} />}
                    <Item theme={props.theme.theme} onClick={handleLogOut}>Log Out</Item>
                  </IconButtonDiv>
                </>)}
                <BackgroundImage theme={props.theme.theme} />
            </Menu>
            <Tripus onClick={() => handleRoute('/')} theme={props.theme.theme}>TripUs</Tripus>
            <LightDarkMode />
            <RightDiv>
              {isAuthenticated && userProfile && userProfile.Profile_Image && 
              <>
              <ProfileImage onClick={() => handleRoute('/settings')} data-tip data-for="UserProfileImage" src={userProfile.Profile_Image} />


              <ReactToolTipStyled id="UserProfileImage" place="bottom" type={props.theme.theme.type === 'dark' ? 'dark' : 'light'} effect="solid">
                  <p><strong>Username: </strong>{userProfile.Display_Name}</p>
                  <p><strong>Name: </strong>{userProfile.First_Name} {userProfile.Last_Name}</p>
                  <p><strong>Birthday: </strong><Moment format='LL'>{userProfile.User_DOB}</Moment></p>
                  <p><strong>Gender: </strong>{userProfile.Gender}</p>
                  <p><strong>Email: </strong>{userProfile.Email}</p>
                  {userProfile.Impairments && <p><strong>Disablilities: </strong>{userProfile.Impairments}</p>}
                  {userProfile.Bio && <p><strong>Bio: </strong>{userProfile.Bio}</p>}
              </ReactToolTipStyled>
              </>}
              
              {isAuthenticated === true
              ? <LogIn onClick={handleLogOut} circle>Log Out</LogIn>
              : <LogIn onClick={() => handleRoute('/login')} circle>Log In</LogIn>}
            </RightDiv>
        </ Container>
    )
}

const BackgroundImage = styled.div`
    position: absolute;
    background: url(${({ theme }) => theme.type === 'light' ? WaveDay : Cloudy}) no-repeat 100%;
    width: 100%;
    height: calc(100vh);
    bottom: -270px;
    right: 0;
    overflow: hiddem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RightDiv = styled.div`
  position: relative;
  top: 35px;
  right: 25px;
  display: flex;
  justify-content: space-between;
  width: 150px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  object-fit: cover;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const ReactToolTipStyled = styled(ReactTooltip)`
    width: 250px;
    display: flex;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const LogIn = styled.button`
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    background-color: #308446;
    color: white;
    font-size: 16px;
    transition: 600ms;
    cursor: pointer;

    &:hover {
        transition: 600ms;
        transform: scale(1.2);
    }
`;

const LogoDiv = styled.div`
    img {
        width: 100px;
        height: 73px;
    }
    cursor: pointer;
    z-index: 1;
`;

const IconButtonDiv = styled.div`
  align-items: center;
  margin: 20px 0 20px 0;
  transition: 600ms;
  z-index: 1;
    
  &:hover {
    transition: 600ms;
    padding: 5px 5px;
  }
`;

const Icon = styled.img`
    width: 25px;
    height: 25px;
    background-color: #308446;
    border-radius: 50%;
    padding: 5px;
`;

const Item = styled(Button)`
    margin-left: 10px;
    letter-spacing: .3rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    font-size: 18px;
    z-index: 1;

    &:hover {
      color: ${({ theme }) => theme.type === 'light' ? '#2d2d2d;' : "white;"}
    }
`;

const Tripus = styled.p`
    position: fixed;
    top: 20px;
    left: 100px;
    font-size: 18px;
    font-style: oblique;
    letter-spacing: .1rem;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    z-index: 1;
`;

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Nav);
