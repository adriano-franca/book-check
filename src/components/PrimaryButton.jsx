import React from 'react';
import styled from 'styled-components';

const StyledPrimaryButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: white;
  color: #2196F3;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const PrimaryButton = ({ children, onClick, type = 'button' }) => {
  return (
    <StyledPrimaryButton type={type} onClick={onClick}>
      {children}
    </StyledPrimaryButton>
  );
};

export default PrimaryButton;