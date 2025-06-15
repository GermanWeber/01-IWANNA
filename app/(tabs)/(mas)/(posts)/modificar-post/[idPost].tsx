import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { BUCKET_URL } from '@env';
import { eliminarDatos, recuperarStorage } from '../../../../../services/asyncStorage';
import { PostType } from '../../../../../types/post';
import ConfirmModal from '../../../../../components/confirmModal';
import { modificarPost } from '../../../../../services/postService';

export default function Post() {
    const [post, setPost] = useState<PostType | undefined>(undefined)
    const [detalle, setDetalle] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const botonModificarPost = async () => {
        try {
            setLoading(true);
            await modificarPost(Number(post?.id),String(detalle));
            router.back();
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al eliminar el post.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (post?.detalle) {
            setDetalle(post.detalle);
        }
    }, [post]);
    
    useEffect(() => {
        const cargarPost = async () => {
            try {
                const datos = await recuperarStorage('postParaModificar');
                if (datos) {
                    setPost(datos[0]);
                    await eliminarDatos('postParaModificar');
                } else {
                    Alert.alert('Error', 'No se encontraron datos del post.');
                }
            } catch (error) {
                Alert.alert('Error', 'No se pudo cargar el post.');
            }
        };

    cargarPost();
    }, []);

    const isVideo = post?.archivo?.endsWith('.mp4') ?? false;
    
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <ConfirmModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onConfirm={botonModificarPost}
                isLoading={loading}
                title="¿Modificar esta publicación?"
                message="Esta seguro de modificar la publicación"
            />
            <View style={styles.container}>
                <View style={styles.mediaContainer}>
                {(!isVideo && post) &&(
                    <Image source={{ uri: `${BUCKET_URL}publicaciones/${post.archivo}` || undefined }} style={styles.media} />
                )}

                {(isVideo && typeof post?.archivo === 'string') && (
                    <ExpoVideo
                        style={styles.media}
                        source={{ uri:`${BUCKET_URL}publicaciones/${post.archivo}` }}
                        useNativeControls
                        isLooping
                        resizeMode={ResizeMode.CONTAIN}
                        onError={() => {
                            Alert.alert("Error", "No se pudo reproducir el video. Por favor, intenta con otro archivo.");
                        }}
                    />
                )}
                </View>

                {post && (
                    <View style={styles.inputContainer}>
                        <View style={styles.sectionHeader}>
                        <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                        <Text style={styles.sectionTitle}>Descripción</Text>
                        </View>
                        <TextInput
                            style={[styles.input]}
                            placeholder="Escribe una breve descripción..."
                            value={detalle}
                            onChangeText={setDetalle}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                )}

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Ionicons name="close-circle-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(true)}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        minHeight: "100%",
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        padding: 20,
    },
    addButton: {
        backgroundColor: '#8BC34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    mediaContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    media: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
    inputContainer: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '80%',
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        width: '100%',
        paddingVertical: 15,
        marginBottom: 10,
        backgroundColor: '#8BC34A',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCancelButton: {
        backgroundColor: '#E53935',
    },
    modalCancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});
