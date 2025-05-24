import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';

const Register_term_check = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!isChecked) {
            Alert.alert(
                'Términos y Condiciones',
                'Debes aceptar los términos y condiciones para continuar con el registro.'
            );
            return;
        }

        setIsLoading(true);
        try {
            await AsyncStorage.setItem('terminosAceptados', 'true');
            router.push('Register_one');
        } catch (error) {
            console.error('Error al guardar aceptación de términos:', error);
            Alert.alert('Error', 'No se pudo procesar tu aceptación');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewTerms = () => {
        router.push('Register_term');
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
                <Text style={styles.title}>Términos y Condiciones</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#8BC34A' : undefined}
                        style={styles.checkbox}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.checkboxText}>
                            He leído y acepto los{' '}
                            <Text 
                                style={styles.termsLink}
                                onPress={handleViewTerms}
                            >
                                términos y condiciones
                            </Text>
                        </Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[
                        styles.button,
                        (!isChecked || isLoading) && styles.buttonDisabled
                    ]}
                    onPress={handleContinue}
                    disabled={!isChecked || isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Procesando...' : 'Continuar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    checkbox: {
        marginRight: 10,
        width: 24,
        height: 24,
    },
    textContainer: {
        flex: 1,
    },
    checkboxText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    termsLink: {
        color: '#8BC34A',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#8BC34A',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Register_term_check;
