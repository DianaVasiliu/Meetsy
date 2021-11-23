import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import styled from "styled-components";
import { SignInLink } from '../SignIn';
import { StyledButton, inputCtn, StyledInput, SignContainer, form, heading, errorMsg } from '../../styles';


const SignUpPage = () => (
  <SignContainer>
    <SignUpForm />
    <div>
      <Terms>
        By signing up, I agree to the Privacy Policy <br />and Terms of Service.
      </Terms>
    </div>
    <SignInLink />
  </SignContainer>
);
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            userId: authUser.user.uid,
            teams: []
          },
            { merge: true });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form style={form} onSubmit={this.onSubmit}>
        <h3 style={heading}>Sign up</h3>
        <div style={inputCtn}>
          <StyledInput style={{ maxWidth: '350px', margin: '0' }}
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          /></div>
        <div style={inputCtn}>
          <StyledInput style={{ maxWidth: '350px', margin: '0' }}
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          /></div>
        <div style={inputCtn}>
          <StyledInput style={{ maxWidth: '350px', margin: '0' }}
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          /></div>
        <div style={inputCtn}>
          <StyledInput style={{ maxWidth: '350px', margin: '0' }}
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          /></div>
        <StyledButton disabled={isInvalid} type="submit">
          Sign Up
        </StyledButton >

        {error && <p style={errorMsg}>{error.message}</p>}
      </form>
    );
  }
}

const Terms = styled.p` 
   padding: 0 1rem;
   text-align: center;
   font-size: 11px;
   color: #fff;
   font-weight: 300;
`;
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);
const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };