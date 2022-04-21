import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux';


function CardComp(props) {
  console.log(props);
  return (
    <StyledContainer theme={props.theme.theme}>
      <Photo src ={props.img} alt={props.name} Image/>
      <Name>{props.name}</Name>
      <Roles>{props.role}</Roles>
      <Row></Row>
      <Description>{props.desc}</Description>
    </StyledContainer>)
}

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: ${({ theme }) => theme.body};
  margin-right: 20px;
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  max-width: 275px;
  transition: 600ms;

  &:hover {
    transform: translateY(-15px);
    transition: 600ms;
  }

  @media (max-width: 1500px) {
    margin: 20px 0;
  }
`;

const Photo = styled.img`
    height: 150px;
    width: 150px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    margin: 20px auto 20px;
`;

const Name = styled.p`
  font-size: 24px;
  margin: 0;
`;

const Roles = styled.p`
  font-size: 14px;
`;

const Row = styled.div`
  width: 150px;
  border-top: 1px solid white;
  margin: 0 auto;
`;

const Description = styled.p`
  font-size: 14px;
  margin: 10px 5px;
`;

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(CardComp);

