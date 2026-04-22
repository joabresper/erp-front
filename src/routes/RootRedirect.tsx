import { Center, Loader } from '@mantine/core';
import { Navigate } from 'react-router-dom';
import { APP_SECTIONS } from '../components/common/configuration/app-sections';
import { useProfile } from '../features/auth/useProfile';

const getHomePath = (level: number) => {
  if (level >= APP_SECTIONS.DASHBOARD.minLevel) {
    return APP_SECTIONS.DASHBOARD.path;
  }
  if (level >= APP_SECTIONS.POS.minLevel) {
	return APP_SECTIONS.POS.path;
  }
  return '/login';
};

export const RootRedirect = () => {
  const { data: currentUser, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userLevel = Number(currentUser.role?.level || 0);

  return <Navigate to={getHomePath(userLevel)} replace />;
};