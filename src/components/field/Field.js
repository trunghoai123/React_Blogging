import React from 'react';

const Field = ({className, children, ...props}) => {
    return (
        <div className={className} { ...props}>
            {children}
        </div>
    );
};

export default Field;