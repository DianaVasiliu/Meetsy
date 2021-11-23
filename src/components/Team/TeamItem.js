import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import styled from 'styled-components';
import { COLORS } from '../../constants/designConstants'
import { StyleSheet, css } from 'aphrodite';

const Container = styled.div`
background: rgb(0,89,124);
background: linear-gradient(0deg, rgba(0,89,124,1) 0%, rgba(82,182,154,1) 100%);
margin-top: 10%;
padding: 10%;
height: 310px;
width: 285px;
border-radius: 8px;
display:flex;
flex-direction: column;
justify-content: space-between;

h3,p {
    color: ${COLORS.bodyLight};
}
`;
const classes = StyleSheet.create({
  blackButton: {
    padding: '2% 7%',
    border: 'none',
    backgroundColor: 'black',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '32px',
    display: 'inline'
  }
})


class TeamItem extends Component {
  
  render() {
    const { team } = this.props;
    return (
      <Container>
        <h3>{team.name}</h3>
        {team.description ? <p>{team.description}</p> :
          <p>The description of the team.</p>}
        <div>
          <Link className={css(classes.blackButton)}
            to={{
              pathname: `${ROUTES.TEAM}/${team.uid}`
            }}
          >
            Details
          </Link>
        </div>
      </Container>
    );
  }
}
// folosim withFirebase pentru a putea accesa data de baza
// prin intermediul atributului this.props.firebase
export default withFirebase(TeamItem);