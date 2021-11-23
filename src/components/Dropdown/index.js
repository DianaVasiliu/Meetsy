import React, { useState } from 'react';
import { arrayOf, element, func, number, oneOfType, shape, string } from 'prop-types';
import { Column } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import IconArrowUp  from '../../assets/icon-arrow-up.js';

const useStyles = createUseStyles((theme) => ({
    arrowContainer: {
        position: 'absolute',
        top: -19,
        right: 15,
        zIndex: 100
    },
    dropdownButton: {
        alignItems: 'center',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        padding: 0,
        outline: 'none'
    },
    dropdownContainer: {
        position: 'relative'
    },
    dropdownItemsContainer: {
        background: 'white',
        borderRadius: 5,
        minWidth: 170,
        zIndex: 100,
        padding: 0,
        position: 'absolute',
        width: '100%',
        color: 'black',
        top: ({ position }) => position.top,
        right: ({ position }) => position.right,
        bottom: ({ position }) => position.bottom,
        left: ({ position }) => position.left,
        '& button:first-of-type:hover div > svg > path': {
            fill:'#A8D0E6'
        }
    },
    dropdownItem: {
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        fontSize: 16,
        outline: 'none',
        padding: '10px 10px',
        '&:hover': {
            background: '#A8D0E6'
        },
        '&:after': {
            content: '" "',
            display: 'block',
            position: 'relative',
            bottom: -10,
            width: '100%',
            height: 1,
            background: '#A8D0E6'
        },
        '&:last-child:after': {
            content: '',
            display: 'none'
        }
    }
}));

function DropdownComponent({ label, options, position }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const theme = useTheme();
    const classes = useStyles({ theme, position });

    function onDropdownClick() {
        setUserMenuOpen((prev) => !prev);
    }

    function onItemClick(onClick) {
        setUserMenuOpen(false);
        onClick && onClick();
    }

    return (
        <Column className={classes.dropdownContainer}>
            <button className={classes.dropdownButton} onClick={onDropdownClick}>
                {label}
            </button>
            {userMenuOpen && (
                <Column className={classes.dropdownItemsContainer}>
                    {options.map((option, index) => (
                        <button
                            key={`option-${index}`}
                            className={classes.dropdownItem}
                            onClick={() => onItemClick(option.onClick)}
                        >
                            {option.label}
                            {index === 0 && (
                                <div className={classes.arrowContainer}>
                                    <IconArrowUp />
                                </div>
                            )}
                        </button>
                    ))}
                </Column>
            )}
        </Column>
    );
}

DropdownComponent.propTypes = {
    label: oneOfType([string, element]),
    options: arrayOf(
        shape({
            label: oneOfType([string, arrayOf(element)]),
            onClick: func
        })
    ),
    position: shape({
        top: number,
        right: number,
        bottom: number,
        left: number
    })
};

DropdownComponent.defaultProps = {
    position: {
        top: 52,
        right: -6
    }
};

export default DropdownComponent;