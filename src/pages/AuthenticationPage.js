import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components'; 


const AuthenticationPageStyles = styled.div ` // create a div tag
    padding: 40px;
    .logo{
        margin: 0 auto 14px;
    }
    .heading{
        font-size: 26px;
        color: ${props => props.theme.primary};
        text-align: center;
        font-weight: 600;
        user-select: none;
    }
    .field{
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        user-select: none;
        margin-bottom: 40px;
    }
    .form{
        margin: 0 auto;
        max-width: 600px;
    } 
    .inputText{
        width: 100%;
        padding: 12px;
        background-color: ${props => props.theme.lightGray};
        border-radius: 7px;
        border: 1px solid transparent;
        transition: ease all 350ms;
    }
    input:focus{
        background-color: white;
        border: 1px solid ${props => props.theme.primary}
    }
    .link-container{
        user-select: none;
        font-size: 14px;
        margin-bottom: 24px;
    }
    .link{
        color: ${props => props.theme.primary};
    }
`; 

const AuthenticationPage = ({ children = ''}) => {
    return (
        <AuthenticationPageStyles>
            <NavLink to={'/'}>
                <img className='logo' srcSet='/monkey_logo.png 3x' alt=''/>
            </NavLink>
            <div className='heading'>Monkey Blogging</div>
            { children }
        </AuthenticationPageStyles>
    );
};

export default AuthenticationPage;