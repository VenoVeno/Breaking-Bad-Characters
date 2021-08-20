import React from 'react';

import './info-container.styles.scss';

const InfoContainer = ({ Icon, content, className, labelContent }) => {
    console.log(`${labelContent}, "${content}"`)
    if (content)
        return (
            <div className={`${className}-wrapper icon-content-wrapper`}>
                <div className={`${className}-icon-wrapper icon-wrapper`}>
                    <Icon className={`${className}-icon svg-icon icon`} />
                </div>
                <div className={`${className}-content content`}>{labelContent} {labelContent ? " - " : null} {content}</div>
            </div>
        )
    else
        return null
}

export default InfoContainer;