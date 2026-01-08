import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Container, 
  Text,
  Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react'; // Asegúrate de tener tabler icons
import { useNavigate } from 'react-router-dom'; // Asumo React Router
import { useLogin } from '../useLogin';

export const LoginForm = () => {
  const navigate = useNavigate();
  
  // Inicializamos el hook de lógica
  const { mutate: login, isPending, error, isError } = useLogin({
    onSuccess: () => {
      // Redireccionar al dashboard tras login exitoso
      navigate('/dashboard'); 
    }
  });

  // Configuración del formulario y validaciones
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email inválido')
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    login(values);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">
        Bienvenido de nuevo
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Ingresa tus credenciales para acceder al ERP
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {isError && (
          <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />} mb="md">
            {(error as any)?.response?.data?.message || 'Credenciales incorrectas o error de servidor'}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput 
            label="Email" 
            placeholder="usuario@empresa.com" 
            required 
            {...form.getInputProps('email')}
          />
          
          <PasswordInput 
            label="Contraseña" 
            placeholder="Tu contraseña" 
            required 
            mt="md" 
            {...form.getInputProps('password')}
          />
          
          <Button fullWidth mt="xl" type="submit" loading={isPending}>
            Iniciar Sesión
          </Button>
        </form>
      </Paper>
    </Container>
  );
};