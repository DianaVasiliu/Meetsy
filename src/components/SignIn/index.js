import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForget';
import { withAuthorization } from '../Session';
import {form, inputCtn, StyledButton,SignContainer,  StyledInput, heading, errorMsg} from '../../styles';

const SignInLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignInPage = () => (
  <SignContainer>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </SignContainer>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
const inputStyle = {maxWidth: '350px', margin: '0'}

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
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
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form style={form} onSubmit={this.onSubmit}>
        <h3 style={heading}>Sign in</h3>
        <div style={inputCtn}>
          <StyledInput style = {inputStyle}
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          /></div>
        <div style={inputCtn}>
          <StyledInput style = {inputStyle}
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          /></div>
        <StyledButton disabled={isInvalid} type="submit">
          Sign In
        </StyledButton >

        {error && <p style={errorMsg}>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const condition = authUser => !authUser;
export default withAuthorization(condition)(SignInPage);

export { SignInForm, SignInLink };
