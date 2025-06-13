import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #888; /* Cor padrão para o ícone */
`;

const InputFieldGroup = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: black;
`;

const InputWithIconContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 8px;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 5px 0;
  font-size: 16px;
  color: #333;
  background-color: transparent;
`;

const InputField = ({ icon, type, placeholder, value, onChange, label }) => {
  return (
    <InputFieldGroup>
      {label && <Label htmlFor={type}>{label}</Label>}
      <InputWithIconContainer>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <StyledInput
          type={type}
          id={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </InputWithIconContainer>
    </InputFieldGroup>
  );
};

export default InputField;