import React, { useState, useRef } from 'react';
import { Pressable, View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@env';

// LOGIN 
const Login = () => {
    
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Animaciones
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('Pantalla de Login renderizada');
    }, []);

    // En tu componente Login, agrega esta función simple:
const obtenerUsuario = async (email: string) => {
    try {
        const url = `${API_URL}usuarios/${email}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener usuario');
        }

        // Guardar datos simples en AsyncStorage
        await AsyncStorage.setItem('usuario', JSON.stringify(data));
        console.log('Datos guardados en AsyncStorage:', data); // Log para verificar datos guardados

        // Verificar que los datos se guardaron correctamente
        const storedData = await AsyncStorage.getItem('usuario');
        console.log('Datos recuperados de AsyncStorage:', storedData); // Log para verificar datos recuperados

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(email));
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    };

    const handleLogin = async () => {
        if (!email || !contrasena) {
            shake();
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        if (!isValidEmail) {
            shake();
            Alert.alert('Error', 'Por favor, ingresa un correo válido');
            return;
        }

        setIsLoading(true);
        try {
            // Autenticación con Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, contrasena);
            const user = userCredential.user;

            // Obtener token de Firebase
            const token = await user.getIdToken();
            await AsyncStorage.setItem('userToken', token);

             // 3. Obtener datos básicos del usuario
            const userData = await obtenerUsuario(email);
            console.log('Datos del usuario:', userData);

            router.push('(tabs)');
        } catch (error: any) {
            console.log('Error de Firebase:', error.code); // Para debugging
            let errorMessage = 'Email o contraseña incorrectos';
            
            // Solo validamos el formato del email
            if (!isValidEmail) {
                errorMessage = 'Por favor, ingresa un correo válido';
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToRegister = () => {
        router.push('Register_one');
    };

    const handleGoToRecover = () => {
        router.push('Recover');
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.contentContainer}>
                <Image
                    source={require('../../assets/images/icons/logo-sin-fondo-manusc.png')}
                    style={styles.logo}
                />

                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                <Animated.View 
                    style={[
                        styles.inputContainer,
                        !isValidEmail && email.length > 0 && styles.inputError,
                        { transform: [{ translateX: shakeAnim }] }
                    ]}
                >
                    <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={!isValidEmail && email.length > 0 ? '#FF3B30' : '#666'} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            validateEmail(text);
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        accessibilityLabel="Correo electrónico"
                        accessibilityHint="Ingresa tu correo electrónico"
                    />
                </Animated.View>
                {!isValidEmail && email.length > 0 && (
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
                        accessibilityLabel="Contraseña"
                        accessibilityHint="Ingresa tu contraseña"
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

                <TouchableOpacity 
                    onPress={handleGoToRecover} 
                    style={styles.forgotPassword}
                >
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity 
                        onPress={handleLogin} 
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={[
                            styles.loginButton,
                            isLoading && styles.loginButtonDisabled
                        ]}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Ionicons name="sync" size={24} color="#fff" style={styles.loadingIcon} />
                        ) : (
                            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                    <TouchableOpacity onPress={handleGoToRegister}>
                        <Text style={styles.registerLink}>Regístrate</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={() => router.push('(tabs)/(inicio)')}
                >
                    <Text style={styles.skipButtonText}>Continuar sin registrarme</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
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
        alignSelf: 'flex-start',
        marginBottom: 10,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#666',
        fontSize: 14,
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#8BC34A',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loadingIcon: {
        transform: [{ rotate: '0deg' }],
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    registerText: {
        color: '#666',
    },
    registerLink: {
        color: '#8BC34A',
        fontWeight: 'bold',
    },
    skipButton: {
        marginTop: 20,
        padding: 10,
    },
    skipButtonText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default Login;