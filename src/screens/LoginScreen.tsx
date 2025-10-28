import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login, usuario } = useContext(AuthContext);

  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (usuario) {
      navigation.replace('Home');
    }
  }, [usuario]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!usuarioInput || !senha) {
      setError('Preencha usuário e senha');
      return;
    }

    try {
      const sucesso = await login(usuarioInput, senha);
      if (!sucesso) {
        setError('Usuário ou senha incorretos');
        return;
      }

      setError('');

      if (Platform.OS === 'web') {
        Alert.alert('Login', 'Login realizado com sucesso!');
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao tentar logar');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: keyboardHeight || 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Rate My Movie</Text>

        <TextInput
          placeholder="Usuário"
          placeholderTextColor="gold"
          value={usuarioInput}
          onChangeText={setUsuarioInput}
          style={styles.input}
          autoCapitalize="none"
          accessibilityLabel="Campo de usuário"
          accessibilityHint="Digite seu nome de usuário"
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="gold"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
          accessibilityLabel="Campo de senha"
          accessibilityHint="Digite sua senha"
        />

        {error !== '' && (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleLogin}
          accessibilityLabel="Entrar"
          accessibilityHint="Toque para fazer login com as credenciais informadas"
        >
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Registrar')}
          accessibilityLabel="Cadastrar-se"
          accessibilityHint="Toque para ir para a tela de registro"
        >
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#000021',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: 'gold',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gold',
    color: 'gold',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: 'gold',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#000021',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: 'gold',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
