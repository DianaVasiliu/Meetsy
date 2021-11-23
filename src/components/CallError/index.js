import React from 'react';
import { Component } from 'react';
import { withAuthorization } from '../Session';
import {compose} from 'recompose';
import { StyledButton } from '../../styles';
import {withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
class Error extends Component {
  constructor(props){
    super(props);
   
  }
 
  render() {

    return (
      <div style={{position:'relative', marginLeft: 'auto', marginRight: 'auto', marginTop:'auto', marginBottom: 'auto'}}>
      <h1>Error 101  - Hey, you little troublemaker...</h1>
      <p>Seems like you are already in that call. Press the button below to return home.
      </p>
      <StyledButton style = {buttonStyle} onClick = {() => this.props.history.push(ROUTES.HOME)}>Home</StyledButton>
    </div>
   
    )
  }
}
const buttonStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: '250px',
  minWidth: '150px'
}
const condition = authUser => !!authUser;
export default compose(withRouter, withAuthorization(condition))(Error);