import React from 'react';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

const InputStyles = styled.div`
    width: 100%;
    position: relative;
    input{
        width: 100%;
        padding: ${props => props.hasIcon ? '12px 40px 12px 12px' : ' 12px'};;
        background-color: ${props => props.theme.lightGray};
        border-radius: 7px;
        border: 1px solid transparent;
        transition: ease all 350ms;
    }
    .icon_container{
        position: absolute;
        top: 50%;
        right: 12px;
    }
    .svg_icon{
        width:20px;
        color: ${props => props.theme.darkGray};
        transform: translateY(-50%);
    }
`

const Input = ({hasIcon = false, control, type = 'text', name = '', children = '', ...props}) => {
    const { field } = useController({
        control,
        name,
        defaultValue: ''
    });
    return (
        <InputStyles hasIcon={children ? true : false}>
            <input type={type} {...field} {...props} />
            {children ? <span className='icon_container'>{children}</span> : null}
        </InputStyles>
    );
};

export default Input;