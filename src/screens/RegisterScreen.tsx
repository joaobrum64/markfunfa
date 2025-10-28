import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { addUsuario } from '../services/database';

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const defaultImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

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

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setPhoto(base64);
      }
    } catch (error) {
      console.log('Erro ao selecionar imagem:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setPhoto(base64);
      }
    } catch (error) {
      console.log('Erro ao tirar foto:', error);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Preencha usuário e senha');
      return;
    }

    try {
      const fotoFinal = photo || defaultImage;
      await addUsuario(username, password, fotoFinal);

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      setUsername('');
      setPassword('');
      setPhoto(null);
      setError('');

      navigation.replace('Login');
    } catch (e: any) {
      console.log('Erro ao registrar usuário:', e);
      setError(e.message || 'Erro ao registrar usuário. Já existe?');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: keyboardHeight || 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Crie sua conta</Text>

        <View style={styles.imageRow}>
          <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
            <FontAwesome name="camera" size={24} color="#000021" />
          </TouchableOpacity>

          <Image
            source={{ uri: photo || defaultImage }}
            style={styles.imagePreview}
          />

          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <FontAwesome name="folder" size={24} color="#000021" />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Usuário"
          placeholderTextColor="gold"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="gold"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.botao} onPress={handleRegister}>
          <Text style={styles.botaoTexto}>Registrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
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
    color: 'gold',
    marginBottom: 32,
    textAlign: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'gold',
  },
  iconButton: {
    backgroundColor: 'gold',
    borderRadius: 50,
    padding: 10,
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
  botao: {
    backgroundColor: 'gold',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
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
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
