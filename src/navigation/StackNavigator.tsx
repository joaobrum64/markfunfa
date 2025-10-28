import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import DetalhesScreen from '../screens/DetalhesScreen';
import PerfilScreen from '../screens/PerfilScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthContext } from '../context/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Registrar: undefined;
  Home: undefined;
  Perfil: undefined;
  Detalhes: { filmeId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { usuario } = useContext(AuthContext);

  // Mostra loading enquanto não sabemos se existe usuario
  if (usuario === undefined) {
    return null; // ou um <SplashScreen /> se quiser
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        // Usuário logado
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="Detalhes" component={DetalhesScreen} />
        </>
      ) : (
        // Usuário deslogado
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registrar" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
