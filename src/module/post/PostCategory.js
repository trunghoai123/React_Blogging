import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const PostCategoryStyles = styled.div`
    display: inline-block;
    padding: 8px;
    border-radius: 8px;
    color: #6b6b6b;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${props => props.type === 'primary' ? 
        css`
            background-color: ${props => props.theme.prCategoryBg};
        `
    :
        css`
            background-color: white;
        `
    };
    /* white-space: nowrap;
    background-color: #f3f3f3;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px; */
`

const PostCategory = ({children = '', categoryTitle , type = '', to = '',  ...props}) => {
    return (
        <PostCategoryStyles {...props} type={type}>
            <Link to={`/category/${to}`} title={categoryTitle}>
                {children}
            </Link>
        </PostCategoryStyles>
    );
};

export default PostCategory;