import React from 'react';
import { string } from 'prop-types';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import DropdownComponent from '../Dropdown/index.js';
import { useHistory } from "react-router-dom";
import { ACCOUNT } from '../../constants/routes';
import './header.css';


const useStyles = createUseStyles((theme) => ({

    container: {
        height: 40
    },
    name: {
        textAlign: 'right',
        '@media (max-width: 768px)': {
            display: 'none'
        }
    },
    title: {
        fontSize: '20px',
        fontFamily: '\'DM Serif Display\', serif',
        '@media (max-width: 1080px)': {
            marginLeft: 50
        },
        '@media (max-width: 468px)': {
            fontSize: 20
        }
    },
    iconStyles: {
        cursor: 'pointer',
        marginLeft: 12,
        marginRight: 12,
        '@media (max-width: 768px)': {
            marginLeft: 12
        }
    },
    separator: {
        borderLeft: `1px solid gray`,
        marginLeft: 32,
        marginRight: 32,
        height: 22,
        width: 2,
        '@media (max-width: 768px)': {
            marginLeft: 14,
            marginRight: 0
        }
    },
    imageCtn: {
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        overflow: 'hidden',
        margin: '0 10px'
    },
    image: {
        height: '100%',
        width: 'auto'
    }
}));

function HeaderComponent({ name, profileImage }) {
    const theme = useTheme();
    let history = useHistory();
    const classes = useStyles({ theme });

    function onSettingsClick() {
        history.push(ACCOUNT);
    }

    return (
        <Row className={classes.container} vertical='center' horizontal='space-between'>
            
            <span></span>
            <Row vertical='center'>
                <DropdownComponent
                    label={
                        <>
                            <span className={classes.name}>{name}</span>
                            <div className={classes.imageCtn}>
                                <img
                                    src={profileImage ? profileImage : "https://firebasestorage.googleapis.com/v0/b/meetsy-f287c.appspot.com/o/images%2Fno-profile-picture-default.png?alt=media&token=8d9920f6-2ae1-4a79-88f1-82bbecb7ae6c"}
                                    alt='avatar'
                                    className={classes.image}
                                />
                            </div>
                        </>
                    }
                    options={[
                        {
                            label: 'Settings',
                            onClick: onSettingsClick
                        }
                    ]}
                    position={{
                        top: 52,
                        right: -6
                    }}
                />
            </Row>
        </Row>
    );
}


HeaderComponent.propTypes = {
    title: string
};

export default HeaderComponent;