import React from 'react';
import styled from 'styled-components';

const StyledSeparator = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  color: white;
  font-weight: 500;
`;

const Separator = ({ text }) => {
  return (
    <StyledSeparator>
      {text}
    </StyledSeparator>
  );
};

export default Separator;