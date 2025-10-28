import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilmeCard from '../components/FilmeCard';
import { PerfilContext } from '../context/PerfilContext';
import { RootStackParamList } from '../navigation/StackNavigator';
import { listarFilmesPopulares, buscarFilmes } from '../services/tmdb';
import { Filme } from '../types/Filme';

export default function HomeScreen() {
  const { favoritos, usuario } = useContext(PerfilContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const defaultImage = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  const carregarFilmes = async (pagina = 1) => {
    try {
      setIsSearching(false);
      if (pagina === 1) setLoading(true);
      else setLoadingMore(true);

      const lista = await listarFilmesPopulares(pagina);
      setFilmes(prev => (pagina === 1 ? lista : [...prev, ...lista]));
      setPage(pagina);
      setErro('');
    } catch {
      setErro('Erro ao carregar filmes populares');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const carregarBusca = async (query: string, pagina = 1) => {
    try {
      setIsSearching(true);
      if (pagina === 1) setLoading(true);
      else setLoadingMore(true);

      const { results, total } = await buscarFilmes(query, pagina);
      const queryLower = query.toLowerCase();
      const filtered = results.filter(f => f.titulo.toLowerCase().includes(queryLower));

      setFilmes(prev => (pagina === 1 ? filtered : [...prev, ...filtered]));
      setPage(pagina);
      setTotalResults(total);
      setErro('');
    } catch {
      setErro('Erro ao buscar filmes');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      if (searchQuery.trim() === '') {
        carregarFilmes(1);
      } else {
        carregarBusca(searchQuery.trim(), 1);
      }
    }, 400);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    carregarFilmes();
  }, []);

  const carregarMais = () => {
    if (loadingMore) return;

    if (isSearching) {
      if (filmes.length >= totalResults) return;
      carregarBusca(searchQuery.trim(), page + 1);
    } else {
      carregarFilmes(page + 1);
    }
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (filmes.length === 1) {
      navigation.navigate('Detalhes', { filmeId: filmes[0].id });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.toolbar}>
        <Text style={styles.titulo}>RateMyMovie</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Perfil')}
          accessibilityLabel="Abrir perfil do usuário"
          accessibilityHint="Toque para visualizar seu perfil"
        >
          {typeof usuario?.foto === 'string' &&
          (usuario.foto.startsWith('http') || usuario.foto.startsWith('data:image/')) ? (
            <Image
              source={{ uri: usuario.foto }}
              style={styles.fotoUsuario}
              accessibilityLabel="Foto de perfil do usuário"
            />
          ) : (
            <Image
              source={{ uri: defaultImage }}
              style={styles.fotoUsuario}
              accessibilityLabel="Imagem padrão de perfil do usuário"
            />
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar filmes..."
        placeholderTextColor="gold"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearchSubmit}
        accessibilityLabel="Campo de busca de filmes"
        accessibilityHint="Digite o nome de um filme para buscar"
      />

      <View style={styles.container}>
        {loading && filmes.length === 0 ? (
          <ActivityIndicator size="large" color="gold" style={{ marginTop: 40 }} />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          <FlatList
            data={filmes}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <FilmeCard
                filme={item}
                favoritado={favoritos.some(f => f.id === item.id)}
                onPress={() => navigation.navigate('Detalhes', { filmeId: item.id })}
              />
            )}
            contentContainerStyle={{ padding: 8, paddingBottom: 32 }}
            onEndReached={carregarMais}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color="gold" style={{ margin: 16 }} />
              ) : null
            }
            accessibilityLabel="Lista de filmes"
            accessibilityHint="Toque em um filme para ver os detalhes"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000021' },
  container: { flex: 1, paddingBottom: 40, backgroundColor: '#000021' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000021',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titulo: { color: 'gold', fontWeight: 'bold', fontSize: 20 },
  fotoUsuario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'gold',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000021',
  },
  erro: { color: 'red', textAlign: 'center', marginTop: 20 },
  searchInput: {
    backgroundColor: '#111136',
    color: 'gold',
    padding: 10,
    margin: 8,
    borderRadius: 8,
  },
});
