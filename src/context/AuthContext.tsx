import React, { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { initDB, getUsuario } from '../services/database';
import { PerfilContext, Usuario } from './PerfilContext';

interface AuthContextProps {
  usuario: Usuario | null;
  login: (nome: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { setUsuario: setPerfilUsuario } = useContext(PerfilContext);

  useEffect(() => {
    initDB();
  }, []);

  const login = async (nome: string, senha: string) => {
    const u = await getUsuario(nome, senha);
    if (u) {
      setUsuario(u);
      setPerfilUsuario(u); // ✅ sincroniza corretamente o perfil
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuario(null);
    setPerfilUsuario(null); // ✅ limpa dados do perfil
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
