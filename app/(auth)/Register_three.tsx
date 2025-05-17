import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { crearUsuarioStripe } from '../../services/paymentService';

const Register_three = () => {
    
    const router = useRouter();
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(email));
    };

    const handleRegister = () => {
        if (!correo || !contrasena || !confirmarContrasena) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        if (!isValidEmail) {
            Alert.alert('Error', 'Por favor, ingresa un correo válido');
            return;
        }

        if (contrasena !== confirmarContrasena) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        if (contrasena.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }



        // Aquí iría la lógica de registro con Firebase
        // Por ahora solo redirigimos al login

        
        router.push('/');
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Crear Cuenta</Text>
                </View>

                <Text style={styles.subtitle}>Ingresa tu correo y contraseña</Text>

                <View style={styles.formContainer}>
                    <View style={[
                        styles.inputContainer,
                        !isValidEmail && correo.length > 0 && styles.inputError
                    ]}>
                        <Ionicons 
                            name="mail-outline" 
                            size={20} 
                            color={!isValidEmail && correo.length > 0 ? '#FF3B30' : '#666'} 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            value={correo}
                            onChangeText={(text) => {
                                setCorreo(text);
                                validateEmail(text);
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    {!isValidEmail && correo.length > 0 && (
                        <Text style={styles.errorText}>Por favor, ingresa un correo válido</Text>
                    )}

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={contrasena}
                            onChangeText={setContrasena}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons 
                                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                size={20} 
                                color="#666" 
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar contraseña"
                            value={confirmarContrasena}
                            onChangeText={setConfirmarContrasena}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons 
                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                size={20} 
                                color="#666" 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.registerButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    formContainer: {
        gap: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: -15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
    },
    eyeIcon: {
        padding: 10,
    },
    registerButton: {
        backgroundColor: '#8BC34A',
        padding: 15,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Register_three;
