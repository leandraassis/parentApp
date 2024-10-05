import React, { useEffect } from 'react';
import { Text, Image, StyleSheet, ScrollView, View } from 'react-native';
import { IconButton, TopBar } from '../../components';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/auth';
import { useSession } from '../ctx';

export default function HomeScreen() {

  const { session, signOut } = useSession();

  useEffect(() => {
    console.log(session);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Estado de autenticação alterado:", user);
        if (user) {
            const uid = user.uid;
            console.log("Usuário autenticado com UID:", uid);
        } else {
            console.log("Usuário não autenticado");
            signOut();
        }
    });

    return () => unsubscribe();
}, []);

  return (
    <>
      <TopBar title="Home" />
      <ScrollView>
        <View style={styles.container}>
        <Image
          source={require('../../assets/images/fraldas.jpg')}
          style={styles.image}
        />
        <IconButton
          icon="arrow-down"
          size={40}
        />
        <Text style={{ ...styles.text, width: "90%" }}>Olá, responsável!</Text>
        <IconButton
          icon="arrow-down"
          size={40}
        />
        <Text style={{ ...styles.text, width: "90%" }}>Sabemos que cuidar de um bebê não é fácil, e estamos aqui para ajudar.</Text>
        <IconButton
          icon="arrow-down"
          size={40}
        />
        <Text style={{ ...styles.text, width: "90%" }}>Controle seu estoque de fraldas e seja avisado quando elas estiverem acabando!</Text>
        </View>
        </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "100%",
  },
  text: {
    fontSize: 24,
    color: '#6C48C5',
    fontWeight: 'bold',
    marginBottom: 16, 
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: 'cover',
  },
});
