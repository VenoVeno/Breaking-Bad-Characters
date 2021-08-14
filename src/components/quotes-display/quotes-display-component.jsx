import React from 'react';

import './quotes-display.styles.scss';

const Quotes = ({content}) => {
    return (
        <div className="quote">
            {content}
        </div>
    )
}

export default Quotes;