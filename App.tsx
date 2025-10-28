import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PerfilProvider } from './src/context/PerfilContext';
import { AuthProvider } from './src/context/AuthContext';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  return (
    <PerfilProvider>
      <AuthProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PerfilProvider>
  );
}
