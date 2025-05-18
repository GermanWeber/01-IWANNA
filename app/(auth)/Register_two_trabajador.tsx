import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register_two_trabajador = () => {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [rut, setRut] = useState('');
    const [profesion, setProfesion] = useState('');
    const [experiencia, setExperiencia] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = async () => {
        // Validación de campos
        if (!nombre || !apellido || !telefono) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            // Guardar datos en AsyncStorage
            const datosUsuario = {
                nombre,
                apellido,
                telefono,
                direccion,
                rut,
                profesion,
                experiencia
            };
            
            await AsyncStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));
            
            // Obtener todos los datos almacenados
            const tipoUsuario = await AsyncStorage.getItem('tipoUsuario');
            const datosGuardados = await AsyncStorage.getItem('datosUsuario');
            
            // Mostrar los datos en un alert
            Alert.alert(
                'Datos Almacenados',
                `Tipo de Usuario: ${tipoUsuario}\nDatos Personales: ${datosGuardados}`,
                [
                    {
                        text: 'Continuar',
                        onPress: () => router.push('Register_three')
                    }
                ]
            );
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            Alert.alert('Error', 'Hubo un error al guardar los datos');
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
                    <Text style={styles.title}>Datos Personales</Text>
                </View>

                <Text style={styles.subtitle}>Por favor, completa tus datos personales y profesionales</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido"
                            value={apellido}
                            onChangeText={setApellido}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Teléfono"
                            value={telefono}
                            onChangeText={setTelefono}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección"
                            value={direccion}
                            onChangeText={setDireccion}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="RUT"
                            value={rut}
                            onChangeText={setRut}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Profesión"
                            value={profesion}
                            onChangeText={setProfesion}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Años de experiencia"
                            value={experiencia}
                            onChangeText={setExperiencia}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={handleNext}
                    disabled={isLoading}
                >
                    <Text style={styles.nextButtonText}>Siguiente</Text>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
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
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 20,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
});

export default Register_two_trabajador;
