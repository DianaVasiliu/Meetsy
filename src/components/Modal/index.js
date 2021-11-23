import React  from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants/designConstants';
import {MeetsyButton} from '../../styles';
const ModalMain = styled.div`
    position:fixed;
    background-color: ${COLORS.complementaryDark};
    width: 500px;
    height: auto;
    padding: 30px;
    border-radius: 12px;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
`;
  
const StyledModal = styled.div` 
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }
`;

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? {display: "block"} : {display: "none"};
    console.log(children, show);
    return (
      <StyledModal style = {showHideClassName}>
        <ModalMain>
          {children}
          <MeetsyButton style={{marginLeft: '10px'}} onClick={handleClose}>
            Close
          </MeetsyButton>
          </ModalMain>
        </StyledModal>
    );
  };

export default Modal;