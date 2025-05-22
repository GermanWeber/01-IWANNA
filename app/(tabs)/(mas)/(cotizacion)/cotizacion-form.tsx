import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
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
    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEstimada, setFechaEstimada] = useState('');
    const [direccion, setDireccion] = useState<InterfaceDireccion | null>(null);

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

    
    const handleSubmit = async () => {
        if (!asunto || !descripcion || !fechaEstimada || !direccion) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        const cotizacion: CotizacionRequest = {
            asunto,
            descripcion,
            direccion: direccion.descripcion
        };

        try {
            console.log('Enviando cotización:', cotizacion);
            const response = await createCotizacion(cotizacion);
            if (response) {
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
            }
        } catch (error) {
            console.error('Error al crear cotización:', error);
            Alert.alert('Error', 'No se pudo enviar la cotización. Por favor, intenta nuevamente.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Nueva Cotización</Text>
            </View>

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

                    {/* Fecha Estimada */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha Estimada</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            value={fechaEstimada}
                            onChangeText={setFechaEstimada}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Botón de Enviar */}
                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Enviar Cotización</Text>
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
