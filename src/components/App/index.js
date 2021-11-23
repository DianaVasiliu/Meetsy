import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import CalendarPage from '../Calendar';
import AdminPage from '../Admin';
import Room from '../Room';
import Meet from '../Meet'
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import HeaderComponent from '../Header';
import { COLORS } from '../../constants/designConstants';
import { UserItem, UserList } from '../Users';
import TeamComponent from '../Team/TeamComponent';
import TeamCollection from '../Team/TeamCollection';
import { compose } from 'recompose';
import LoadingScreen from 'react-loading-screen';
import CallError from '../CallError';
const styles = StyleSheet.create({

  content: {
    marginTop: 54
  },
  mainBlock: {
    // backgroundColor: '#F7F8FC',
    // #1C1F21 #131516 
    backgroundColor: '#131516',
    padding: 30,
    minHeight: '100vh',
    color: `${COLORS.body}`
  }
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      this.setState({ loading: true })
      console.log("Out here!", this.state.loading);
      if (authUser) {
        console.log("In here!");
        this.props.firebase.user(authUser.uid)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }
            // merge auth and db user
            console.log(dbUser);
            this.props.firebase.authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };
            console.log("Loading-ul este: ", this.state.loading)
            console.log(this.props.firebase.authUser);
            this.setState({ loading: false })
          });
      } else {
        console.log("Loading-ul este pe callback: ", this.state.loading)
        this.setState({ loading: false })
      }
    });
  }
  render() {
    if (this.state.loading)
      return (
        <LoadingScreen loading={true}
          bgColor={COLORS.primaryBg}
          textColor={COLORS.body}
          text='Meetsy'
        >
        </LoadingScreen>
      );
    return (
      <Router>
        <div>
          <Row className={css(styles.container)}>

            <Navigation />
            <Column flexGrow={1} className={css(styles.mainBlock)}>
              <AuthUserContext.Consumer>
                {authUser =>
                  authUser && this.state.loading === false && this.props.firebase.authUser ? <HeaderComponent name={this.props.firebase.authUser.username} profileImage={this.props.firebase.authUser.profileImage} /> : void 0
                }
              </AuthUserContext.Consumer>
              <Route exact path={ROUTES.LANDING} component={LandingPage} />
              <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route
                path={ROUTES.PASSWORD_FORGET}
                component={PasswordForgetPage}
              />
              <Route path={ROUTES.ROOM} component={Room} />
              <Route path={ROUTES.HOME} component={HomePage} />
              <Route path={ROUTES.ACCOUNT} component={AccountPage} />
              <Route path={ROUTES.ADMIN} component={AdminPage} />
              <Route path={ROUTES.CALENDAR} component={CalendarPage} />
              <Route path={ROUTES.USERS} component={UserList} />
              <Route path={ROUTES.USER_DETAILS} component={UserItem} />
              <Route path={ROUTES.SHOW_TEAMS} component={TeamCollection} />
              <Route path={ROUTES.CALLERROR} component={CallError} />
              <Route path="/meet/:url" component={Meet} />
              <Route path="/showteam/:teamId" component={TeamComponent} />
            </Column>
          </Row>
        </div>
      </Router>
    );
  }
}


export default compose(withFirebase, withAuthentication)(App);