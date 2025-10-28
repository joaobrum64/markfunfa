import { FontAwesome } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PerfilContext } from '../context/PerfilContext';
import { RootStackParamList } from '../navigation/StackNavigator';
import { buscarFilmePorId } from '../services/tmdb';
import { Filme } from '../types/Filme';

export default function DetalhesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Detalhes'>>();
  const { filmeId } = route.params;

  const { isFavorito, favoritar, removerFavorito, usuario, notas, salvarNota } =
    useContext(PerfilContext);

  const [filme, setFilme] = useState<Filme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nota, setNota] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const notasDisponiveis = [-1, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        const data = await buscarFilmePorId(filmeId);
        setFilme(data);
        const notaExistente = notas[filmeId] ?? -1;
        setNota(notaExistente);
      } catch {
        setError('Erro ao carregar detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [filmeId]);

  const favoritado = filme ? isFavorito(filme) : false;

  const handleNotaChange = (valor: number) => {
    setNota(valor);
    if (filme && valor !== -1) salvarNota(filme.id, valor);
  };

  if (loading)
    return <ActivityIndicator size="large" color="gold" style={{ marginTop: 40 }} />;

  if (error || !filme) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Filme não encontrado.'}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
          accessibilityLabel="Voltar"
          accessibilityHint="Volta para a tela anterior"
        >
          <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 12 }}
          accessibilityLabel="Voltar"
          accessibilityHint="Volta para a tela anterior"
        >
          <FontAwesome name="arrow-left" size={24} color="gold" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Detalhes</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Perfil')}
          accessibilityLabel="Abrir perfil do usuário"
          accessibilityHint="Toque para visualizar seu perfil"
        >
          <Image
            source={{
              uri:
                usuario?.foto?.startsWith('http') || usuario?.foto?.startsWith('data:image/')
                  ? usuario.foto
                  : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={styles.fotoUsuario}
            accessibilityLabel="Foto de perfil do usuário"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {filme?.imagem?.startsWith('http') && (
            <Image
              source={{ uri: filme.imagem }}
              style={styles.cover}
              accessibilityLabel={`Pôster do filme ${filme.titulo}`}
            />
          )}

          <Text style={styles.nome}>{filme.titulo}</Text>

          <View style={styles.botoesWrapper}>
            <View style={styles.notaWrapper}>
              <FontAwesome name="star" size={28} color="gold" style={{ marginRight: 8 }} />
              {Platform.OS === 'ios' ? (
                <>
                  <Pressable
                    onPress={() => setModalVisible(true)}
                    style={styles.pickerButton}
                    accessibilityLabel={`Selecionar nota para o filme ${filme.titulo}`}
                    accessibilityHint="Toque para abrir a lista de notas disponíveis"
                  >
                    <Text style={styles.pickerText}>
                      {nota === -1 ? '-.-' : nota?.toFixed(1)}
                    </Text>
                  </Pressable>

                  <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <Picker
                          selectedValue={nota ?? -1}
                          onValueChange={(itemValue) => {
                            const valor = Number(itemValue);
                            handleNotaChange(valor);
                          }}
                          itemStyle={{ color: 'gold' }}
                          style={{ height: 200 }}
                        >
                          {notasDisponiveis.map((n) => (
                            <Picker.Item key={n} label={n === -1 ? '-.-' : n.toFixed(1)} value={n} />
                          ))}
                        </Picker>
                        <TouchableOpacity
                          onPress={() => setModalVisible(false)}
                          style={styles.modalClose}
                          accessibilityLabel="Fechar seletor de nota"
                          accessibilityHint="Fecha a lista de notas disponíveis"
                        >
                          <Text style={{ color: 'gold', fontSize: 16 }}>Fechar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </>
              ) : (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={nota ?? -1}
                    onValueChange={(itemValue) => {
                      const valor = Number(itemValue);
                      handleNotaChange(valor);
                    }}
                    style={styles.picker}
                    dropdownIconColor="gold"
                    accessibilityLabel={`Nota para o filme ${filme.titulo}`}
                  >
                    {notasDisponiveis.map((n) => (
                      <Picker.Item key={n} label={n === -1 ? '-.-' : n.toFixed(1)} value={n} />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => (favoritado ? removerFavorito(filme) : favoritar(filme))}
              style={styles.botaoFavoritar}
              activeOpacity={0.7}
              accessibilityLabel={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              accessibilityHint="Toque para alternar o status de favorito deste filme"
            >
              <FontAwesome
                name={favoritado ? 'heart' : 'heart-o'}
                size={36}
                color="gold"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sinopseContainer}>
            <Text style={styles.sinopseTitulo}>Sinopse</Text>
            <Text style={styles.sinopse}>{filme.sinopse}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000021',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#000021',
  },
  titulo: {
    color: 'gold',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  fotoUsuario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'gold',
    overflow: 'hidden',
    backgroundColor: '#000021',
  },
  container: {
    padding: 16,
  },
  cover: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  nome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'gold',
    textAlign: 'center',
    marginBottom: 16,
  },
  botoesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  notaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'gold',
    borderRadius: 6,
    backgroundColor: '#0b1333',
    paddingHorizontal: 4,
    minWidth: 100,
    maxWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    color: 'gold',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  pickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#0b1333',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'gold',
    minWidth: 100,
    alignItems: 'center',
  },
  pickerText: {
    color: 'gold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#000021',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalClose: {
    marginTop: 12,
    alignSelf: 'center',
  },
  botaoFavoritar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000021',
  },
  sinopseContainer: {
    marginTop: 12,
  },
  sinopseTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gold',
    textAlign: 'center',
    marginBottom: 6,
  },
  sinopse: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  voltar: {
    color: 'gold',
    fontSize: 16,
  },
});



