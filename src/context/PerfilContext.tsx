import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Filme } from '../types/Filme';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Usuario {
  id: number;
  nome: string;
  foto?: string | null;
}

interface PerfilContextProps {
  favoritos: Filme[];
  isFavorito: (filme: Filme) => boolean;
  favoritar: (filme: Filme) => void;
  removerFavorito: (filme: Filme) => void;
  notas: Record<number, number>;
  salvarNota: (filmeId: number, nota: number | null) => void;
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

export const PerfilContext = createContext<PerfilContextProps>({} as PerfilContextProps);

const STORAGE_KEY_FAVORITOS = 'perfil_favoritos_';
const STORAGE_KEY_NOTAS = 'perfil_notas_';

export const PerfilProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<Filme[]>([]);
  const [notas, setNotas] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!usuario) {
      setFavoritos([]);
      setNotas({});
      return;
    }

    const loadData = async () => {
      try {
        const favKey = STORAGE_KEY_FAVORITOS + usuario.id;
        const favRaw = Platform.OS === 'web'
          ? localStorage.getItem(favKey)
          : await AsyncStorage.getItem(favKey);
        setFavoritos(favRaw ? JSON.parse(favRaw) : []);

        const notasKey = STORAGE_KEY_NOTAS + usuario.id;
        const notasRaw = Platform.OS === 'web'
          ? localStorage.getItem(notasKey)
          : await AsyncStorage.getItem(notasKey);
        setNotas(notasRaw ? JSON.parse(notasRaw) : {});
      } catch (e) {
        console.warn('Erro carregando dados do usuário', e);
        setFavoritos([]);
        setNotas({});
      }
    };

    loadData();
  }, [usuario]);

  const salvarFavoritos = async (lista: Filme[]) => {
    if (!usuario) return;
    const key = STORAGE_KEY_FAVORITOS + usuario.id;
    try {
      if (Platform.OS === 'web') localStorage.setItem(key, JSON.stringify(lista));
      else await AsyncStorage.setItem(key, JSON.stringify(lista));
    } catch (e) {
      console.warn('Erro salvando favoritos', e);
    }
  };

  const favoritar = (filme: Filme) => setFavoritos(prev => {
    if (prev.some(f => f.id === filme.id)) return prev;
    const novo = [...prev, filme];
    salvarFavoritos(novo);
    return novo;
  });

  const removerFavorito = (filme: Filme) => setFavoritos(prev => {
    const novo = prev.filter(f => f.id !== filme.id);
    salvarFavoritos(novo);
    return novo;
  });

  const isFavorito = (filme: Filme) => favoritos.some(f => f.id === filme.id);

  const salvarNota = (filmeId: number, nota: number | null) => setNotas(prev => {
    if (!usuario) return prev;
    const copy = { ...prev };
    if (nota === null) delete copy[filmeId];
    else copy[filmeId] = nota;

    const key = STORAGE_KEY_NOTAS + usuario.id;
    try {
      if (Platform.OS === 'web') localStorage.setItem(key, JSON.stringify(copy));
      else AsyncStorage.setItem(key, JSON.stringify(copy));
    } catch (e) {
      console.warn('Erro salvando nota', e);
    }

    return copy;
  });

  return (
    <PerfilContext.Provider
      value={{
        favoritos,
        isFavorito,
        favoritar,
        removerFavorito,
        notas,
        salvarNota,
        usuario,
        setUsuario,
      }}
    >
      {children}
    </PerfilContext.Provider>
  );
};
