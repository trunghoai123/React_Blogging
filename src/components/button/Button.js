import React from 'react';
import styled, { css } from 'styled-components';
import { Loading } from '../loading';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const ButtonStyles = styled.button`
    padding:0 18px 0 18px;
    height: ${props => props.height || '54px'};
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    /* display: block; */
    /* width: 100%; */
    margin-left: auto;
    margin-right: auto;
    user-select: none;
    font-weight: 600;

    ${props => props.kind === 'light' ? 
        css`
            color: ${props => props.theme.primary};
            background: white;
        ` 
    :
        css`
            background-image: linear-gradient(to bottom right, 
            ${props => props.theme.primary}, ${props => props.theme.secondary})
        `
    };
    /* background: linear-gradient(to bottom right, 
    ${props => props.theme.primary}, ${props => props.theme.secondary}); */
    &:disabled{
        opacity: 0.7;
        cursor: auto;
        pointer-events: none;
    }
`
/**
 * 
 * @param {func} onClick handle click event
 * @param {string} height specify height of button
 * @returns 
 */
const Button = ({ kind = '', isLoading = false , to, height = '50px', className = '', onClick = () => {}, children = '', type = 'button', ...props}) => {
    // const { isLoading } = props;
    const child = !!isLoading ? <Loading></Loading> : children;
    if(typeof to === 'string' && to !== '')
        return (
            <NavLink to={to}>
                <ButtonStyles kind={kind} height={height} onClick={onClick} className={className} type={type} {...props}>
                    {child}
                </ButtonStyles>
            </NavLink>
        )
    return (
        <ButtonStyles kind={kind} height={height} onClick={onClick} className={className} type={type} {...props}>
            {child}
        </ButtonStyles>
    );
};


Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit']),
    height: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    kind: PropTypes.string,
}

export default Button;