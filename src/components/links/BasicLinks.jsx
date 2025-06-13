import React from 'react';
import styled from 'styled-components';

const StyledLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 14px;
  display: block;
  transition: text-decoration 0.2s ease;

  &:hover {
    text-decoration: underline;
  }

  text-align: ${({ align }) => align || 'left'};
`;

const BasicLink = ({ to, text, align = 'left' }) => {
  return (
    <StyledLink href={to} align={align}>
      {text}
    </StyledLink>
  );
};

export default BasicLink;