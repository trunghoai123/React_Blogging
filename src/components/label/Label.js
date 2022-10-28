import React from 'react';
import styled from 'styled-components';

const LabelStyles = styled.label `
    margin-bottom: 8px;
    font-weight: 600;
    color: ${props => props.theme.darkGray};
`

const Label = ({children, htmlFor, ...props}) => {
    return (
        <LabelStyles htmlFor={htmlFor} {...props}>
            { children }
        </LabelStyles>
    );
};

export default Label;