import type { ChangeEvent } from "react";
import React from "react";

interface LabelInputProps {
    name: string;
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    divClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LabelInput = (props: LabelInputProps): JSX.Element => {
    return (
        <div className={"flex items-center " + props.divClassName}>
            <label
                className={"flex-shrink-0 " + props.labelClassName}
                htmlFor={props.name}
            >
                {props.label}
            </label>
            <input
                className={
                    "flex-1 px-2 py-1 text-sm rounded-sm " +
                    props.inputClassName
                }
                id={props.name}
                name={props.name}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
};

export default LabelInput;
