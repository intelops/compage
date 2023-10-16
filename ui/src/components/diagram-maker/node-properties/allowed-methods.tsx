import React, {useState} from 'react';
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";

interface AllowedMethodCheckBoxProps {
    allowedMethods: string[];
    updateAllowedMethods: (allowedMethods: string[]) => void;
}

interface AllowedMethodCheckbox {
    id: number;
    label: string;
    isChecked: boolean;
}

const initialAllowedMethodCheckboxes: AllowedMethodCheckbox[] = [
    {id: 1, label: 'POST', isChecked: false},
    {id: 2, label: 'LIST', isChecked: false},
    {id: 3, label: 'GET', isChecked: false},
    {id: 4, label: 'PUT', isChecked: false},
    {id: 5, label: 'DELETE', isChecked: false},
];

const getExistingAllowedMethodCheckBoxes = (existingAllowedMethods: string[]) => {
    const clonedAllowedMethodCheckBoxes = initialAllowedMethodCheckboxes.map(x => Object.assign({}, x));

    // iterate over existingAllowedMethods and update the allowedMethodCheckboxes
    existingAllowedMethods.forEach((allowedMethod: string) => {
       clonedAllowedMethodCheckBoxes.forEach((allowedMethodCheckbox: AllowedMethodCheckbox)=>{
           if (allowedMethodCheckbox.label === allowedMethod) {
               allowedMethodCheckbox.isChecked = true;
           }
       });
    });

    return clonedAllowedMethodCheckBoxes;
};
const AllowedMethodCheckBoxGroup = (allowedMethodProps: AllowedMethodCheckBoxProps) => {
    const [allowedMethodCheckboxes, setAllowedMethodCheckboxes] = useState(allowedMethodProps.allowedMethods.length > 0 ? getExistingAllowedMethodCheckBoxes(allowedMethodProps.allowedMethods) : initialAllowedMethodCheckboxes);

    const handleAllowedMethodCheckboxChange = (id: number) => {
        const clonedAllowedMethodCheckBoxes = allowedMethodCheckboxes.map(x => Object.assign({}, x));

        clonedAllowedMethodCheckBoxes.forEach((allowedMethodCheckbox: AllowedMethodCheckbox) => {
            if (allowedMethodCheckbox.id === id) {
                allowedMethodCheckbox.isChecked = !allowedMethodCheckbox.isChecked;
            }
        });

        setAllowedMethodCheckboxes(clonedAllowedMethodCheckBoxes);

        allowedMethodProps.updateAllowedMethods(clonedAllowedMethodCheckBoxes.filter((allowedMethodCheckbox: AllowedMethodCheckbox) => allowedMethodCheckbox.isChecked).map((allowedMethodCheckbox: AllowedMethodCheckbox) => allowedMethodCheckbox.label));
    };

    return <>
        <FormGroup>
            {allowedMethodCheckboxes.map((allowedMethodCheckbox: AllowedMethodCheckbox) => (
                <FormControlLabel key={allowedMethodCheckbox.id} control={<Checkbox checked={allowedMethodCheckbox.isChecked}/>}
                                  onChange={() => handleAllowedMethodCheckboxChange(allowedMethodCheckbox.id)}
                                  label={allowedMethodCheckbox.label}/>
            ))}
        </FormGroup>
    </>;
};

export default AllowedMethodCheckBoxGroup;
