import React from 'react'
import styled from 'styled-components';

function ActivitiesCard() {
  return (
    <Container>
        <Title>Activites Choices</Title>
    </Container>
  )
}

const Container = styled.div`
    width: 100%;
    text-align: left;
`;

const Title = styled.p`
    font-size: 36px;
`;

export default ActivitiesCard