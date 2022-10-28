import React from 'react';
import styled, { css } from 'styled-components';

const PostMetaStyles = styled.div` 
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 600;
    ${props => props.color !== 'primary' ?
        css`
            color: ${props => props.color};
        `
    :
        css`
            color: #6b6b6b;
        `
    };
    /* color: inherit; */
    .dot {
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: currentColor;
        border-radius: 100rem;
    } 
    .time{
        margin-left: 6px;
        cursor: default;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80px;
        ${props => props.timeStyle};
    }
    .author{
        cursor: default;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 120px;
        ${props => props.authorStyle};
    }
`;


const PostMeta = ({ dateTitle = '', authorTitle = '', className = '', color = 'primary',
     date = 'Mar 23', authorName = 'Andiez Le', timeClass = '', authorClass = '',  ...props}) => {
    return (
        <PostMetaStyles color={color} className={className} {...props} >
            <span title={dateTitle} className={`time`}>{date}</span>
            <span className="dot"></span>
            <span title={authorTitle} className={`author`}>{authorName}</span>
        </PostMetaStyles>
    )
};

export default PostMeta;