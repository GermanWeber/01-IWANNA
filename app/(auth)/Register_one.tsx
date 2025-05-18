import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register_one = () => {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [tipoUsuario, setTipoUsuario] = useState<number>(0); // 0: no seleccionado, 1: cliente, 2: trabajador

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

    const handleClientePress = async () => {
        const tipo = 1;
        setTipoUsuario(tipo);
        try {
            await AsyncStorage.setItem('tipoUsuario', tipo.toString());
            router.push({
                pathname: 'Register_two_cliente',
                params: { tipoUsuario: tipo }
            });
            alert(`Has seleccionado el tipo de usuario: ${tipo}`);
        } catch (error) {
            console.error('Error al guardar el tipo de usuario:', error);
            alert('Error al guardar la selección');
        }
    };

    const handleTrabajadorPress = async () => {
        const tipo = 2;
        setTipoUsuario(tipo);
        try {
            await AsyncStorage.setItem('tipoUsuario', tipo.toString());
            router.push({
                pathname: 'Register_two_trabajador',
                params: { tipoUsuario: tipo }
            });
            alert(`Has seleccionado el tipo de usuario: ${tipo}`);
        } catch (error) {
            console.error('Error al guardar el tipo de usuario:', error);
            alert('Error al guardar la selección');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image
                    source={require('../../assets/images/logo.jpg')}
                    style={styles.logo}
                />
                
                <Text style={styles.title}>¿Cómo quieres registrarte?</Text>
                <Text style={styles.subtitle}>Selecciona el tipo de cuenta que deseas crear</Text>

                <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handleClientePress}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Ionicons name="person-outline" size={24} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Cliente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.trabajadorButton]}
                        onPress={handleTrabajadorPress}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Ionicons name="briefcase-outline" size={24} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Trabajador</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={styles.loginLink}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8BC34A',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    trabajadorButton: {
        backgroundColor: '#4CAF50',
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    loginText: {
        color: '#666',
    },
    loginLink: {
        color: '#8BC34A',
        fontWeight: 'bold',
    },
});

export default Register_one;
