import { forwardRef } from 'react';

const TextInputWithLabel = forwardRef(
    ({ value, onChange, elementId, labelText }, ref) => {
        return (
            <>
                <label htmlFor={elementId}>{labelText}</label>
                <input
                    ref={ref}
                    type="text"
                    value={value}
                    onChange={onChange}
                    id={elementId}
                />
            
            </>
        );
    }
);

export default TextInputWithLabel;