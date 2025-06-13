import React from 'react';
import styled, { css } from 'styled-components';

const platformStyles = {
  google: css`
    background-color: white;
    color: #333;
    border: 1px solid #ddd;
    &:hover { background-color: #f0f0f0; }
  `,
  facebook: css`
    background-color: #3b5998;
    color: white;
    &:hover { background-color: #2d4373; }
  `
};

const StyledSocialButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
  }
  
  ${({ platform }) => platformStyles[platform] || platformStyles.google}
`;

const SocialLoginButton = ({ icon, text, onClick, platform = 'google' }) => {
  return (
    <StyledSocialButton
      type="button"
      onClick={onClick}
      platform={platform}
    >
      {icon}
      <span>{text}</span>
    </StyledSocialButton>
  );
};

export default SocialLoginButton;