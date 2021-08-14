import React from 'react';

import './info-container.styles.scss';

const InfoContainer = ({ Icon, content, className, labelContent }) => {
    return (
        <div className={`${className}-wrapper icon-content-wrapper`}>
            <div className={`${className}-icon-wrapper icon-wrapper`}>
                <Icon className={`${className}-icon svg-icon icon`} />
            </div>
            <div className={`${className}-content content`}>{labelContent} {labelContent ? " - " : null} {content}</div>
        </div>
    )
}

export default InfoContainer;