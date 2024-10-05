import { useContext, createContext, type PropsWithChildren } from 'react';
import { setStorageItemAsync, useStorageState } from './useStorageState';
import { signInWithEmailAndPassword, sendPasswordResetEmail, UserCredential } from 'firebase/auth';
import { auth as authh } from '../services/auth';
import { router } from 'expo-router';
import { UserInterface } from '../interfaces/User';
import { inserirUser, listarUsers } from '../services/databaseUser';

const LogginUser = async (email: string, senha: string, setSession: (token: string) => void) => {
    const auth = authh;

    try {
        const response: UserCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user: any = response.user.toJSON();

        const createdAt = user.metadata?.creationTime || new Date().toISOString(); 

        const _user: UserInterface = {
            email: user.email || "",
            emailVerified: user.emailVerified.toString(),
            displayName: user.displayName || "",
            uid: user.uid,
            username: "",
            photoURL: user.photoURL || "",
            phoneNumber: user.phoneNumber || "",
            createdAt: createdAt,
            sync: 1
        };

        const allUsers = await listarUsers();
        const existingUser = allUsers.some(u => u.email === user.email);
        
        console.log(user.uid);
        console.log(existingUser);

        if (existingUser) {
            console.log("Usuário já existe");
        } else {
            await inserirUser(_user);
            console.log("Novo usuário criado");
            
        }

        setSession(user.stsTokenManager.accessToken);
        console.log(user.stsTokenManager.accessToken);
        await router.replace("(tabs)");
    } catch (error: any) {
        console.error('Error durnte o login:', error);
        throw new Error('Login inválido');
    }
};


const AuthContext = createContext<{
    signIn: (email: string, senha: string) => Promise<void>;
    signOut: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
    session?: string | null;
    isLoading: boolean;
    changeTheme: (theme: string) => void;
    theme?: string | null;
    isLoadingTheme: boolean;
}>({
    signIn: async () => { },
    signOut: async () => { },
    sendPasswordReset: async () => { },
    session: null,
    isLoading: false,
    changeTheme: async (theme: string) => null,
    theme: null,
    isLoadingTheme: false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const [[isLoadingTheme, theme], setTheme] = useStorageState('theme');

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email: string, senha: string) => {
                    try {
                        await LogginUser(email, senha, setSession);
                    } catch (error) {
                        console.error(error);
                    }
                },
                signOut: async () => {
                    setSession(null);
                    await authh.signOut();
                    await router.replace("/login");
                },
                sendPasswordReset: async (email: string) => {
                    try {
                        await sendPasswordResetEmail(authh, email);
                    } catch (error) {
                        console.error(error);
                        alert('Erro ao enviar email de redefinição de senha.');
                    }
                },
                changeTheme: async (theme: string) => {
                    await setStorageItemAsync('theme', theme);
                    setTheme(theme);
                },
                session,
                isLoading,
                theme,
                isLoadingTheme,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
