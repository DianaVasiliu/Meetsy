import React from 'react';
import { func, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { Row } from 'simple-flexbox';
import { css } from 'aphrodite';
import { MenuStyles } from '../../styles';


function ProfileImage(props) {
    const { path, content, size } = props;
    const Content = content;
    const Path = path;
    return (
        <Link to={Path} className={css(MenuStyles.imageCtn)} style={{ width: { size }, height: { size } }}>
            <Row className={css(MenuStyles.container)} vertical="center">
                <img className={css(MenuStyles.image)} src={Content} />
            </Row>
        </Link>
    );
}

ProfileImage.propTypes = {
    icon: func,
    title: string
};

export default ProfileImage;