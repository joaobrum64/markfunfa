import { FontAwesome } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PerfilContext } from '../context/PerfilContext';
import { Filme } from '../types/Filme';

interface Props {
  filme: Filme;
  favoritado: boolean;
  onPress: () => void;
}

export default function FilmeCard({ filme, favoritado, onPress }: Props) {
  const { favoritar, removerFavorito } = useContext(PerfilContext);

  const imagemValida =
    typeof filme.imagem === 'string' && filme.imagem.startsWith('http');

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Abrir detalhes do filme ${filme.titulo}`}
      accessibilityHint="Toque para ver mais informações sobre o filme"
    >
      {imagemValida && (
        <Image
          source={{ uri: filme.imagem }}
          style={styles.imagem}
          accessibilityLabel={`Pôster do filme ${filme.titulo}`}
        />
      )}
      <Text style={styles.titulo}>{filme.titulo}</Text>
      <TouchableOpacity
        style={styles.botaoFavorito}
        onPress={() => (favoritado ? removerFavorito(filme) : favoritar(filme))}
        accessibilityLabel={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        accessibilityHint="Toque para alternar o status de favorito deste filme"
      >
        <FontAwesome
          name={favoritado ? 'heart' : 'heart-o'}
          size={24}
          color="gold"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#000021',
    alignItems: 'center',
    width: 160,
  },
  imagem: {
    width: 140,
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
  },
  titulo: {
    color: 'gold',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  botaoFavorito: {
    padding: 4,
    minWidth: 44, // ✅ área mínima de toque
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
