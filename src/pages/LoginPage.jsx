import React, { useState } from 'react';
import styled from 'styled-components';

import { FiUser, FiLock } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

import AuthContainer from '../components/layout/AuthContainer';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SocialLoginButton from '../components/SocialButtonLogin';
import RadioOption from '../components/RadioOption';
import BasicLink from '../components/links/BasicLinks';
import Separator from '../components/ui/Separator';

import bibliotecaBg from '../styles/assets/biblioteca.jpg';

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const BackgroundPanel = styled.div`
  flex: 1;
  background-image: url(${({ bgImage }) => bgImage});
  background-size: cover;
  background-position: center left;
  background-repeat: no-repeat;
`;

const FormPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2196F3;
  padding: 20px;
  overflow-y: auto;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const UserTypeSelection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 5px;
  color: white;
`;

const SignupText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
  color: white;

  a {
    display: inline-block;
    text-decoration: underline;
    font-weight: bold;
    margin-left: 5px;
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('reader');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Tentativa de login:', { email, password, userType });
    alert('Login clicado!');
  };

  const handleGoogleLogin = () => {
    alert('Login com o Google clicado!');
  };

  const handleFacebookLogin = () => {
    alert('Login com o Facebook clicado!');
  };

  return (
    <PageContainer>
      <BackgroundPanel bgImage={bibliotecaBg} />
      <FormPanel>
        <AuthContainer>
          <StyledForm onSubmit={handleLogin}>
            <InputField
              label="Usuário"
              icon={<FiUser size={20} />}
              type="text"
              placeholder="Usuário ou email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="Senha"
              icon={<FiLock size={20} />}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <BasicLink to="/forgot-password" text="Esqueceu sua senha?" align="right" />

            <UserTypeSelection>
              <RadioOption
                label="Leitor(a)"
                name="userType"
                value="reader"
                checked={userType === 'reader'}
                onChange={() => setUserType('reader')}
              />
              <RadioOption
                label="Livraria/Sebo"
                name="userType"
                value="bookstore"
                checked={userType === 'bookstore'}
                onChange={() => setUserType('bookstore')}
              />
            </UserTypeSelection>

            <PrimaryButton type="submit">
              Login
            </PrimaryButton>

            <Separator text="ou" />

            <SocialLoginButton
              icon={<FaGoogle />}
              text="Login com o Google"
              onClick={handleGoogleLogin}
              platform="google"
            />
            <SocialLoginButton
              icon={<FaFacebook />}
              text="Login com o Facebook"
              onClick={handleFacebookLogin}
              platform="facebook"
            />

            <SignupText>
              Ainda não tem cadastro?
              <BasicLink to="/signup" text="Cadastre-se" />
            </SignupText>
          </StyledForm>
        </AuthContainer>
      </FormPanel>
    </PageContainer>
  );
};

export default LoginPage;