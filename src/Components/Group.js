import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import {gql, useMutation} from "@apollo/client";

import InfoLight from '../Images/Icons/LightMode/Info.png';
import InfoDark from '../Images/Icons/DarkMode/InfoLight.png';

import CloseLight from '../Images/Icons/LightMode/Close.png';
import CloseDark from '../Images/Icons/DarkMode/CloseLight.png';

import CopyLight from '../Images/Icons/LightMode/Copy.png';
import CopyDark from '../Images/Icons/DarkMode/CopyLight.png';

import Moment from 'react-moment';
import Modal from 'react-modal';
import '../Styles/Modal.css';
import { store } from '../store/TripUsStore';

function Group(props) {
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

    const ADD_CoLeader = gql`mutation updatemembership ($User_ID: Int!, $GroupID: Int!, $Role: String!) {
        update_membership_by_pk(pk_columns: {User_ID: $User_ID, Group_ID: $GroupID}, _set:{Role: $Role}) {
            Role
        }
    }`;

    const [promoteMember] = useMutation(ADD_CoLeader);
    function handlePromote(User_ID, role) {
        promoteMember({
            variables: {User_ID: User_ID, GroupID: groupInfo.Group_ID, Role: role}
        });
    }

    function Members({members}) {
        const userId = props.auth.userProfile.User_ID;
        return members.map((member) => {
            if (member.User.User_ID === groupInfo.Leader_ID && member.User.User_ID === userId) {
                return <li style={{color: 'green'}}>{member.User.Display_Name} (Leader) (You)</li>
            } else if (member.User.User_ID === groupInfo.Leader_ID) {
                return <li style={{color: 'green'}}>{member.User.Display_Name} (Leader)</li>
            } else if (member.Role === "Co-Leader" && member.User.User_ID === userId) {
                return <li style={{color: 'green'}}>{member.User.Display_Name} (Co-Leader) (You)</li>
            } else if (userId === groupInfo.Leader_ID && member.Role === "Co-Leader") {
                return <li style={{display: 'flex', marginTop: '5px'}}>{member.User.Display_Name} (Co-Leader) <AddMember onClick={() => handlePromote(member.User.User_ID, "Member")}>Make Member</AddMember></li>
            } else if (userId === groupInfo.Leader_ID && member.Role === "Member") {
                return <li style={{display: 'flex', marginTop: '5px'}}>{member.User.Display_Name} <AddCo_Leader onClick={() => handlePromote(member.User.User_ID, "Co-Leader")}>Make Co-Leader</AddCo_Leader></li>
            } else if (member.Role === "Co-Leader") {
                return <li style={{color: 'green'}}>{member.User.Display_Name} (Co-Leader)</li>
            } else if (member.User.User_ID === userId) {
                return <li>{member.User.Display_Name} (You)</li>
            }
            return <li style={{marginTop: '5px'}}> {member.User.Display_Name} </li>
        });
    }

    const [copyText, setCopyTexted] = React.useState(`Join Code: ${groupInfo.Join_Code}`);
    const copy = async (JoinCode) => {
        await navigator.clipboard.writeText(JoinCode);
        setCopyTexted('Copied');
        setTimeout(function() { setCopyTexted(`Join Code: ${groupInfo.Join_Code}`) },3000)
    }

    return (
        <Container theme={props.theme.theme}>
            <Column style={{width: '50%'}}>
                <GroupPicture src={groupInfo.Group_Image} alt="Picture"/>
            </Column>
            <Column style={{margin: '20px 0 0 0'}}>
                <Row style={{flexDirection: 'row'}}>
                    <Title>{groupInfo.Group_Name}</Title>
                    {props.theme.theme.type === "dark"
                    ? groupInfo.Group_Bio !== null && <InfoToolTip data-tip data-for="GroupInfoTip" src={InfoDark}/>
                    : groupInfo.Group_Bio !== null && <InfoToolTip data-tip data-for="GroupInfoTip" src={InfoLight}/>}
                    <ReactToolTipStyled id="GroupInfoTip" type="info" place="right" effect="solid">
                        {groupInfo.Group_Bio}
                    </ReactToolTipStyled>
                </Row>
                <Row>
                    <p>Est: <Moment format='LL'>{groupInfo.Founding_Date}</Moment></p>
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
                    {props.theme.theme.type === "dark"
                    ? <JoinCode onClick={() => copy(groupInfo.Join_Code)}>{copyText}<img src={CopyDark}/></JoinCode>
                    : <JoinCode onClick={() => copy(groupInfo.Join_Code)}>{copyText}<img src={CopyLight}/></JoinCode>}
                </Row>
                <Row>
                    <SelectGroup onClick={() => handleRoute('/myTrips', groupInfo)}>View Trips</SelectGroup>
                </Row>
            </Column>
        </Container>
    );
}

const Container = styled.div`
    /* min-width: calc(100% - 200px); */
    width: 1000px;
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

const GroupPicture = styled.img`
    margin: 10px 0 10px 10px;
    border-radius: 4px;
    width: 100%;
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

const JoinCode = styled.p`
    position: relative;
    top: -130px;
    left: 220px;
    cursor: pointer;
    margin-right: 5px !important;

    img {
        height: 20px;
        width: 20px;
        position: relative;
        top: 5px;
        right: -3px;
    }

    &:focus {
        color: green;
    }

`;

const SelectGroup = styled.a`
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    background-color: #308446;
    transition: 600ms;
    cursor: pointer;
    display: block;
    width: 125px;
    margin-top: 10px;
    text-align: center;
    position: relative;
    bottom: 20px;
    color: white;
    &:hover {
        transition: 600ms;
        transform: scale(1.2);
    }
`;

const AddCo_Leader = styled(SelectGroup)`
    padding: 5px 10px;
    font-size: 10px;
    color: white;
    display: block;
    width: max-content;
    margin-top: 0;
    margin-left: 15px;
    text-align: center;
    position: relative;
    bottom: 0;
`;

const AddMember = styled(AddCo_Leader)`
    background-color: red;
`;

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Group);
