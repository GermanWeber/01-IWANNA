import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [contrasenaVal, setContrasenaVal] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Animaciones
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const validarCorreo = (correo: string) => {
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(correoRegex.test(correo));
        return correoRegex.test(correo);
    };

    const validarContrasena = (password: string) => {
        const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsValidPassword(contrasenaRegex.test(password));
        return contrasenaRegex.test(password);
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

    const handleRegister = async () => {
        if (!usuario || !contrasena || !contrasenaVal) {
            shake();
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        if (!validarCorreo(usuario)) {
            shake();
            Alert.alert('Error', 'El usuario debe ser un correo válido.');
            return;
        }

        if (!validarContrasena(contrasena)) {
            shake();
            Alert.alert(
                'Error',
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.'
            );
            return;
        }

        if (contrasena !== contrasenaVal) {
            shake();
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, usuario, contrasena);
            Alert.alert('Registro exitoso', `Usuario: ${usuario}`);
            router.push('(tabs)');
        } catch (error: any) {
            let errorMessage = 'Error al registrar usuario';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'El correo electrónico ya está en uso';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña es demasiado débil';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El correo electrónico no es válido';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.contentContainer}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Image
                    source={require('../../assets/images/logo.jpg')}
                    style={styles.logo}
                />

                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Regístrate para comenzar a usar la aplicación</Text>

                <Animated.View 
                    style={[
                        styles.inputContainer,
                        !isValidEmail && usuario.length > 0 && styles.inputError,
                        { transform: [{ translateX: shakeAnim }] }
                    ]}
                >
                    <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={!isValidEmail && usuario.length > 0 ? '#FF3B30' : '#666'} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={usuario}
                        onChangeText={(text) => {
                            setUsuario(text);
                            validarCorreo(text);
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        accessibilityLabel="Correo electrónico"
                        accessibilityHint="Ingresa tu correo electrónico"
                    />
                </Animated.View>
                {!isValidEmail && usuario.length > 0 && (
                    <Text style={styles.errorText}>Por favor, ingresa un correo válido</Text>
                )}

                <Animated.View 
                    style={[
                        styles.inputContainer,
                        !isValidPassword && contrasena.length > 0 && styles.inputError,
                        { transform: [{ translateX: shakeAnim }] }
                    ]}
                >
                    <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={!isValidPassword && contrasena.length > 0 ? '#FF3B30' : '#666'} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={contrasena}
                        onChangeText={(text) => {
                            setContrasena(text);
                            validarContrasena(text);
                        }}
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
                </Animated.View>
                {!isValidPassword && contrasena.length > 0 && (
                    <Text style={styles.errorText}>
                        La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo
                    </Text>
                )}

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar Contraseña"
                        value={contrasenaVal}
                        onChangeText={setContrasenaVal}
                        secureTextEntry={!showConfirmPassword}
                        accessibilityLabel="Confirmar contraseña"
                        accessibilityHint="Confirma tu contraseña"
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

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity 
                        onPress={handleRegister} 
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={[
                            styles.registerButton,
                            isLoading && styles.registerButtonDisabled
                        ]}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Ionicons name="sync" size={24} color="#fff" style={styles.loadingIcon} />
                        ) : (
                            <Text style={styles.registerButtonText}>Registrarse</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Text style={styles.loginLink}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
        paddingHorizontal: 20,
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
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#8BC34A',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loadingIcon: {
        transform: [{ rotate: '0deg' }],
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loginText: {
        color: '#666',
    },
    loginLink: {
        color: '#8BC34A',
        fontWeight: 'bold',
    },
});

export default Register;