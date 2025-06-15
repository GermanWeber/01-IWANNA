import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, TextInput, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { Usuario } from '../../../../types/usuario';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function Post() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [archivo, setArchivo] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
    const [descripcion, setDescripcion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Función para obtener el mime-type según la extensión del archivo
    const getMimeType = (uri: string) => {
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        if (uri.endsWith('.png')) return 'image/png';
        if (uri.endsWith('.mp4')) return 'video/mp4';
        return 'application/octet-stream';
    };

    // Función para abrir selector de archivos (imágenes o videos)
    const SeleccionaArchivo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
        });

        if (!result.canceled) {
        const asset = result.assets[0];
        if (asset.type === 'video') {
            const videoUri = await prepararVideoParaVisualizacion(asset.uri);
            setArchivo({ uri: videoUri, type: 'video' });
        } else {
            setArchivo({
            uri: asset.uri,
            type: asset.type as 'image' | 'video',
            });
        }
        }
    };

    // Función para subir el post a la API
    const guardarPost = async () => {
        setIsLoading(true);

        if (!archivo) {
            Alert.alert("Error", "Falta colocar el archivo");
            setIsLoading(false);
            return;
        }
        if (!descripcion.trim()) {
            Alert.alert("Error", "Falta colocar la descripción");
            setIsLoading(false);
            return;
        }
        if (!usuario?.id) {
            Alert.alert("Error", "Falta el ID del usuario");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        const urlApi = `${API_URL}s3/publicacion`;

        const uri = archivo.uri;
        const nombre = uri.split('/').pop() ?? 'archivo';
        const tipo = getMimeType(uri);

        try {
            const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
            if (!fileInfo.exists) {
                Alert.alert('Error', 'Archivo no encontrado en la ruta.');
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error('Error al verificar archivo:', error);
            Alert.alert('Error', 'No se pudo verificar el archivo.');
            setIsLoading(false);
            return;
        }

        const fileBlob = {
            uri,
            name: nombre,
            type: tipo,
        };

        formData.append("publicacion", fileBlob as any);
        formData.append("id_user", usuario.id.toString());
        formData.append("descripcion", descripcion);

        try {
            const response = await fetch(urlApi, {
                method: "POST",
                headers: {
                "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const data = await response.json();
            if (!data.exito) {
                Alert.alert("Error", "No se pudo subir el archivo.");
            } else {
                Alert.alert("Éxito", "Archivo subido con éxito.");
                router.back();
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            Alert.alert("Error", "Ocurrió un problema al subir el archivo.");
        }
        setIsLoading(false);
    };

    // Función para preparar el video: copiar a documentDirectory para poder reproducirlo bien
    const prepararVideoParaVisualizacion = async (uri: string): Promise<string> => {
        try {
            const fileName = uri.split('/').pop();
            const newPath = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.copyAsync({
                from: uri,
                to: newPath,
            });

            return newPath;
        } catch (error) {
            console.error("Error al copiar el archivo de video:", error);
            throw error;
        }
    };
    const [modalVisible, setModalVisible] = useState(false);

    const abrirCamara = async () => {
        setModalVisible(false);
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            if (asset.type === 'video') {
            const videoUri = await prepararVideoParaVisualizacion(asset.uri);
            setArchivo({ uri: videoUri, type: 'video' });
            } else {
            setArchivo({ uri: asset.uri, type: 'image' });
            }
        }
    };

    const abrirGaleria = async () => {
        setModalVisible(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });
        if (!result.canceled) {
            const asset = result.assets[0];
            if (asset.type === 'video') {
            const videoUri = await prepararVideoParaVisualizacion(asset.uri);
            setArchivo({ uri: videoUri, type: 'video' });
            } else {
            setArchivo({ uri: asset.uri, type: 'image' });
            }
        }
    };

    // Solicitar permisos para cámara y galería al montar el componente
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permisos necesarios', 'Necesitamos permiso para usar la cámara y galería');
            }
        })();
    }, []);

    // Cargar usuario desde AsyncStorage al montar componente
    useEffect(() => {
        const cargarUsuario = async () => {
        try {
            const datos = await recuperarStorage('usuario');
            if (datos) {
            setUsuario(datos);
            }
        } catch (error) {
            console.error('Error al cargar usuario:', error);
        }
        };
        cargarUsuario();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Selecciona opción</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={abrirCamara}>
                        <Text style={styles.modalButtonText}>Tomar foto o video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={abrirGaleria}>
                        <Text style={styles.modalButtonText}>Seleccionar de la galería</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.modalCancelButton]}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </Modal>
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Seleccionar imagen o video</Text>
            </TouchableOpacity>

            <View style={styles.mediaContainer}>
            {archivo?.type === 'image' && (
                <Image source={{ uri: archivo.uri }} style={styles.media} />
            )}

            {archivo?.type === 'video' && (
                <ExpoVideo
                style={styles.media}
                source={{ uri: archivo.uri }}
                useNativeControls
                isLooping
                resizeMode={ResizeMode.CONTAIN}
                onError={() => {
                    Alert.alert("Error", "No se pudo reproducir el video. Por favor, intenta con otro archivo.");
                }}
                />
            )}
            </View>

            {archivo && (
            <View style={styles.inputContainer}>
                <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                <Text style={styles.sectionTitle}>Descripción</Text>
                </View>
                <TextInput
                style={[styles.input]}
                placeholder="Escribe una breve descripción..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                />
            </View>
            )}

            {archivo && isLoading && (
            <ActivityIndicator size="large" color="#4CAF50" />
            )}

            {archivo && !isLoading && (
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={guardarPost}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
            )}
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
