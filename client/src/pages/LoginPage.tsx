import React from 'react';
import LoginForm from '../components/form/LoginForm';
import Button from '../components/Button';
import { PageLayout } from '../components/layout/PageLayout';

const LoginPage: React.FC = () => {
  return (
    <PageLayout style={{ margin: '0', height: '100vh' }}>
      <LoginForm type='auth'></LoginForm>
    </PageLayout>
  );
};

export default LoginPage;
