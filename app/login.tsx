import { ScrollView } from 'react-native';
import { Avatar, Button, Grid, SnackBar, TextInput } from "../components";
import { useSession } from "./ctx";
import { Link } from "expo-router";
import { useState } from "react";
import { Text } from "react-native-paper";

export default function LoginScreen() {
  const { signIn } = useSession();
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

  return <>
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
          <Text style={{...styles.title}}>LOGIN</Text>
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
                  await signIn(email, password);
                  setMessage(null);
                } catch (error: any) {
                  setMessage("Erro ao fazer login. Tente verificar as credenciais");
                }
                setLoading(false);
              } else {
                setMessage("Preencha todos os campos");
                verifyFields(email, 'email');
                verifyFields(password, 'password');
              }
            }}>
            Entrar
          </Button>
        </Grid>
        <Grid style={{
          ...styles.padding,
          ...styles.container,
          textAlign: 'center'
        }}>
          {/*@ts-ignore*/}
          <Link href="register" style={{...styles.title, fontSize: 15,}}>
            Criar conta
          </Link>
        </Grid>
        <Grid style={{
          ...styles.padding,
          ...styles.container,
          textAlign: 'center'
        }}>
          {/*@ts-ignore*/}
          <Link href="forgot-password" style={{...styles.title, fontSize: 15,}}>
            Esqueci minha senha
          </Link>
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