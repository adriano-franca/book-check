import React from 'react';
import styled from 'styled-components';

const RadioLabel = styled.label`
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: black;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: white;
  cursor: pointer;
  margin: 0;
`;

const RadioOption = ({ label, name, value, checked, onChange }) => {
  return (
    <RadioLabel>
      <RadioInput
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </RadioLabel>
  );
};

export default RadioOption;