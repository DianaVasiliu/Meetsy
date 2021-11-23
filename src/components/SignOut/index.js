import React from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import IconSignOut from '../../assets/icon-sign-out.js';

const icon = {
  height: '23px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  outline: 'none'
};

const link = {
  textAlign: 'center'
};


const SignOutButton = ({ firebase }) => (
  <Link to={ROUTES.SIGN_IN} style={link} onClick={firebase.doSignOut}>
    <button style={icon} type="button">
      <IconSignOut color='white' />
    </button>
  </Link>
);

export default withFirebase(SignOutButton);