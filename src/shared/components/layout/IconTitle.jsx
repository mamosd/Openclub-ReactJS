import React from 'react';
import PropTypes from 'prop-types';

const IconTitle = ({ title, icon }) => (<h2 className="mb hidden-xs hidden-sm"><i className={`fa fa-fw ${icon || ''}`} /> {title}</h2>)
IconTitle.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string
}
export default IconTitle;
