import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { PerfilContext } from '../context/PerfilContext';
import { Filme } from '../types/Filme';


interface Props {
  filme: Filme;
  favoritado?: boolean;
  nota?: number | undefined;
  onPress: () => void;
}

export default function FilmeTile({ filme, favoritado: favoritadoProp, nota: notaProp, onPress }: Props) {
  const { favoritar, removerFavorito, notas, salvarNota } = useContext(PerfilContext);
  const favoritado = Boolean(favoritadoProp);
  const notaAtual = notaProp ?? notas[filme.id] ?? -1;

  const [modalVisible, setModalVisible] = useState(false);

  const notasDisponiveis = [-1, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const imagemValida = typeof filme.imagem === 'string' && filme.imagem.startsWith('http');

  const handleNotaChange = (valor: number) => {
    salvarNota(filme.id, valor === -1 ? null : valor);
  };

  return (
    <View
      style={styles.tile}
      accessible={true}
      accessibilityLabel={`Filme ${filme.titulo}`}
      accessibilityHint="Toque para abrir os detalhes do filme"
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {imagemValida && (
          <Image
            source={{ uri: filme.imagem }}
            style={styles.imagem}
            accessibilityLabel={`Pôster do filme ${filme.titulo}`}
          />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Text numberOfLines={2} style={styles.titulo}>{filme.titulo}</Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          {Platform.OS === 'ios' ? (
            <>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.pickerWrapper}
                accessibilityLabel={`Selecionar nota para o filme ${filme.titulo}`}
                accessibilityHint="Toque para abrir a lista de notas disponíveis"
              >
                <Text style={styles.pickerText}>
                  {notaAtual === -1 ? '-.-' : notaAtual.toFixed(1)}
                </Text>
              </Pressable>

              <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Picker
                      selectedValue={notaAtual}
                      onValueChange={(v) => {
                        const valor = Number(v);
                        handleNotaChange(valor);
                      }}
                      itemStyle={{ color: 'gold' }}
                      style={{ height: 200 }}
                    >
                      {notasDisponiveis.map(n => (
                        <Picker.Item
                          key={String(n)}
                          label={n === -1 ? '-.-' : n.toFixed(1)}
                          value={n}
                        />
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
                selectedValue={notaAtual}
                style={styles.picker}
                dropdownIconColor="gold"
                mode="dropdown"
                accessibilityLabel={`Nota para o filme ${filme.titulo}`}
                onValueChange={(v) => {
                  const valor = Number(v);
                  handleNotaChange(valor);
                }}
              >
                {notasDisponiveis.map(n => (
                  <Picker.Item
                    key={String(n)}
                    label={n === -1 ? '-.-' : n.toFixed(1)}
                    value={n}
                  />
                ))}
              </Picker>
            </View>
          )}

          <TouchableOpacity
            onPress={() => (favoritado ? removerFavorito(filme) : favoritar(filme))}
            style={styles.heartButton}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    backgroundColor: '#0b0d2a',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 6,
    marginHorizontal: 12,
    alignItems: 'flex-start',
  },
  imagem: {
    width: 90,
    height: 135,
    borderRadius: 8,
    backgroundColor: '#222',
    marginRight: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  titulo: {
    color: 'gold',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 135,
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
  heartButton: {
    marginLeft: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000021',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

