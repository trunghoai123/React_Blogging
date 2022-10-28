import React from 'react';
import { useDropdown } from './dropdown-context';

const DropdownItem = ({children, className}) => {
    const { show } = useDropdown();
    return (
       <>
        {show && (
            <div className={`z-10 select-none absolute top-full left-0 w-full bg-white shadow-xl ${className}`}>
                {children}
            </div>
        )}
       </>
    );
};

export default DropdownItem;