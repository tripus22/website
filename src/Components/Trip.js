import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

import InfoLight from '../Images/Icons/LightMode/Info.png';
import InfoDark from '../Images/Icons/DarkMode/InfoLight.png';

import Moment from 'react-moment';
import { store } from '../store/TripUsStore';

function Trip(props) {
    const history = useNavigate();

    const tripInfo = props.tripInfo;

    function handleRoute(route, tripInfo) {
        store.dispatch({type: 'TRIP_INFO', payload: tripInfo})
        sessionStorage.setItem('tripInfo', JSON.stringify(tripInfo));
        history(route);
    }

    return (
        <Container theme={props.theme.theme}>
                <Column style={{width: '50%'}}>
                    <TripPicture src={tripInfo.Trip_Image} alt="Trip Picture"/>
                </Column>
                <Column style={{margin: '20px 0 0 0'}}>
                    <Row style={{flexDirection: 'row'}}>
                        <Title>{tripInfo.Trip_Name}</Title>
                        {props.theme.theme.type === "dark"
                        ? tripInfo.Trip_Bio !== null && <InfoToolTip data-tip data-for="tripInfoTip" src={InfoDark}/>
                        : tripInfo.Trip_Bio !== null && <InfoToolTip data-tip data-for="tripInfoTip" src={InfoLight}/>}
                        <ReactToolTipStyled id="tripInfoTip" type="info" place="right" effect="solid">
                            {tripInfo.Trip_Bio}
                        </ReactToolTipStyled>
                    </Row>
                    <Row>
                        <p>{tripInfo.Departures} -&gt; {tripInfo.Destinations}</p>
                        <p><Moment format='LL'>{tripInfo.Start_Date}</Moment> - <Moment format='LL'>{tripInfo.End_Date}</Moment></p>
                    </Row>
                    {props.showAccessTrip
                    && <Row>
                        <SelectTrip onClick={() => handleRoute('/tripDetails', tripInfo)}>Access Trip</SelectTrip>
                    </Row>}
                </Column>
            </Container>
    );
}

const Container = styled.div`
    /* min-width: calc(100% - 200px); */
    width: 900px;
    border: 3px solid ${({ theme }) => theme.cardBorder};
    border-radius: 4px;

    display: flex;
    justify-content: space-between;

    margin-bottom: 50px;
    background-color: ${({ theme }) => theme.body};
`;

const Column = styled.div`
    width: 100%;

    p {
        font-size: 16px;
    }
`;

const TripPicture = styled.img`
    margin: 10px 0 10px 10px;
    border-radius: 4px;
    max-width: 100%;
    height: 200px;
    background-color: white;
`;

const Row = styled.div`
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
        margin: 10px 0 0 0;
    }
`;

const Title = styled.p`
    font-size: 30px !important;
    margin-right: 15px !important;
`;

const InfoToolTip = styled.img`

`;

const ReactToolTipStyled = styled(ReactTooltip)`
    width: 200px;
`;

const SelectTrip = styled.a`
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    background-color: #308446;
    transition: 600ms;
    cursor: pointer;
    display: block;
    width: 125px;
    margin-top: 20px;
    text-align: center;

    &:hover {
        transition: 600ms;
        transform: scale(1.2);
    }
`;

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Trip);
