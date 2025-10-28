import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Usuario {
  id: number;
  nome: string;
  senha: string;
  foto?: string;
}

let usuariosCache: Usuario[] | null = null;

export const initDB = async (): Promise<void> => {
  if (usuariosCache === null) {
    const json = await AsyncStorage.getItem('usuarios');
    usuariosCache = json ? JSON.parse(json) : [];
  }
};

export const addUsuario = async (
  nome: string,
  senha: string,
  foto?: string
): Promise<void> => {
  if (usuariosCache === null) await initDB();

  if (usuariosCache!.some(u => u.nome === nome)) {
    throw new Error('Usuário já existe');
  }

  const fotoValida =
    typeof foto === 'string' &&
    (foto.startsWith('http') || foto.startsWith('data:image/'))
      ? foto
      : undefined;

  const novoUsuario: Usuario = {
    id: Date.now(),
    nome,
    senha,
    foto: fotoValida,
  };

  usuariosCache!.push(novoUsuario);
  await AsyncStorage.setItem('usuarios', JSON.stringify(usuariosCache));
};

export const getUsuario = async (
  nome: string,
  senha: string
): Promise<Omit<Usuario, 'senha'> | null> => {
  if (usuariosCache === null) await initDB();

  const user = usuariosCache!.find(u => u.nome === nome && u.senha === senha);
  if (!user) return null;

  const { id, nome: n, foto } = user;
  return { id, nome: n, foto }; // ✅ retorna foto como foi salva
};

export const getAllUsuarios = async (): Promise<Omit<Usuario, 'senha'>[]> => {
  if (usuariosCache === null) await initDB();
  return usuariosCache!.map(({ id, nome, foto }) => ({ id, nome, foto }));
};
