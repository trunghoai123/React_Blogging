import React from 'react';
import styled from 'styled-components';
import { Button } from '../../components/button';

const HomeBannerStyles = styled.div`
    .imgContainer{
        margin-bottom: 40px;
        padding: 0px 38px;
        width: 100%;
        height: 500px;
        background: linear-gradient(to bottom right, ${props => props.theme.primary}, ${props => props.theme.secondary});
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    /* .img_banner{
        width: 100%;
        height: 500px;
        object-fit: cover;
    } */
    .float_container{
        user-select: none;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 26px;
        color:${props => props.theme.lighterGray};;
    }
    .banner_header{
        font-size: 38px;
    }
    /* .started{
        border-radius: 6px;
        padding: 12px;
        display: inline;
        max-width: 240px;
        font-weight: 600;
        color: ${props => props.theme.primary};
    } */
`

const HomeBanner = () => {
    return (
        <HomeBannerStyles>
            <div className='container'>
                <div className='imgContainer'>
                    {/* <img className='img_banner' srcSet='banner.jpg' alt='banner' /> */}
                    <div className='float_container'>
                        <h1 className='banner_header'>Monkey Blogging</h1>
                        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi</div>
                        <Button type='button' kind='light' to='/sign-up' style={{marginLeft: '0px'}}>Get Started</Button>
                    </div>
                    <div>
                        <img srcSet='/human.png 1.1x' alt=''/>
                    </div>
                </div>
            </div>
        </HomeBannerStyles>
    );
};

export default HomeBanner;