import React from 'react';
import styled from 'styled-components';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import CardComp from '../Components/CardComp';
import EmilyImage from '../Images/Team/Emily.png';
import HoImage from '../Images/Team/Ho.jpeg';
import BunkImage from '../Images/Team/mattb.png';
import MaddieImage from '../Images/Team/Maddie.jpeg';
import EliImage from '../Images/Team/Eli.jpeg';

function MeetTeam(props) {
    return (
         <Container>
             <Nav />
            <Content> 
                <Title theme={props.theme}>Team Members</Title>
                <CardDiv>
                    <CardComp img={HoImage} name="Matthew Ho" role="Backend Developer" desc="Howdy! I am a senior computer science major with a minor in business. I am from Tomball, Texas (NW Houston) and I play ultimate frisbee for Texas A&M."/> 
                    <CardComp img={MaddieImage} name="Maddie Foster" role="Backend &#9679; Database Developer" desc="Howdy! My name is Maddie Foster, I'm a Senior Computer Science major with minors in Business and Cybersecurity. I'm from Sugar Land, TX and enjoy planning road trips with my friends."/> 
                    <CardComp img={BunkImage} name="Matthew Bunker" role="Frontend &#9679; Backend Developer" desc="Howdy! I am a senior computer science major with a minor in business. I am from Tomball, Texas (NW Houston) and I play ultimate frisbee for Texas A&M."/>
                    <CardComp img={EmilyImage} name="Emily Murphy" role="Backend &#9679; Database Developer" desc="Howdy! I am a senior at Texas A&M majoring Computer Science with a minor and emphasis in Cybersecurity. I'm originally from New Hampshire and a cool fact about me is that I was the captain of my swim team in high school!"/> 
                    <CardComp img={EliImage} name="Eli Hawkins" role="Frontend &#9679; Backend Developer" desc="Howdy! I am a senior computer science major with a minor in business. I am from Tomball, Texas (NW Houston) and I play ultimate frisbee for Texas A&M."/> 
                </CardDiv>
            </Content> 
            <Footer /> 
         </Container> 
       
    );
}

export default MeetTeam;

const Container = styled.div`
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10%;
    min-height: 100vh; 
    width: 100%;
    
    @media (max-width: 1500px) {
        padding: 200px 10%;
        align-items: center;
    }
`;

const Title = styled.p`
    font-size: 48px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin: 0;
    letter-spacing: .3rem;

    @media (max-width: 650px) {
        font-size: 18px;
    }
`;

const CardDiv = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    justify-content: space-between;

    @media (max-width: 1500px) {
        flex-direction: column;
        justify-content: center;
    }
`;





