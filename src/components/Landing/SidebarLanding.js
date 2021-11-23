import React from 'react'
import styled from 'styled-components';
import { Column } from 'simple-flexbox';
import * as ROUTES from '../../constants/routes';
import { useHistory } from "react-router-dom";
import {StyledButton} from '../../styles';

function SidebarLanding() {

  const history = useHistory();
  const routeSignIn = () => {
    history.push(ROUTES.SIGN_IN);
  }
  const routeSignUp = () => {
    history.push(ROUTES.SIGN_UP);
  }

  return (
    <Container>
      <LogoWrapper>
        <h3>
          Meet<span>sy</span></h3>

      </LogoWrapper>
      <p>Reach higher. <br />Join us to shape the future.</p>
      <Column style={{ width: '100%' }}>
        <StyledButton onClick={routeSignIn}>
          Sign In
          </StyledButton>
        <StyledButton onClick={routeSignUp}>
          Sign Up
          </StyledButton></Column>
    </Container>
  )
}

const LogoWrapper = styled.div`
  h3 
  {
      text-align: center;
      color: white;
      font-size: 18px;

  }
 
  span
  {
     color:  #3e6ae1;     
     font-weight: 300;
     font-size:20px; 
  }
`;
const Container = styled.div`
min-width: 500px;
background-color: rgb(19, 21, 22);
height: 100%;
display: flex;
justify-content: space-evenly;
flex-direction: column;
align-items: center;
padding: 0 2 rem;
@media(max-width: 900px)
{
    width: 100vw;
    position:absolute;
    padding: 0;
}
p{
    text-align: center;
    color: white;
    font-size: 24px;
  }
`;
export default SidebarLanding;
