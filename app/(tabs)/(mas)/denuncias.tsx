import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Card, RadioButton, HelperText } from 'react-native-paper';

export default function Denuncias() {
    const [tipoDenuncia, setTipoDenuncia] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');

    const tiposDenuncia = [
        'Comportamiento inapropiado',
        'Servicio de baja calidad',
        'Información falsa',
        'Acoso o discriminación',
        'Otro'
    ];

    const validarFormulario = () => {
        if (!tipoDenuncia) {
            setError('Por favor, selecciona un tipo de denuncia');
            return false;
        }
        if (!descripcion.trim()) {
            setError('Por favor, describe el problema');
            return false;
        }
        setError('');
        return true;
    };

    const enviarDenuncia = () => {
        if (validarFormulario()) {
            // Aquí iría la lógica para enviar la denuncia
            Alert.alert(
                'Denuncia Enviada',
                'Gracias por tu reporte. Nuestro equipo revisará la situación y te contactará si necesitamos más información.',
                [{ text: 'OK' }]
            );
            // Limpiar formulario
            setTipoDenuncia('');
            setDescripcion('');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.titulo}>Enviar Denuncia</Text>
                            <Text style={styles.subtitulo}>
                                Selecciona el tipo de denuncia y describe el problema
                            </Text>

                            <Text style={styles.label}>Tipo de Denuncia</Text>
                            <RadioButton.Group onValueChange={value => setTipoDenuncia(value)} value={tipoDenuncia}>
                                {tiposDenuncia.map((tipo, index) => (
                                    <View key={index} style={styles.radioOption}>
                                        <RadioButton value={tipo} color="#84AE46" />
                                        <Text style={styles.radioLabel}>{tipo}</Text>
                                    </View>
                                ))}
                            </RadioButton.Group>

                            <Text style={styles.label}>Descripción del Problema</Text>
                            <TextInput
                                style={styles.textArea}
                                value={descripcion}
                                onChangeText={setDescripcion}
                                placeholder="Describe el problema en detalle..."
                                multiline
                                numberOfLines={4}
                            />

                            {error ? <HelperText type="error">{error}</HelperText> : null}

                            <Button
                                mode="contained"
                                onPress={enviarDenuncia}
                                style={styles.button}
                                labelStyle={styles.buttonLabel}
                            >
                                Enviar Denuncia
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.infoCard}>
                        <Card.Content>
                            <Text style={styles.infoTitulo}>Información Importante</Text>
                            <Text style={styles.infoTexto}>
                                • Todas las denuncias son revisadas por nuestro equipo.{'\n'}
                                • Mantenemos la confidencialidad de tu información.{'\n'}
                                • Te contactaremos si necesitamos más detalles.{'\n'}
                                • Procesamos las denuncias en un plazo máximo de 48 horas.
                            </Text>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        padding: 16,
    },
    container: {
        flex: 1,
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        elevation: 3,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    button: {
        marginTop: 24,
        backgroundColor: '#84AE46',
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 16,
        paddingVertical: 4,
    },
    infoCard: {
        marginTop: 16,
        borderRadius: 10,
        elevation: 3,
    },
    infoTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoTexto: {
        fontSize: 14,
        color: '#84AE46',
        lineHeight: 22,
    },
});