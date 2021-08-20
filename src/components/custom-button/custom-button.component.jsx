import React from 'react';

import './custom-button.styles.scss';

const CustomButton = ({ children, ...props }) => {
    return (
        <div {...props}>{children}</div>
    )
}

export default CustomButton;