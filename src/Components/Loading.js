import React from 'react'
import Nav from './Nav'
import { Content } from '../Styles/global';
import Footer from './Footer';
import {ThreeDots} from 'react-loader-spinner';
import {connect} from "react-redux";

function Loading(props) {
  const message = props.message;
  let dotColor = "black";
  if(props.theme.theme.type === "dark") {
    dotColor = "white";
  }

  return (
    <div>
        <Nav />
        <Content>
          <ThreeDots
            color={dotColor}
            height={100}
            width={100}
            
          />
          <h1>{message}</h1>
        </Content>
        <Footer />
    </div>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Loading);