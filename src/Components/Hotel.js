import React from 'react';
import styled from 'styled-components';
import { Button } from '../Styles/global';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

import InfoLight from '../Images/Icons/LightMode/Info.png';
import InfoDark from '../Images/Icons/DarkMode/InfoLight.png';

import CloseLight from '../Images/Icons/LightMode/Close.png';
import CloseDark from '../Images/Icons/DarkMode/CloseLight.png';

import CopyLight from '../Images/Icons/LightMode/Copy.png';
import CopyDark from '../Images/Icons/DarkMode/CopyLight.png';

import Train from '../Images/Icons/Transport/train.png';
import Bus from '../Images/Icons/Transport/bus.png';
import Car from '../Images/Icons/Transport/car.png';
import HotelLight from '../Images/Icons/LightMode/Hotel.png';




import Moment from 'react-moment';
import Modal from 'react-modal';
import '../Styles/Modal.css';
import { store } from '../store/TripUsStore';

function Hotel(props) {
    const history = useNavigate();

    const groupInfo = props.groupInfo;

    function handleRoute(route, groupInfo) {
        store.dispatch({type: 'GROUP_INFO', payload: groupInfo})
        sessionStorage.setItem('groupInfo', JSON.stringify(groupInfo));
        history(route);
    }

    const [modalOpen, setModalOpen] = React.useState(false);

    function openCloseModal() {
        setModalOpen(current => !current);
    }

    function Members({members}) {
        return members.map((member) => {
            return <li>{member.User.Display_Name}</li>
        });
    }

    const iconNum = 0;
    let myIcon;
    if (iconNum == 0) {
        myIcon = HotelLight;
    } else if(iconNum == 1){
        myIcon = Bus;
    } else if(iconNum == 2){
        myIcon = Bus;
    } else if(iconNum == 3){
        myIcon = Bus;
    }

    return (
        <Container theme={props.theme.theme}>
            <Column style={{width: '50%'}}>
            <IconButtonDiv style={{display: 'flex'}} theme={props.theme.theme}>
                  {props.theme.theme.type === 'dark'
                    ? <Icon src={myIcon} />
                    : <Icon src={myIcon} />}
                    <Item> Ritz </Item>
                  </IconButtonDiv>
            </Column>
            <Column style={{margin: '20px 0 0 0'}}>
                <Row style={{flexDirection: 'row'}}>
                    <Title>{'Hotel Name'}</Title>
                   
                    <ReactToolTipStyled id="GroupInfoTip" type="info" place="right" effect="solid">
                        {groupInfo.Group_Bio}
                    </ReactToolTipStyled>
                </Row>
                <Row>
                    <p>Seats Available: <Moment format='LL'>{groupInfo.Founding_Date}</Moment></p>
                    {groupInfo.memberships.length === 1
                    ?  <MemberCount onClick={openCloseModal}>{groupInfo.memberships.length} Member</MemberCount>
                    :  <MemberCount onClick={openCloseModal}>{groupInfo.memberships.length} Members</MemberCount>}
                    <Modal
                        isOpen={modalOpen}
                        onRequestClose={openCloseModal}
                    >
                        <CloseDiv>
                            <img onClick={openCloseModal} src={CloseLight}/>
                        </CloseDiv>
                        <MemberHeader>
                            <p>Members</p>
                        </MemberHeader>
                        <MemberList>
                            <Members members={groupInfo.memberships}/>
                        </MemberList>
                    </Modal>
            
                </Row>
                <Row>
                    <SelectGroup onClick={() => handleRoute('/hotelDetails', groupInfo)}>Book Hotel</SelectGroup>
                </Row>
            </Column>
        </Container>
    );
}

const Container = styled.div`
    /* min-width: calc(100% - 200px); */
    width: 600px;
    border: 3px solid ${({ theme }) => theme.cardBorder};
    border-radius: 4px;
    display: flex;
    justify-content: space-between;

    margin-bottom: 50px;
    background-color: ${({ theme }) => theme.body};
`;

const Column = styled.div`
    width: 100%;
    align-items: center;
    
    p {
        font-size: 16px;
    }
`;

const GroupPicture = styled.img`
    margin: 10px 0 10px 10px;
    border-radius: 4px;
    max-width: 100%;
    height: 50px;
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

const MemberCount = styled.p`
    text-decoration: underline;
    margin: 10px 0 0 0;
    cursor: pointer;
`;

const CloseDiv = styled.div`
    display: flex;
    justify-content: flex-end;

    img {
        height: 20px;
        width: 20px;
    }
`

const MemberHeader = styled.div`
    display: flex;
    justify-content: center;
    font-size: 22px;
    
    p {
        margin: 0;
    }
`;

const MemberList = styled.p`

`;


const SelectGroup = styled.a`
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    background-color: #308446;
    transition: 600ms;
    cursor: pointer;
    display: block;
    width: 150px;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
    position: relative;
    
    &:hover {
        transition: 600ms;
        transform: scale(1.2);
    }
`;

const IconButtonDiv = styled.div`
  align-items: center;
  margin: 80px 60px;
  transition: 600ms;
  z-index: 1;
  display: block;
`;

const Icon = styled.img`
    width: 50px;
    height: 50px;
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

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Hotel);
