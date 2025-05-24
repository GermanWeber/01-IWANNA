import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { createCotizacion } from '../../../../services/cotizacionService';
import { CotizacionRequest, CotizacionResponse } from '../../../../types/cotizacion';

interface InterfaceDireccion {
    descripcion: string;
    latitud: number;
    longitud: number;
}

const CotizacionForm = () => {
    const router = useRouter();
    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [direccion, setDireccion] = useState<InterfaceDireccion | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const cargarDireccion = async () => {
        const direccionGuardada = await recuperarStorage("direccion_cotizacion");
        if (direccionGuardada) {
            setDireccion(direccionGuardada);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            cargarDireccion();
        }, [])
    );

    useEffect(() => {
        const obtenerIdUsuario = async () => {
            try {
                const usuario = await recuperarStorage('usuario');
                if (usuario) {
                    setIdUsuario(usuario.id);
                    console.log('ID del usuario obtenido:', usuario.id);
                } else {
                    Alert.alert('Error', 'No se pudo obtener la información del usuario');
                    router.back();
                }
            } catch (error) {
                console.error('Error al obtener ID del usuario:', error);
                Alert.alert('Error', 'Ocurrió un error al obtener la información del usuario');
                router.back();
            }
        };

        obtenerIdUsuario();
    }, []);

    const handleSubmit = async () => {
        if (!idUsuario) {
            Alert.alert('Error', 'No se pudo identificar al usuario');
            return;
        }

        if (!descripcion.trim() || !asunto.trim() || !direccion) {
            Alert.alert('Error', 'Por favor, completa todos los campos requeridos');
            return;
        }

        setIsLoading(true);
        try {
            const cotizacionData: CotizacionRequest = {
                asunto: asunto,
                descripcion: descripcion,
                direccion: direccion.descripcion,
                id_cliente: idUsuario
            };

            console.log('Enviando datos de cotización:', cotizacionData);

            const response = await createCotizacion(cotizacionData);
            console.log('Respuesta de la cotización:', response);
            
            Alert.alert(
                'Éxito',
                'Tu cotización ha sido enviada correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error al crear cotización:', error);
            Alert.alert('Error', 'No se pudo enviar la cotización');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={styles.scrollView}
                enableOnAndroid={true}
                extraScrollHeight={100}
            >
                <View style={styles.formContainer}>
                    {/* Asunto */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Asunto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="¿Qué servicio necesitas?"
                            value={asunto}
                            onChangeText={setAsunto}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Ubicación */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ubicación del Trabajo</Text>
                        <TouchableOpacity 
                            style={styles.locationButton}
                            onPress={() => router.push('/screens/direccion-cotizacion')}
                        >
                            <Ionicons name="location-outline" size={20} color="#4CAF50" />
                            <Text style={styles.locationText}>
                                {direccion ? direccion.descripcion : 'Seleccionar ubicación'}
                            </Text>
                        </TouchableOpacity>
                        {direccion && (
                            <View style={styles.selectedLocationContainer}>
                                <Text style={styles.selectedLocationText}>
                                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" /> Ubicación seleccionada
                                </Text>
                                <Text style={styles.locationDetails}>
                                    {direccion.descripcion}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Descripción */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descripción del Trabajo</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe en detalle el trabajo que necesitas..."
                            multiline
                            numberOfLines={4}
                            value={descripcion}
                            onChangeText={setDescripcion}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Botón de Enviar */}
                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'Enviando...' : 'Enviar Cotización'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    formContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    locationText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#8BC34A',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedLocationContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f9f0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    selectedLocationText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    locationDetails: {
        color: '#333',
        fontSize: 14,
    },
});

export default CotizacionForm;
