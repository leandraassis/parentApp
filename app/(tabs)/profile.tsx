import { ScrollView } from 'react-native';
import { Avatar, Camera, Button, Fab, Grid, SnackBar, TextInput, TopBar } from "../../components";
import { useRef, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { UserInterface } from "../../interfaces/User";
import { atualizarUser, obterUser } from "../../services/databaseUser";
import { onAuthStateChanged } from "firebase/auth";
import { auth as authh } from "../../services/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfileScreen() {
    const [cameraVisible, setCameraVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const cameraRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserInterface>({ photoURL: null });

    

    const getUser = async (uid) => {
        const userData = await obterUser(uid);
        if (userData) {
            setData((prev) => ({ ...prev, ...userData }));
        } else {
            console.log("Usuário não encontrado");
        }
    };

    //precisei de ajuda de IA (chatgpt) 
    const uploadImage = async (uri) => {
        const storage = getStorage();
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `images/${new Date().getTime()}-${uri.split('/').pop()}`;
        const storageRef = ref(storage, filename);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL; 
    };

    const _update = async () => {
        setLoading(true);
        try {
            let imageUrl = null;
            if (data.photoURL) {
                imageUrl = await uploadImage(data.photoURL);
            }
            const updatedData = { ...data, photoURL: imageUrl || data.photoURL };
            await atualizarUser(updatedData);
            alert("Dados atualizados com sucesso!!!");
        } catch (err) {
            alert("Um erro ocorreu ao atualizar o perfil.");
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authh, async (user) => {
            if (user) {
                const uid = user.uid;
                console.log("Usuário autenticado com UID:", uid);
                setData((prev) => ({ ...prev, uid }));
                await getUser(uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setData((v) => ({ ...v, photoURL: result.assets[0].uri }));
        }
    };

    const onCapture = (photo) => {
        setData((prev) => ({ ...prev, photoURL: photo.uri }));
    };

    return (
        <>
            <TopBar title="Perfil" />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Grid style={styles.containerImage}>
                    <Grid style={styles.containerCenterImage}>
                        {data.photoURL ? (
                            <Avatar size={230} source={{ uri: data.photoURL }} />
                        ) : (
                            <Avatar size={230} icon="account" />
                        )}
                        <Fab onPress={pickImage} icon="image" style={{ ...styles.fab, ...styles.left }} />
                        <Fab onPress={() => setCameraVisible(true)} icon="camera" style={{ ...styles.fab, ...styles.right }} />
                    </Grid>
                </Grid>
                <Grid style={{ marginTop: 30, ...styles.padding }}>
                    <TextInput
                        label="Nome"
                        value={data.displayName}
                        onChangeText={(text: string) => setData((v) => ({ ...v, displayName: text }))}
                    />
                </Grid>
                <Grid style={styles.padding}>
                    <TextInput
                        label="Nome de usuário"
                        value={data.username}
                        onChangeText={(text: string) => setData((v) => ({ ...v, username: text }))}
                    />
                </Grid>
                <Grid style={styles.padding}>
                    <TextInput
                        label="Telefone"
                        keyboardType="numeric"
                        value={data.phoneNumber}
                        onChangeText={(text: string) => setData((v) => ({ ...v, phoneNumber: text }))}
                    />
                </Grid>
                <Grid style={styles.padding}>
                    <Button loading={loading} onPress={_update} mode="contained">
                        Salvar
                    </Button>
                </Grid>
            </ScrollView>

            <SnackBar
                visible={message !== null}
                onDismiss={() => setMessage(null)}
                duration={5000}
                text={message}
            />
            {cameraVisible && <Camera onCapture={onCapture} setCameraVisible={setCameraVisible} ref={cameraRef} />}
        </>
    );
}

const styles = {
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    padding: {
        padding: 16,
    },
    containerCenterImage: {
        width: 230,
        position: 'relative',
    },
    fab: {
        bottom: 0,
        position: 'absolute',
        borderRadius: 200,
    },
    right: {
        right: 0,
    },
    left: {
        left: 0,
    },
};
