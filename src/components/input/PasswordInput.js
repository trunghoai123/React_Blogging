import React, { useState } from 'react';
import { IconEyeOff, IconEyeOpen } from '../icon';
import Input  from './Input'

const PasswordInput = ({control, ...props}) => {
    const [togglePassword, setTogglePassword] = useState(false);
    if (!control) return null;
    return (
        <Input
            // hasIcon={true}
            type={ togglePassword ? 'text': 'password' }
            name='password'
            id='password'
            control={control}
            placeholder='Type your password'
        >
            { togglePassword ?
                <IconEyeOpen onClick={() => setTogglePassword(false)}></IconEyeOpen>
                :
                <IconEyeOff onClick={() => setTogglePassword(true)}></IconEyeOff>
            }
        </Input>
    );
};

export default PasswordInput;