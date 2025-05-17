import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Modal, Button} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useEffect, useState } from 'react';
import { recuperarStorage } from '../../../../services/asyncStorage';
import * as ImagePicker from 'expo-image-picker';
import { Usuario } from '../../../../types/usuario';
import { API_URL } from '@env';
const imgPerfil = require('../../../../assets/images/perfil.png');

export default function EditarPerfil() {
    const [modalVisible, setModalVisible] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    
    const manejarDireccion = (direccion: {
        descripcion: string;
        latitud: number;
        longitud: number;
    }) => {
        console.log('Dirección seleccionada:', direccion);
    };

    const seleccionarFoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
        });

        if (!result.canceled) {
            const nuevaFoto = result.assets[0].uri;
            setUsuario((prev: any) => ({ ...prev, foto: nuevaFoto }));
            setModalVisible(false);
        }
    };

    const tomarFoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
        });

        if (!result.canceled) {
            const nuevaFoto = result.assets[0].uri;
            setUsuario((prev: any) => ({ ...prev, foto: nuevaFoto }));
            setModalVisible(false);
        }
    };

    const guardarDatos = async () => {
        
        let esValido: boolean = true;
        if(usuario){
            // RESTRICCIONES
            if(!usuario.nombre){
                esValido = false;
            }

            //SUBE AL SERVIDOR
            if(esValido){
                const urlApi = `${API_URL}usuarios/update-user/${usuario.id}`;
                console.log("URL API: ",urlApi);
                try {
                    const res = await fetch(urlApi, {
                        method: 'PUT',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(usuario),
                    });

                    if (!res.ok) {
                        throw new Error(`Error al enviar datos. Status: ${res.status}`);
                    }

                    const data = await res.json();
                    console.log('Usuario editado:', data);
                } catch (error) {
                    console.error('Error al enviar usuario:', error);
                }
            } else {
                Alert.alert(
                "Campos incompletos",
                "Por favor, completa todos los campos obligatorios antes de guardar.",
                [{ text: "OK" }]
            );
            }
            
        }
    }

    useEffect(() => {
    (async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos permiso para usar la cámara y galería');
        }
    })();
    }, []);

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
        <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={100}
        >
            <View style={styles.container}>
                {/* Sección de Foto de Perfil */}
                {usuario && (
                <TouchableOpacity style={styles.avatarContainer} onPress={() => setModalVisible(true)}>
                    <Image
                        source={usuario.foto ? { uri: usuario.foto } : imgPerfil}
                        style={styles.avatar}
                    />
                    <View style={styles.avatarOverlay}>
                        <Ionicons name="camera-outline" size={24} color="#fff" />
                    </View>
                </TouchableOpacity>
                )}

                {/* Sección de Datos Personales */}
                {usuario && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-circle-outline" size={24} color="#8BC34A" />
                        <Text style={styles.sectionTitle}>Datos Personales</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder={"Ingresa tu nombre"} 
                            value={usuario.nombre}
                            onChangeText={(text) =>
                                setUsuario((prev) => prev ? { ...prev, nombre: text } : prev)
                            }
                        />
                    </View>

                    {usuario.id_tipo == 1 && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Profesión</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ingresa tu profesion"
                            value={usuario.profesion}
                            onChangeText={(text) =>
                                setUsuario((prev) => prev ? { ...prev, profesion: text } : prev)
                            }
                        />
                    </View>
                    )}
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Edad</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Ingresa tu edad"
                            keyboardType="numeric"
                            value={usuario.edad?.toString()} 
                            onChangeText={(text) =>
                                setUsuario((prev) => prev ? { ...prev, edad: parseInt(text) || 0 } : prev)
                            }
                        />
                            
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Direccion</Text>
                        <TouchableOpacity style={styles.input} onPress={() => router.push('/(perfil_usuario)/direccion')}>
                            <Text style={styles.inputText}>Seleccionar dirección</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                )}

                {/* Sección de Descripción */}
                {usuario && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                    <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                    <Text style={styles.sectionTitle}>Sobre Mí</Text>
                    </View>
                    <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Escribe una breve descripción..."
                    value={usuario.descripcion}
                    multiline
                    numberOfLines={4}
                    />
                </View>
                )}

                {/* Sección de Contacto */}
                {usuario && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="call-outline" size={24} color="#8BC34A" />
                        <Text style={styles.sectionTitle}>Contacto</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput style={styles.input} 
                            placeholder="Ej: +56 9 1234 5678"
                            keyboardType="phone-pad"
                            value={usuario?.telefono}
                            onChangeText={(text) =>
                                setUsuario((prev) => prev ? { ...prev, telefono: text } : prev)
                            } 
                        />
                    </View>
                </View>
                )}

                {/* Botones de Guardar y Cancelar */}
                {usuario && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/(perfil_usuario)/mi-perfil')}>
                        <Ionicons name="close-circle-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={guardarDatos}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
                )}

            </View>

            {/* MODAL */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.buttonRow}>
                            <Button title="Seleccionar Foto" onPress={seleccionarFoto} color="#8BC34A" />
                            <View style={{ width: 10 }} />
                                <Button title="Tomar Foto" onPress={tomarFoto} color="#8BC34A" />
                            </View>
                        <View style={{ height: 20 }} />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#f44336" />
                    </View>
                </View>
            </Modal>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
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
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#8BC34A',
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#8BC34A',
        borderRadius: 20,
        padding: 6,
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputText: {
        fontSize: 16,
        color: '#888',
    },

    textArea: {
        height: 100,
        textAlignVertical: 'top',
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
    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
