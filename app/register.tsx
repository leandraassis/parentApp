import { ScrollView } from 'react-native';
import { Avatar, Button, Grid, SnackBar, TextInput, TopBar } from "../components";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native-paper";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/auth';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [helpData, setHelpData] = useState({
    email: null,
    password: null
  });

  const verifyFields = (text: string, name: string) => {
    setHelpData((v: any) => ({
      ...v,
      [name]: text.length === 0 ? "Campo obrigatório" : null,
    }));
  }

  async function CriaConta(email: string, senha: string) {
    const retorno: { id?: string; email?: string; senha?: string; erro?: string } = {};
    try {
      const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
      console.log(credenciais);
      retorno.id = credenciais.user.uid;
      retorno.email = email;
      retorno.senha = senha;
    } catch (error: any) {
      console.log(`${error.code} = ${error.message}`);
      retorno.erro = `Criação de conta falhou: ${error.message}`;
      throw new Error(retorno.erro);
    }
    return retorno;
  }

  return <>
    <TopBar
      back={true}
      menu={false} />
    <ScrollView>
      <Grid style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%'
      }}>
        <Grid style={{
          marginTop: 50,
          ...styles.container,
          ...styles.padding
        }}>
          <Avatar size={200} source={require('../assets/images/baby.png')} />
        </Grid>
        <Grid style={{
          ...styles.padding,
          ...styles.container,
          textAlign: 'center',
          width: '100%'
        }}>
          <Text style={{ ...styles.title }}>Crie sua conta</Text>
        </Grid>
        <Grid style={{
          ...styles.padding
        }}>
          <TextInput
            value={email}
            keyboardType="email-address"
            onChangeText={(text: string) => {
              setEmail(text);
              verifyFields(text, 'email');
            }}
            label="E-mail"
            helpText={helpData.email}
            error={helpData.email !== null}
          />
        </Grid>
        <Grid style={{
          ...styles.padding
        }}>
          <TextInput
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              verifyFields(text, 'password');
            }}
            label="Senha"
            secureTextEntry={true}
            helpText={helpData.password}
            error={helpData.password !== null}
          />
        </Grid>
        <Grid style={{
          ...styles.padding
        }}>
          <Button
            style={{
              borderRadius: 0,
              backgroundColor: "#6C48C5",
            }}
            loading={loading}
            mode="contained"
            onPress={async () => {
              if (email.length > 0 && password.length > 0) {
                setLoading(true);
                try {
                  await CriaConta(email, password);
                  setMessage("Conta criada com sucesso");
                  setTimeout(() => {
                    router.replace("/login");
                  }, 1500); 
                } catch (error: any) {
                  setMessage("Erro ao tentar criar conta");
                }
                setLoading(false);
              } else {
                setMessage("Preencha todos os campos");
                verifyFields(email, 'email');
                verifyFields(password, 'password');
              }
            }}>
            Criar
          </Button>
        </Grid>
      </Grid>
    </ScrollView>
    <SnackBar
      visible={message !== null}
      onDismiss={() => setMessage(null)}
      duration={3000}
      text={message}
    />
  </>;
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#6C48C5',
    fontWeight: 'bold',
  }
}