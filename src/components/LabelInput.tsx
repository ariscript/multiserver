import React, { type ChangeEvent } from "react";

interface LabelInputProps {
    name: string;
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    labelClassName?: string;
    inputClassName?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LabelInput = (props: LabelInputProps): JSX.Element => {
    return (
        <div>
            <label className={props.labelClassName} htmlFor={props.name}>{props.label}</label>
            <input
                className={props.inputClassName}
                id={props.name}
                name={props.name}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}

export default LabelInput;
