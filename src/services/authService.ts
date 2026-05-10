import { User } from '../types';

const SESSION_KEY = 'chaisa_user_session';

export const authService = {
  login(username: string, password: string): User | null {
    // Sistema simples para demonstração/uso local
    // Em produção real, isso seria validado no servidor
    if ((username === 'admin' && password === 'admin123') || (username === 'jose' && password === 'jose123')) {
      const user: User = {
        id: crypto.randomUUID(),
        name: username === 'admin' ? 'Administrador' : 'Jose Chaisa',
        email: `${username}@chaisa.com`,
        role: username === 'admin' ? 'Administrador' : 'Gestor',
        avatar: `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
};
