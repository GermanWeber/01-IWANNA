import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { crearUsuarioStripe } from '../../services/paymentService';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const Register_three = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [datosUsuario, setDatosUsuario] = useState<any>(null);

    useEffect(() => {
        const cargarDatosUsuario = async () => {
            try {
                const datos = await AsyncStorage.getItem('datosUsuario');
                if (datos) {
                    setDatosUsuario(JSON.parse(datos));
                }
            } catch (error) {
                console.error('Error al cargar datos del usuario:', error);
            }
        };
        cargarDatosUsuario();
    }, []);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(email));
    };

    const handleRegister = async () => {
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
    
        setIsLoading(true);
        try {
            // 1. Crear usuario en Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
            const user = userCredential.user;
    
            // 2. Obtener datos almacenados
            const tipoUsuario = await AsyncStorage.getItem('tipoUsuario');
            const datosGuardados = await AsyncStorage.getItem('datosUsuario');
            const datosUsuario = datosGuardados ? JSON.parse(datosGuardados) : {};
    
            // 3. Preparar datos para la base de datos
            const usuarioData = {
                nombre: datosUsuario.nombre || 'Usuario',
                apellido: datosUsuario.apellido || 'Usuario',
                email: correo,
                telefono: datosUsuario.telefono || '123456789',
                rut: datosUsuario.rut || '12345678-9',
                edad: datosUsuario.edad || 18,
                id_sexo: datosUsuario.sexo || 1,
                descripcion: datosUsuario.profesion || 'Sin descripción',
                id_profesion: datosUsuario.profesion ? 1 : null,
                id_estado: 1,
                id_tipo: parseInt(tipoUsuario || '1'),
                foto: '',
                id_comuna: 1
            };
    
            // 4. Crear usuario en la base de datos
            const response = await fetch(`${API_URL}usuarios/create-user-prueba`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioData)
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                throw new Error(responseData.error || 'Error al crear usuario en la base de datos');
            }
    
            // 5. Limpiar datos temporales
            await AsyncStorage.removeItem('datosUsuario');
            await AsyncStorage.removeItem('tipoUsuario');
    
            // 6. Guardar el token de Firebase
            const token = await user.getIdToken();
            await AsyncStorage.setItem('userToken', token);
    
            Alert.alert(
                'Registro exitoso',
                'Tu cuenta ha sido creada correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/')
                    }
                ]
            );
    
        } catch (error: any) {
            console.error('Error en el registro:', error);
            let errorMessage = 'Error al crear la cuenta';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este correo electrónico ya está registrado';
            } else if (error.message.includes('Error al crear usuario')) {
                errorMessage = 'Error al registrar en la base de datos';
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                    disabled={isLoading}
                >
                    <Text style={styles.registerButtonText}>{isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}</Text>
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
