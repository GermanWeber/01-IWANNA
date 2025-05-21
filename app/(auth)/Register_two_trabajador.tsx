import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const Register_two_trabajador = () => {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rut, setRut] = useState('');
    const [sexo, setSexo] = useState<number | null>(null);
    const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const calcularEdad = (fecha: Date): number => {
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const mesActual = hoy.getMonth();
        const mesNacimiento = fecha.getMonth();
        
        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fecha.getDate())) {
            edad--;
        }
        
        return edad;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFechaNacimiento(selectedDate);
        }
    };

    const handleNext = async () => {
        // Validación de campos
        if (!nombre || !apellido || !telefono || sexo === null || !fechaNacimiento) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            const edadCalculada = calcularEdad(fechaNacimiento);
            
            // Guardar datos en AsyncStorage
            const datosUsuario = {
                nombre,
                apellido,
                telefono,
                rut,
                id_sexo: sexo,
                fecha_nacimiento: fechaNacimiento.toISOString(),
                edad: edadCalculada
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

                    <View style={styles.sexoContainer}>
                        <Text style={styles.sexoLabel}>Sexo:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={sexo}
                                onValueChange={(itemValue) => setSexo(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#666"
                            >
                                <Picker.Item label="Seleccione una opción" value={null} color="#666" />
                                <Picker.Item label="Masculino" value={1} />
                                <Picker.Item label="Femenino" value={2} />
                                <Picker.Item label="Prefiero no decirlo" value={3} />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TouchableOpacity 
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={[
                                styles.dateInputText,
                                !fechaNacimiento && styles.dateInputPlaceholder
                            ]}>
                                {fechaNacimiento 
                                    ? fechaNacimiento.toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Fecha de nacimiento'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {fechaNacimiento && (
                        <Text style={styles.edadText}>
                            Edad: {calcularEdad(fechaNacimiento)} años
                        </Text>
                    )}

                    {showDatePicker && (
                        <DateTimePicker
                            value={fechaNacimiento || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            minimumDate={new Date(1900, 0, 1)}
                        />
                    )}

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
    sexoContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    sexoLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: '#333',
    },
    dateInput: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    dateInputText: {
        color: '#333',
        fontSize: 16,
    },
    dateInputPlaceholder: {
        color: '#999',
    },
    edadText: {
        color: '#666',
        fontSize: 14,
        marginTop: -15,
        marginBottom: 5,
        marginLeft: 15,
    },
});

export default Register_two_trabajador;
