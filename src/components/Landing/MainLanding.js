import React from 'react'
import styled from "styled-components";
import { withAuthorization } from '../Session';

const MainLanding = () => {
    return (
        <Container>
        </Container>
    )
}
const Container = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content:center;
align-items: center;

h1 {
    font-size: 50px;
    font-weight: 900;
    color: #fff;
    @media(max-width: 900px){
        display: none;
    }
}
`;

const condition = authUser => !authUser;
export default withAuthorization(condition)(MainLanding);
