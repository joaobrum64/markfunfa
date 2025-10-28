import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilmeTile from '../components/FilmeTile';
import { RootStackParamList } from '../navigation/StackNavigator';
import { PerfilContext } from '../context/PerfilContext';
import { AuthContext } from '../context/AuthContext';

export default function PerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favoritos, notas, usuario, setUsuario: setPerfilUsuario } = useContext(PerfilContext);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    setPerfilUsuario(null);
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.botaoVoltar}
          accessibilityLabel="Voltar"
          accessibilityHint="Volta para a tela anterior"
        >
          <FontAwesome name="arrow-left" size={24} color="gold" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Perfil</Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.botaoLogout}
          accessibilityLabel="Sair"
          accessibilityHint="Encerra a sessão e volta para a tela de login"
        >
          <FontAwesome name="sign-out" size={22} color="gold" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.fotoWrapper}>
          {typeof usuario?.foto === 'string' &&
          (usuario.foto.startsWith('http') || usuario.foto.startsWith('data:image/')) ? (
            <Image
              source={{ uri: usuario.foto }}
              style={styles.fotoGrande}
              accessibilityLabel="Foto de perfil do usuário"
            />
          ) : (
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              style={styles.fotoGrande}
              accessibilityLabel="Imagem padrão de perfil do usuário"
            />
          )}
        </View>

        <Text style={styles.subtitulo}>Lista de {usuario?.nome ?? 'Usuário'}</Text>
      </View>

      <View style={styles.container}>
        {favoritos.length === 0 ? (
          <Text style={styles.vazio}>Nenhum filme favoritado ainda.</Text>
        ) : (
          <FlatList
            data={favoritos}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 12 }}
            renderItem={({ item }) => (
              <FilmeTile
                filme={item}
                favoritado={true}
                nota={notas[item.id]}
                onPress={() => navigation.navigate('Detalhes', { filmeId: item.id })}
              />
            )}
            accessibilityLabel="Lista de filmes favoritos"
            accessibilityHint="Toque em um filme para ver os detalhes"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000021' },
  toolbar: {
    height: 56,
    backgroundColor: '#000021',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  botaoVoltar: { width: 40 },
  botaoLogout: { width: 40, alignItems: 'flex-end' },
  titulo: { color: 'gold', fontWeight: '700', fontSize: 18 },
  header: { alignItems: 'center', paddingVertical: 16 },
  fotoWrapper: {
    borderWidth: 2,
    borderColor: 'gold',
    borderRadius: 80,
    padding: 4,
    backgroundColor: '#000021',
  },
  fotoGrande: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  subtitulo: { color: 'gold', fontSize: 18, marginTop: 12, fontWeight: '600' },
  container: { flex: 1 },
  vazio: { color: 'gold', textAlign: 'center', marginTop: 24 },
});
