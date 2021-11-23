import React from 'react';
import { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import styled from "styled-components";
import { StyledButton } from '../../styles';
import * as ROUTES from "../../constants/routes";
import { withRouter } from 'react-router-dom';


const exploreButton = {
  maxWidth: '150px',
  minWidth: '100px',
  height: '40px'
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myTeams: [],
      loading: false
    }
  }

  componentDidMount() {
    this.onGetTeams();
  }

  onGetTeams = () => {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase.users()
      .onSnapshot(snapshot => {

        let myTeams = [];
        console.log("GETTING TEAMS");

        snapshot.forEach(doc => {
          console.log(doc.data());
          console.log(this.props.firebase.authUser.teams);
          myTeams = this.props.firebase.authUser.teams;
        });

        console.log("echipe:", myTeams);

        this.setState({
          myTeams: myTeams,
          loading: false
        });

      });
  }

  render() {

    return (
      <div>

        <Container>
          <MainContainer>
            <h3>Welcome back, {this.props.firebase.authUser.username}</h3>
            <p>You are a member of {this.state.myTeams.length} teams.</p>
            <FirstFrame>
              <InnerFirstFrame>
                <h4>Always reach higher</h4>
                <p>Never stop chasing those dreams. Learning is a treasure that <br/>
                  will follow its owner everywhere. — Chinese Proverb </p>
                <StyledButton style={exploreButton} onClick={() => { this.props.history.push(ROUTES.SHOW_TEAMS); }}>
                  Explore
                </StyledButton>
              </InnerFirstFrame>
            </FirstFrame>

          </MainContainer>
        </Container>
      </div>
    )
  }
}

const InnerFirstFrame = styled.div`
  display:flex;
  flex-direction:column;
  padding-left: 10%;

`;

const MainContainer = styled.div`
width:100%;height:100%;justify-content:center;
`;
const Container = styled.div`
display:flex;
width: 100%;
height: 100%;
justify-content: space-between;
`;

const FirstFrame = styled.div` 
 margin-top: 3%;
 width: 78%;
 height: 300px;
 background: rgb(0,89,124);
 background: linear-gradient(0deg, rgba(0,89,124,1) 0%, rgba(82,182,154,1) 100%);
 border-radius: 32px;
 display:flex;
 align-items: center;
 margin-left:auto;
 margin-right:auto;
`;
const condition = authUser => !!authUser;
export default compose(withRouter, withFirebase, withAuthorization(condition))(Home);
