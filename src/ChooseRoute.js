import React from 'react';

// Main Pages
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import MyGroups from './Pages/MyGroups';
import Signup from './Pages/Signup';
import MyTrips from './Pages/MyTrips';
import MeetTeam from './Pages/MeetTeam';
import { Routes, Route } from "react-router-dom";
import Settings from './Pages/Settings';

// Profile Stuff
import CreateProfile from './Pages/CreateProfile';
import EditEmail from './settings subpages/profile settings/EditEmail';
import EditPass from './settings subpages/profile settings/EditPass';
import EditName from './settings subpages/profile settings/EditName';
import EditDisplayName from './settings subpages/profile settings/EditDisplayName';
import ChangeProfilePic from './settings subpages/profile settings/ChangeProfilePic';
import EditBirthday from './settings subpages/profile settings/EditBirthday';
import EditImpairment from './settings subpages/profile settings/EditImpairment';
import EditDependent from './settings subpages/profile settings/EditDependent';
import EditAboutInfo from './settings subpages/profile settings/EditAboutInfo';
import EditGender from './settings subpages/profile settings/EditGender';

// Group Stuff
import CreateGroup from './Pages/CreateGroup';
import GroupSettings from './Pages/GroupSettings';
import JoinGroup from './Pages/JoinGroup';
import AddMembers from './Pages/AddMembers';
import ChangeImage from './settings subpages/group settings/ChangeImage';
import ChangeLead from './settings subpages/group settings/ChangeLead';
import EditBio from './settings subpages/group settings/EditBio';
import EditGroupName from './settings subpages/group settings/EditGroupName';

// Trip Stuff
import CreateTrip from './Pages/CreateTrip';
import TripDetails from './Pages/TripDetails';
import TripSettings from './Pages/TripSettings';
import ChangeTripImage from './settings subpages/trip settings/ChangeTripImage';
import ChangeTripDest from './settings subpages/trip settings/ChangeTripDest';
import ChangeTripSD from './settings subpages/trip settings/ChangeTripSD';
import ChangeTripED from './settings subpages/trip settings/ChangeTripED';
import ChangeTripDept from './settings subpages/trip settings/ChangeTripDept';
import ChangeTripName from './settings subpages/trip settings/ChangeTripName';
import ChangeTripBio from './settings subpages/trip settings/ChangeTripBio';
import TransportDetails from './Pages/TransportDetails';
import ExcursionDetails from './Pages/ExcursionDetails';
import FlightDetails from './Pages/FlightDetails';
import HotelDetails from './Pages/HotelDetails';
import EditTransport from './Detail Subpages/EditTransport';
import AddTransport from './Detail Subpages/AddTransport';
import EditExcursion from './Detail Subpages/EditExcursion';
import AddExcursion from './Detail Subpages/AddExcursion';
import EditFlight from './Detail Subpages/EditFlight';
import AddFlight from './Detail Subpages/AddFlight';
import EditHotel from './Detail Subpages/EditHotel';
import AddHotel from './Detail Subpages/AddHotel';
import HotelFilter from './Components/HotelFilter';
import FlightFilter from './Components/FlightFilter';
//import TripDetails from './Pages/TripDetails';
import CreateGroupInfo from './Pages/CreateGroupInfo';




export default function ChooseRoute() {
  
  return (
    <Routes>
      <Route exact path="*" element={<Landing />} />
      <Route exact path="/MeetTeam" element={<MeetTeam />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/myGroups" element={<MyGroups />} />
      <Route exact path="/myTrips" element={<MyTrips />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/createprofile" element={<CreateProfile />} />
      <Route exact path="/joinGroup" element={<JoinGroup />} />
      <Route exact path="/createGroup" element={<CreateGroup />} />
      <Route exact path="/addMembers" element={<AddMembers />} />
      <Route exact path="/settings" element={<Settings />} />
      <Route exact path="/CreateGroupInfo" element={<CreateGroupInfo />} />

      //Group Stuff
      <Route exact path="/groupSettings" element={<GroupSettings />} />
      <Route exact path="/changeImage" element={<ChangeImage />} />
      <Route exact path="/changeLead" element={<ChangeLead />} />
      <Route exact path="/editBio" element={<EditBio />} />
      <Route exact path="/editGroupName" element={<EditGroupName />} />

      //Profile Stuff
      <Route exact path="/editEmail" element={<EditEmail />} />
      <Route exact path="/editPass" element={<EditPass />} />
      <Route exact path="/editName" element={<EditName />} />
      <Route exact path="/editDisplayName" element={<EditDisplayName />} />
      <Route exact path="/changeProfPic" element={<ChangeProfilePic />} />
      <Route exact path="/editBirth" element={<EditBirthday />} />
      <Route exact path="/editImpairment" element={<EditImpairment />} />
      <Route exact path="/editDependent" element={<EditDependent />} />
      <Route exact path="/editaboutInfo" element={<EditAboutInfo />} />
      <Route exact path="/editGender" element={<EditGender />} />

      // Trip Stuff
      <Route exact path="/createTrip" element={<CreateTrip />} />
      <Route exact path="/tripSettings" element={<TripSettings />} />
      <Route exact path="/tripName" element={<ChangeTripName/>} />
      <Route exact path="/tripBio" element={<ChangeTripBio/>} />
      <Route exact path="/tripImage" element={<ChangeTripImage/>} />
      <Route exact path="/tripDest" element={<ChangeTripDest/>} />
      <Route exact path="/tripDept" element={<ChangeTripDept/>} />
      <Route exact path="/tripSD" element={<ChangeTripSD/>} />
      <Route exact path="/tripED" element={<ChangeTripED/>} />
      <Route exact path="/tripDetails" element={<TripDetails />} />
      <Route exact path="/transportDetails" element={<TransportDetails />} />
      <Route exact path="/excursionDetails" element={<ExcursionDetails />} />
      <Route exact path="/flightDetails" element={<FlightDetails />} />
      <Route exact path="/hotelDetails" element={<HotelDetails />} />
      <Route exact path="/editTransport" element={<EditTransport />} />
      <Route exact path="/addTransport" element={<AddTransport />} />
      <Route exact path="/editExcursion" element={<EditExcursion />} />
      <Route exact path="/addExcursion" element={<AddExcursion />} />
      <Route exact path="/editFlight" element={<EditFlight />} />
      <Route exact path="/addFlight" element={<AddFlight />} />
      <Route exact path="/editHotel" element={<EditHotel />} />
      <Route exact path="/addHotel" element={<AddHotel />} />
      <Route exact path="/hotelFilter" element={<HotelFilter />} />
      <Route exact path="/flightFilter" element={<FlightFilter />} />

      

    </Routes>
  );
};
