import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, StatusBar, FlatList, RefreshControl, StyleSheet, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import Post from '../../../../../components/post';
import { useCallback, useEffect, useState } from 'react';
import { PostType } from '../../../../../types/post';
import { eliminarPost, obtenerPostsByIdPost } from '../../../../../services/postService';
import { Ionicons } from '@expo/vector-icons';
import ConfirmModal from '../../../../../components/confirmModal';
import { guardarStorage } from '../../../../../services/asyncStorage';
const VerPost = () => {
    const { idPost } = useLocalSearchParams();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const botonEliminarPost = async () => {
        try {
            setLoading(true);

            await eliminarPost(Number(idPost));
            router.back();
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al eliminar el post.');
        } finally {
            setLoading(false);
        }
    }

    const modificarPost = async () => {
        await guardarStorage('postParaModificar', posts);
        router.push(`../modificar-post/${idPost}`)
    }


    useFocusEffect(
        useCallback(() => {
            const cargaPost = async () => {
            const post = await obtenerPostsByIdPost(Number(idPost));
            setPosts(post);
            };
            cargaPost();
        }, [idPost])
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <ConfirmModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onConfirm={botonEliminarPost}
                isLoading={loading}
                title="¿Eliminar este post?"
                message="Esta accion no se podra deshacer"
            />
            <View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(true)}>
                        <Ionicons name="trash-bin-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveButton} onPress={() => modificarPost()}>
                        <Ionicons name="create-outline" size={20} color="#fff" /> 
                        <Text style={styles.buttonText}>Modificar</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <FlatList
                data={posts}
                keyExtractor={(item) => `post-${item.id}`}
                renderItem={({ item }) => {
                    return <Post datos={item} />;
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ActivityIndicator color="#555" />
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default VerPost;

const styles = StyleSheet.create({

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    contenedor_post: {
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    info_usuario: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    foto_usuario: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    nombre: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    imagen_post: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginVertical: 10,
    },
    icono: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    descripcion: {
        marginBottom: 4,
    },

    contenedor_datos_post: {
        flexDirection: 'row',
        gap: 10
    },

    dato_post: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        paddingBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
        buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8BC34A',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E53935',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});