import styled from 'styled-components';
import { COLORS } from './constants/designConstants';
import { StyleSheet } from 'aphrodite';

export const
    blackButton= {
        padding: '2% 7%',
        border: 'none',
        backgroundColor: 'black',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '32px',
        display: 'inline'
    };
  
export const form = {
  marginTop: '10%',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  boxSizing: 'initial'
};
export const heading = {
  marginBottom: '2rem',
  alignSelf: 'center'
};
export const StyledButton = styled.button`
width: 75%;
max-width: 350px;
min-width: 250px;
height: 40px;
border: none;
margin: 1rem 0;
box-shadow: 0px 14px 9 px -15px rgba(0,0,0,0.25);
border-radius: 32px;
background-color: #3e6ae1;
color: white;
font-weight: 600;
cursor: pointer;
align-self: center;
&:hover {
  background-color: #3457b1;
}
`;
export const inputCtn = {
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  margin: '0.5rem 0'
};
 export  const StyledInput = styled.input`
 width: 450px;
 margin-left:auto !important;
 margin-right:auto !important;
 color: ${COLORS.inputGrey};
 height: 40px;
 border: none;
 margin: 0.5rem 0;
 color: #393c41 !important;
 background-color: #f5f5f5;
 box-shadow:  0px 14px 9px -15px rgba(0,0,0,0.25);
 border-radius: 32px;
 padding:  0 1rem;
 &:hover{
  outline-width: 0;
 }
 &:focus{
  outline-width: 0;
  // border: 3px solid rgb(62,106,225,0.7);
 }
`;
export const StyledTextArea = styled.textarea`
 width: 450px;
 margin-right:auto !important;
 margin-left:auto !important;
 height: 100px;
 border: none;
 margin: 0.5rem 0;
 color: #393c41 !important;
 background-color: #f5f5f5;
 box-shadow:  0px 14px 9px -15px rgba(0,0,0,0.25);
 border-radius: 8px;
 padding:  1rem 1rem;
 &:hover{
  outline-width: 0;
 }
 &:focus{
  outline-width: 0;
  // border: 3px solid rgb(62,106,225,0.7);
 }
`;

  export const ButtonGroup = styled.div`
    top: 10;
    right: 0;
    position: absolute;
    `;
    
  export const buttonAction = {
      width: '38px',
      height: '38px',
      background: `${COLORS.primaryBg}`,
      marginRight: '10px',
      marginTop: '10px',
      borderRadius: '50%',
      border: 'none'
    };
 export const backButton = {
      position: 'absolute',
      left: '-40px',
      top: '0'
    };
 export const addButton = {
      display: 'inline',
      background: `${COLORS.complementaryDark}`
    }

export const MeetsyButton = styled.button`
border: none;
background-color: ${COLORS.primaryBlue};
color: white;
border-radius: 32px;
display: inline;
width: 70px;
height: 35px;
margin-left:auto;
box-shadow: 0px 14px 9 px -15px rgba(0,0,0,0.25);
color: white;
font-weight: 600;
cursor: pointer;
align-self: center;
&:hover {
  background-color: ${COLORS.shadowBlue}
}
`;

export const SignContainer = styled.div`
h4 {
   font-size: 14px;
   color: white;
   marginTop: 2rem;
}
display: flex;
flex-direction: column;
align-items: center;
p 
{
  color: #fff;
}
`;
export const MenuStyles = StyleSheet.create({
  activeBar: {
      height: 56,
      width: 3,
      backgroundColor: '#DDE2FF',
      position: 'absolute',
      left: 0
  },
  activeTitle: {
      color: '#DDE2FF'
  },
  container: {
      cursor: 'pointer',
      flexDirection: 'column',
      paddingTop: '18%',
      paddingBottom: '18%',
      ':hover': {
          backgroundColor: '#131516'
      }
  },
  title: {
      fontSize: 16,
      lineHeight: '20px',
      letterSpacing: '0.2px',
      color: '#A4A6B3',
      textDecoration: 'none'
  },
  iconCtn: {
      borderRadius: '50%'
  },
imageCtn: {
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    overflow: 'hidden'
},
image: {
    height: '100%',
    width: 'auto'
}
});

export const errorMsg = {
  textAlign: 'center',
  paddingTop: '1pc',
  paddingBottom: '1pc',
  color: COLORS.error,
  textWeight: 'bold'
};

export const successMsg = {
  textAlign: 'center',
  paddingTop: '1pc',
  paddingBottom: '1pc',
  color: COLORS.success,
  textWeight: 'bold'
};

export const StyledCheckbox = styled.input`
 width: 18px;
 height: 18px;
 margin-left:auto !important;
 margin-right:auto !important;
 margin: 0.5rem 0;
`;