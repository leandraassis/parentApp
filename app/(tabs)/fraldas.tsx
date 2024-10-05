import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { IconButton, Table, TopBar, Button, TextInput } from '../../components';
import { listarFraldas, atualizarFralda, deletarFralda } from '../../services/database';
import { Fralda } from '../../interfaces/Fralda';
import { router } from "expo-router";
import { auth } from '../../services/auth';
import { onAuthStateChanged } from 'firebase/auth';

export default function FraldasScreen() {
  const [fraldas, setFraldas] = useState<Fralda[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFralda, setCurrentFralda] = useState<Fralda | null>(null);
  const [updatedMarca, setUpdatedMarca] = useState('');
  const [updatedQuantidade, setUpdatedQuantidade] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadingFraldas = async () => {
      console.log(userId);

      if (userId) {
        try {
          const allFraldas = await listarFraldas();
          const userFraldas = allFraldas.filter(fralda => fralda.userId === userId);

          setFraldas(userFraldas);
        } catch (error) {
          console.error("Erro ao carregar fraldas", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadingFraldas();
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      await deletarFralda(id);
      setFraldas(fraldas.filter(fralda => fralda.id !== id));
    } catch (error) {
      console.error("Erro ao excluir fralda", error);
    }
  };

  const handleUpdate = async () => {
    if (currentFralda) {
      try {
        await atualizarFralda({
          ...currentFralda,
          marca: updatedMarca || currentFralda.marca,
          quantidade: parseInt(updatedQuantidade) || currentFralda.quantidade,
        });
        setFraldas(fraldas.map(fralda => (fralda.id === currentFralda.id ? { ...currentFralda, marca: updatedMarca, quantidade: parseInt(updatedQuantidade) } : fralda)));
        setModalVisible(false);
        setCurrentFralda(null);
      } catch (error) {
        console.error("Erro ao atualizar fralda", error);
      }
    }
  };

  const openUpdateModal = (fralda: Fralda) => {
    setCurrentFralda(fralda);
    setUpdatedMarca(fralda.marca);
    setUpdatedQuantidade(fralda.quantidade.toString());
    setModalVisible(true);
  };

  const totalQuantidade = fraldas.reduce((acc, fralda) => acc + fralda.quantidade, 0);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const columns = [
    { title: 'Marca', accessor: (item: Fralda) => item.marca, numeric: false },
    { title: 'Quantidade', accessor: (item: Fralda) => item.quantidade.toString(), numeric: true },
    {
      accessor: (item: Fralda) => (
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => openUpdateModal(item)}
          />
          <IconButton
            icon="trash-can"
            size={20}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      ),
      numeric: false
    }
  ];

  return (
    <>
      <TopBar title="Fraldas" />
      <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6C48C5', marginBottom: 16 }}>
          Estoque de Fraldas
        </Text>
        <Table
          data={fraldas}
          columns={columns}
        />
        <Button style={{ ...styles.button, width: "60%", marginTop: 15 }} onPress={() => router.push("/form")}>
          <Text style={{ color: "white" }}>Nova Fralda</Text>
        </Button>
        <Text style={styles.totalText}>
          Quantidade Total: {totalQuantidade}
        </Text>
        {totalQuantidade <= 10 && (
          <>
            <Text style={styles.alertText}>
              ATENÇÃO:
            </Text>
            <Text style={styles.alertText}>
              A quantidade de fraldas está baixa!
            </Text>
          </>
        )}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.input}
                placeholder="Marca"
                value={updatedMarca}
                onChangeText={setUpdatedMarca}
              />
              <TextInput
                style={styles.input}
                placeholder="Quantidade"
                value={updatedQuantidade}
                onChangeText={setUpdatedQuantidade}
                keyboardType="numeric"
              />
              <Button style={styles.button} mode="contained" onPress={handleUpdate}>Salvar</Button>
              <Button style={{ ...styles.button, backgroundColor: "#C68FE6" }} mode="contained" onPress={() => setModalVisible(false)}>Cancelar</Button>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderColor: '#6C48C5',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    borderColor: '#6C48C5',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    backgroundColor: '#6C48C5'
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#6C48C5'
  },
  alertText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'red'
  }
});
