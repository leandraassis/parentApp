import { ScrollView } from 'react-native';
import { Avatar, Button, Grid, SnackBar, TextInput, TopBar } from "../components";
import { useState, useEffect } from "react";
import { Text } from "react-native-paper";
import { inserirFralda } from '../services/database';
import { Fralda } from '../interfaces/Fralda';
import { router } from 'expo-router';
import { auth } from '../services/auth'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function FormScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [marca, setMarca] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [helpData, setHelpData] = useState({
    marca: null,
    quantidade: null,
  });

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("ID PORRRRRA: " + user);
      if (user) {
        setUserId(user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
    });

    return () => unsubscribe();
  }, []);

  const verifyFields = (text: string, name: string) => {
    setHelpData((v: any) => ({
      ...v,
      [name]: text.length === 0 ? "Campo obrigatório" : null,
    }));
  }

  const handleSubmit = async () => {
    if (marca.length > 0 && quantidade.length > 0 && userId) {
      setLoading(true);
      try {
        const newFralda: Fralda = {
          marca: marca,
          quantidade: parseInt(quantidade, 10),
          userId: userId,
        };
        const id = await inserirFralda(newFralda);
        setMessage(`Fralda salva com sucesso! ID: ${id}`);
        setTimeout(() => {
          router.push("/fraldas");
        }, 1500); 
      } catch (error: any) {
        setMessage("Erro ao tentar salvar a fralda");
      }
      setLoading(false);
    } else {
      setMessage("Preencha todos os campos");
      verifyFields(marca, 'marca');
      verifyFields(quantidade, 'quantidade');
    }
  };

  return (
    <>
      <TopBar back={true} menu={false} />
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
            <Avatar style={{ marginTop: -30 }} size={200} source={require('../assets/images/baby.png')} />
          </Grid>
          <Grid style={{
            ...styles.padding,
            ...styles.container,
            textAlign: 'center',
            width: '100%'
          }}>
            <Text style={{ ...styles.title }}>Cadastrar Fralda</Text>
          </Grid>
          <Grid style={{ ...styles.padding }}>
            <TextInput
              value={marca}
              onChangeText={(text: string) => {
                setMarca(text);
                verifyFields(text, 'marca');
              }}
              label="Marca"
              helpText={helpData.marca}
              error={helpData.marca !== null}
            />
          </Grid>
          <Grid style={{ ...styles.padding }}>
            <TextInput
              value={quantidade}
              onChangeText={(text: string) => {
                setQuantidade(text);
                verifyFields(text, 'quantidade');
              }}
              label="Quantidade"
              keyboardType="numeric"
              helpText={helpData.quantidade}
              error={helpData.quantidade !== null}
            />
          </Grid>
          <Grid style={{ ...styles.padding }}>
            <Button
              style={{
                borderRadius: 0,
                backgroundColor: "#6C48C5",
              }}
              loading={loading}
              mode="contained"
              onPress={handleSubmit}>
              Salvar
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
    </>
  );
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
