import React from 'react';
import styled from 'styled-components';

const StyledAuthContainer = styled.div`
  background-color: #2196F3;
  padding: 40px 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const AuthContainer = ({ children }) => {
  return (
    <StyledAuthContainer>
      {children}
    </StyledAuthContainer>
  );
};

export default AuthContainer;