import { LoginForm } from '../features/auth';

export const LoginPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <LoginForm />
    </div>
  );
};