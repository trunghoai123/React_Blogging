import React from 'react';
import styled from 'styled-components';
import { Button } from '../components/button';

const NotFoundPageStyles = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .message{
        font-size: 40px;
        font-weight: 600;
        color: ${props => props.theme.primary};
        margin-bottom: 20px;
    }
    /* .backButton{
        cursor: pointer;
        padding: 12px;
        font-weight: 500;
        color: white;
        border-radius: 3px;
        background: linear-gradient(to bottom right, ${props => props.theme.primary}, 
            ${props => props.theme.secondary});
    } */
`

const NotFoundPage = () => {
    return (
        <NotFoundPageStyles>
            <span className='message'>404 Not Found</span>
            <Button to='/' type='button' >Back to Home page</Button>
        </NotFoundPageStyles>
    );
};

export default NotFoundPage;