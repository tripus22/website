import React from 'react'
import styled from 'styled-components';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import EarthImage from '../Images/EarthCrop.png';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";

function Home(props) {
    const history = useNavigate()

    function handleRoute(route) {
        console.log(route);
        history(route);
    }

    return (
        <Container>
            <Nav />
            <Content>
                <Introduction>
                    <Title theme={props.theme}>Howdy,</Title>
                    <SubTitle theme={props.theme}>Start Planning Your Next Trip</SubTitle>
                    {props.auth.auth === false && <StartButton onClick={() => handleRoute('/signup')}>Let's Begin!</StartButton>}
                    {props.auth.auth === true && <StartButton onClick={() => handleRoute('/myGroups')}>My Groups!</StartButton>}
                </Introduction>
                <BackgroundImage />
            </Content>
            <Footer />
        </Container>
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Home);

const Container = styled.div`
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10%;
    height: 100vh;
`;

const Introduction = styled.div`
    width: 550px;
    z-index: 1;

    @media (max-width: 650px) {
        width: 100%;
    }
`;

const Title = styled.p`
    font-size: 36px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin: 0;
    letter-spacing: .3rem;

    @media (max-width: 650px) {
        font-size: 18px;
    }
`;

const SubTitle = styled.p`
    font-size: 64px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin: 20px 0 0 0;
    letter-spacing: .3rem;

    @media (max-width: 650px) {
        font-size: 32px;
    }
`;

const StartButton = styled.button`
    margin: 30px auto 0;
    display: block;
    border-radius: 4px;
    padding: 20px 40px;
    background-color: #308446;
    font-size: 18px;
    font-weight: 700;
    border: none;
    color: white;
    transform: rotate(-5deg);
    transition: 600ms;
    cursor: pointer;

    &:hover {
        transition: 600ms;
        transform: rotate(5deg);
    }

    @media (max-width: 650px) {
        font-size: 12px;
    }
`;

const BackgroundImage = styled.div`
    position: fixed;
    background: url(${EarthImage}) no-repeat 100%;
    width: 100%;
    height: calc(100vh - 185px);
    bottom: 0;
    right: 0;
    z-index: -2;
`;