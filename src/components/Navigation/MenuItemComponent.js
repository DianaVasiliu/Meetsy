import React from 'react';
import { func, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { Row } from 'simple-flexbox';
import { css } from 'aphrodite';
import { MenuStyles } from '../../styles';


function MenuItemComponent(props) {
    const { path, icon } = props;
    const Icon = icon;
    const Path = path;
    return (
        <Link to={Path} className={css(MenuStyles.title, MenuStyles.iconCtn)}>
            <Row className={css(MenuStyles.container)} vertical="center">
                <Icon />
            </Row>
        </Link>
    );
}

MenuItemComponent.propTypes = {
    icon: func,
    title: string
};

export default MenuItemComponent;