import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Modal, Button, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCallback, useEffect, useState } from 'react';
import { guardarStorage, recuperarStorage } from '../../../../services/asyncStorage';
import * as ImagePicker from 'expo-image-picker';
import { Usuario } from '../../../../types/usuario';
import { API_URL, BUCKET_URL } from '@env';
import { guardarDireccion } from '../../../../services/direccionService';
import { guardarDatos, guardarFoto, obtenerUsuario } from '../../../../services/userService';
const imgPerfil = require('../../../../assets/images/perfil.png');

export default function EditarPerfil() {
    const [modalFotoVisible, setModalFotoVisible] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [direccion, setDireccion] = useState<InterfaceDireccion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nuevaFoto, setNuevaFoto] = useState<any>(null);

    const toDireccion = () => {
        router.push('../../../screens/direccion');
    }

    const seleccionarFoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
        });

        if (!result.canceled) {
            const foto = result.assets[0].uri;
            setNuevaFoto(foto);
            setModalFotoVisible(false);
        }
    };

    const tomarFoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
        });

        if (!result.canceled) {
            const foto = result.assets[0].uri;
            setNuevaFoto(foto);
            setModalFotoVisible(false);
        }
    };

    const guardarUsuario = async () => {
        setIsLoading(true);
        let esValido: boolean = true;

        if (usuario) {
            // Validaciones
            if (!usuario.nombre || !usuario.apellido || !direccion?.descripcion) {
                esValido = false;
            }

            if (esValido) {
                try {
                    // Guardar dirección
                    if (direccion) {
                        const resDireccion = await guardarDireccion(usuario.id, direccion);
                        if (!resDireccion) {
                            Alert.alert("Error", "Error al guardar dirección");
                            setIsLoading(false);
                            return;
                        }
                    }

                    // Guardar usuario
                    if (usuario) {
                        const resDatos = await guardarDatos(usuario);
                        if (!resDatos) {
                            Alert.alert("Error", "Error al guardar usuario");
                            setIsLoading(false);
                            return;
                        }
                    }

                    if (nuevaFoto) {
                        const resFoto = await guardarFoto(nuevaFoto,usuario);
                    } 
                    const usuarioDatos = await obtenerUsuario(usuario.email);

                    if (usuarioDatos) {
                        guardarStorage("usuario", usuarioDatos);
                        Alert.alert("Éxito", "El usuario a sido actualizado");
                        router.push('mi-perfil');
                    } else {
                        Alert.alert("Error", "No se pudo actualizar");
                    }

                } catch (error) {
                    Alert.alert("Error", "Ocurrió un error inesperado");
                    console.error(error);
                }
            } else {
                Alert.alert(
                    "Campos incompletos",
                    "Por favor, completa todos los campos obligatorios antes de guardar.",
                    [{ text: "OK" }]
                );
            }
        }

        setIsLoading(false);
    };

    //PIDE PERMISOS PARA USAR CAMARA Y ALMACENAMIENTO
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permisos necesarios', 'Necesitamos permiso para usar la cámara y galería');
            }
        })();
    }, []);

    //CARGA USUARIO DESDE EL STORAGE
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

    //CARGA DIRECCION DESDE EL STORAGE
    useFocusEffect(
        useCallback(() => {
            const cargarDireccion = async () => {
                try {
                    const datos = await recuperarStorage('direccion');
                    if (datos) {
                        setDireccion(datos);
                    }
                } catch (error) {
                    console.log('Error al cargar usuario:', error);
                }
            };
            cargarDireccion();
        }, [])
    )

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true}
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                {/* Header con título */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                </View>

                {/* Sección de Foto de Perfil */}
                {usuario && (
                    <View style={styles.profileSection}>
                        <TouchableOpacity style={styles.avatarContainer} onPress={() => setModalFotoVisible(true)}>
                            <Image
                                source={
                                    nuevaFoto
                                        ? { uri: nuevaFoto }
                                        : usuario?.foto
                                            ? { uri: `${BUCKET_URL}foto-perfil/${usuario.foto}?t=${new Date().getTime()} ` }
                                            : imgPerfil
                                }
                                style={styles.avatar}
                            />
                            <View style={styles.avatarOverlay}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.avatarText}>Toca para cambiar foto</Text>
                    </View>
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
                            <Text style={styles.label}>Apellido</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={"Ingresa tu apellido"}
                                value={usuario.apellido}
                                onChangeText={(text) =>
                                    setUsuario((prev) => prev ? { ...prev, apellido: text } : prev)
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
                            <TouchableOpacity style={styles.input} onPress={toDireccion}>
                                <Text style={!direccion?.descripcion ? (styles.inputTextPlaceHolder) : (styles.inputText)}>{direccion?.descripcion ?? "direccion"}</Text>
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
                            onChangeText={(text) =>
                                setUsuario((prev) => prev ? { ...prev, descripcion: text } : prev)
                            }
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

                {/* Indicador de Carga */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8BC34A" />
                        <Text style={styles.loadingText}>Guardando cambios...</Text>
                    </View>
                )}

                {/* Botones de Guardar y Cancelar */}
                {!isLoading && (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/(perfil_usuario)/mi-perfil')}>
                            <Ionicons name="close-circle-outline" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={guardarUsuario}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>

            {/* MODAL FOTO */}
            <Modal
                visible={modalFotoVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalFotoVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cambiar Foto de Perfil</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={seleccionarFoto}>
                                <Ionicons name="images-outline" size={24} color="#8BC34A" />
                                <Text style={styles.modalButtonText}>Galería</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={tomarFoto}>
                                <Ionicons name="camera-outline" size={24} color="#8BC34A" />
                                <Text style={styles.modalButtonText}>Cámara</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setModalFotoVisible(false)}
                        >
                            <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
        backgroundColor: "#F8F9FA"
    },
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginLeft: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    avatarContainer: {
        alignSelf: 'center',
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#8BC34A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#8BC34A',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    inputTextPlaceHolder: {
        fontSize: 16,
        color: '#999',
    },

    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 10,
        gap:10,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8BC34A',
        padding: 16,
        borderRadius: 12,
        justifyContent: 'center',
        flex: 1,
        marginRight: 10,
        shadowColor: '#8BC34A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        padding: 16,
        borderRadius: 12,
        justifyContent: 'center',
        flex: 1,
        marginLeft: 10,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        justifyContent: 'center',
        flex: 1,
        marginRight: 10,
        shadowColor: '#8BC34A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalButtonText: {
        color: '#8BC34A',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    modalCancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignSelf: 'center', // Centra el botón dentro del modal
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalCancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    header: {
        alignItems: 'center',
        padding: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
