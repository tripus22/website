import React from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from '../Styles/global';
import { useNavigate } from "react-router-dom";
import LogoDark from '../Images/darkModeLogo.png';
import LogoLight from '../Images/lightModeLogo.png';

function Footer(props) {
    const history = useNavigate()
    window.scrollTo(0, 0);

    function handleRoute(route) {
        history(route);
    }
  
    return (
    <Container theme={props.theme.theme}>
        <Content>
            <Item>How TripUs Works</Item>
            <Item onClick={() => handleRoute('/MeetTeam')}>Meet the Team</Item>
            <Item theme={props.theme.theme}>Contact Us: <a href="mailto:TripUs482@gmail.com">TripUs482@gmail.com</a></Item>
            <Policy>2022 TripUs, Spring Capstone Project.</Policy>
            {props.theme.theme.type === "dark"
            ? <LogoImage src={LogoDark} />
            : <LogoImage src={LogoLight} />}
        </Content>
    </Container>
  )
}

const Container = styled.div`
    background-color: ${({ theme }) => theme.secondaryColor};
    width: 100%;
    color: ${({ theme }) => theme.text};
`;

const Content = styled.div`
    margin: 0 10%;
    padding: 40px 0 0 0;
`;

const Item = styled(Button)`
    margin: 5px 0;
    font-size: 18px;
    text-decoration: underline;

    a {
        color: ${({ theme }) => theme.text};
    }
`;

const Policy = styled.p`
    margin-top: 40px;
    text-align: center;
    font-size: 18px;
`;

const LogoImage = styled.img`
    width: 170px;
    height: 150px;
    position: relative;
    top: -175px;
    left: 80%;
`;

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Footer);