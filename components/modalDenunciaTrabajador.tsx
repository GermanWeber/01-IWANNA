import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Card, RadioButton, HelperText } from 'react-native-paper';
import { denunciaTrabajador } from '../services/denunciaService';

export default function ModalDenuncia({ datos, usuario, onClose }: { datos: any, usuario: any, onClose: () => void }) {
    const [tipoDenuncia, setTipoDenuncia] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');
    // El estado del modal ahora se maneja desde el componente padre

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

    const enviarDenuncia = async (id_post:number, id_usuario:number, tipo_denuncia:string, detalle_denuncia:string) => {
        if (validarFormulario()) {
            // Aquí iría la lógica para enviar la denuncia
            console.log('Datos recibidos en enviarDenuncia:', id_post, id_usuario, tipo_denuncia, detalle_denuncia);
            const response = await denunciaTrabajador(id_post, id_usuario, tipo_denuncia, detalle_denuncia);
            console.log('Respuesta de la denuncia:', response);
            if (response?.exito) {
                Alert.alert(
                    'Denuncia Enviada',
                    'Gracias por tu reporte. Nuestro equipo revisará la situación y te contactará si necesitamos más información.',
                    [
                        { 
                            text: 'OK',
                            onPress: () => {
                                setTipoDenuncia('');
                                setDescripcion('');
                                onClose();
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Error',
                    'Hubo un error al enviar la denuncia. Por favor, intenta de nuevo.',
                    [{ text: 'OK' }]
                );
            }
            // Limpiar formulario
            
        }
    };

    return (
       
                
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
                                onPress={() => enviarDenuncia(datos.id, usuario.id, tipoDenuncia, descripcion)}
                                style={styles.button}
                                labelStyle={styles.buttonLabel}
                            >
                                Enviar Denuncia
                            </Button>
                        </Card.Content>
                    </Card>
                
    );
}

const styles = StyleSheet.create({
    
     
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
        padding: 16,
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