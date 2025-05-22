import { router} from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, TextInput, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { API_URL} from '@env';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { Usuario } from '../../../../types/usuario';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


export default function Post() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [archivo, setArchivo] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
    const [descripcion, setDescripcion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const getMimeType = (uri: string) => {
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        if (uri.endsWith('.png')) return 'image/png';
        if (uri.endsWith('.mp4')) return 'video/mp4';
        return 'application/octet-stream';
    };

    const SeleccionaArchivo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setArchivo({
                uri: asset.uri,
                type: asset.type as 'image' | 'video',
            });
        }
    };

    const guardarPost = async () => {
        setIsLoading(true);
        const formData = new FormData();
        const urlApi = `${API_URL}s3/publicacion`;

        if(!archivo){
            Alert.alert("Error","Falta colocar el archivo");
            setIsLoading(false);
            return;
        }
        if(!descripcion){
            Alert.alert("Error","Falta colocar la descripcion");
            setIsLoading(false);
            return;
        }
        if (!usuario?.id) {
            Alert.alert("Error","Falta el ID del usuario");
            setIsLoading(false);
            return;
        }

        const uri = archivo.uri;
        const nombre = uri.split('/').pop() ?? 'archivo';
        const tipo = getMimeType(uri); // tu función para obtener mime-type

        

        console.log("URI del video:", archivo.uri);
        console.log("mime:", tipo);

        const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
        if (!fileInfo.exists) {
            console.error('Archivo no encontrado en la ruta:', uri);
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
                body: formData
            });

            const data = await response.json();
            console.log("Archivo subido con éxito:", data.url);

        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
        setIsLoading(false);
    };
    
    //Solicita acceso a la camara y galeria
    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permisos necesarios', 'Necesitamos permiso para usar la cámara y galería');
            }
        })();
    }, []);

    //Carga usuario desde Storage
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const datos = await recuperarStorage('usuario');
                console.log("datos: ", datos);
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
            <View style={styles.container}>
                <TouchableOpacity style={styles.addButton} onPress={SeleccionaArchivo}>
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
                
                {/* Botones de Guardar y Cancelar */}
                {archivo && isLoading && (
                    <View>
                        <ActivityIndicator size="large" color="#4CAF50" />
                    </View>
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
    )
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
});