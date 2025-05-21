import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Card, RadioButton, HelperText } from 'react-native-paper';

export default function Denuncias() {
    const [tipoDenuncia, setTipoDenuncia] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [email, setEmail] = useState('');
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
        if (!email.trim()) {
            setError('Por favor, ingresa tu correo electrónico');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido');
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
            setEmail('');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>Reportar un Problema</Text>
                    
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.subtitulo}>Tipo de Denuncia</Text>
                            <RadioButton.Group onValueChange={value => setTipoDenuncia(value)} value={tipoDenuncia}>
                                {tiposDenuncia.map((tipo, index) => (
                                    <View key={index} style={styles.radioOption}>
                                        <RadioButton.Item
                                            label={tipo}
                                            value={tipo}
                                            color="#84AE46"
                                        />
                                    </View>
                                ))}
                            </RadioButton.Group>

                            <Text style={styles.subtitulo}>Descripción del Problema</Text>
                            <TextInput
                                style={styles.textArea}
                                multiline
                                numberOfLines={4}
                                value={descripcion}
                                onChangeText={setDescripcion}
                                placeholder="Describe el problema en detalle..."
                                placeholderTextColor="#666"
                            />

                            <Text style={styles.subtitulo}>Correo Electrónico</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="tu@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
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
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        elevation: 3,
    },
    infoCard: {
        marginTop: 8,
        borderRadius: 10,
        elevation: 2,
        backgroundColor: '#eaf7db',
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    radioOption: {
        marginVertical: 4,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 24,
        backgroundColor: '#84AE46',
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#84AE46',
        marginBottom: 8,
    },
    infoTexto: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});