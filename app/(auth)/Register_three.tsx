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

    // Estados para validación de contraseña
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

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

    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        setPasswordRequirements(requirements);
        return Object.values(requirements).every(req => req);
    };

    const isPasswordValid = () => {
        return Object.values(passwordRequirements).every(req => req);
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

        if (!isPasswordValid()) {
            Alert.alert('Error', 'La contraseña no cumple con los requisitos mínimos de seguridad');
            return;
        }

        if (contrasena !== confirmarContrasena) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Crear usuario en Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
            const user = userCredential.user;

            console.log(user.uid);

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
                descripcion: null,
                id_profesion: datosUsuario.id_profesion || null,
                id_estado: 1,
                id_tipo: parseInt(tipoUsuario || '1'),
                foto: '',
                id_comuna: 1,
                direccion: datosUsuario.direccion?.descripcion || null
            };

            // 4. Crear usuario en la base de datos
            const response = await fetch(`${API_URL}usuarios/create-user`, {
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

            // Obtener el ID del usuario recién creado
            const userId = responseData.userId;
            console.log('Usuario creado con ID:', userId);

            // 5. Crear usuario en Stripe
            await crearUsuarioStripe(userId, correo, `${usuarioData.nombre} ${usuarioData.apellido}`);


            // 6. Limpiar datos temporales
            await AsyncStorage.removeItem('datosUsuario');
            await AsyncStorage.removeItem('tipoUsuario');

            // 7. Guardar el token de Firebase
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
                            onChangeText={(text) => {
                                setContrasena(text);
                                validatePassword(text);
                            }}
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

                    {/* Requisitos de contraseña */}
                    {contrasena.length > 0 && (
                        <View style={styles.passwordRequirements}>
                            <Text style={styles.requirementsTitle}>Requisitos de seguridad:</Text>
                            <View style={styles.requirementItem}>
                                <Ionicons
                                    name={passwordRequirements.length ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={passwordRequirements.length ? "#4CAF50" : "#FF5722"}
                                />
                                <Text style={[styles.requirementText, { color: passwordRequirements.length ? "#4CAF50" : "#FF5722" }]}>
                                    Mínimo 8 caracteres
                                </Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <Ionicons
                                    name={passwordRequirements.uppercase ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={passwordRequirements.uppercase ? "#4CAF50" : "#FF5722"}
                                />
                                <Text style={[styles.requirementText, { color: passwordRequirements.uppercase ? "#4CAF50" : "#FF5722" }]}>
                                    Al menos una mayúscula
                                </Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <Ionicons
                                    name={passwordRequirements.lowercase ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={passwordRequirements.lowercase ? "#4CAF50" : "#FF5722"}
                                />
                                <Text style={[styles.requirementText, { color: passwordRequirements.lowercase ? "#4CAF50" : "#FF5722" }]}>
                                    Al menos una minúscula
                                </Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <Ionicons
                                    name={passwordRequirements.number ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={passwordRequirements.number ? "#4CAF50" : "#FF5722"}
                                />
                                <Text style={[styles.requirementText, { color: passwordRequirements.number ? "#4CAF50" : "#FF5722" }]}>
                                    Al menos un número
                                </Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <Ionicons
                                    name={passwordRequirements.special ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={passwordRequirements.special ? "#4CAF50" : "#FF5722"}
                                />
                                <Text style={[styles.requirementText, { color: passwordRequirements.special ? "#4CAF50" : "#FF5722" }]}>
                                    Al menos un carácter especial
                                </Text>
                            </View>
                        </View>
                    )}

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
    passwordRequirements: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    requirementsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    requirementText: {
        marginLeft: 5,
    },
});

export default Register_three;
