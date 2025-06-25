import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { recuperarStorage } from '../../services/asyncStorage';
import { API_URL } from '@env';

interface InterfaceDireccion {
    descripcion: string;
    latitud: number;
    longitud: number;
}

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
    const [direccion, setDireccion] = useState<InterfaceDireccion | null>(null);
    const [descripcion, setDescripcion] = useState('');
    const [profesiones, setProfesiones] = useState([]);
    const [showProfesiones, setShowProfesiones] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [profesionesFiltradas, setProfesionesFiltradas] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [idProfesionSeleccionada, setIdProfesionSeleccionada] = useState<number | null>(null);

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

    const obtenerProfesiones = async () => {
        try {
            const url = `${API_URL}category/profesiones`;
            console.log('Consultando profesiones en:', url);

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener profesiones');
            }

            console.log('Estructura de profesiones recibida:', JSON.stringify(data, null, 2));
            setProfesiones(data);
            setProfesionesFiltradas(data);
            setShowProfesiones(true);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudieron obtener las profesiones');
        }
    };

    const quitarTildes = (texto: string): string => {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filtrarProfesiones = (texto: string) => {
        setBusqueda(texto);
        if (texto) {
            const textoNormalizado = quitarTildes(texto.toLowerCase());
            const filtradas = profesiones.filter((profesion: any) =>
                quitarTildes(profesion.descripcion.toLowerCase()).includes(textoNormalizado)
            );
            setProfesionesFiltradas(filtradas);
        } else {
            setProfesionesFiltradas(profesiones);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFechaNacimiento(selectedDate);
        }
    };

    const toDireccion = () => {
        router.push('/screens/direccion-registrar');
    };

    useFocusEffect(
        React.useCallback(() => {
            const cargarDireccion = async () => {
                try {
                    const datos = await recuperarStorage('direccion_registrar');
                    if (datos) {
                        setDireccion(datos);
                        console.log("direccion recuperada 1: ", datos);
                    }
                } catch (error) {
                    console.error('Error al cargar dirección:', error);
                }
            };
            cargarDireccion();
        }, [])
    );

    // Función para validar RUT chileno
    const validarRut = (rutCompleto: string): boolean => {
        // Limpiar el RUT de puntos y guiones
        const rutLimpio = rutCompleto.replace(/\./g, '').replace(/-/g, '');

        // Verificar formato básico
        const formatoRut = /^\d{7,8}[0-9kK]$/;
        if (!formatoRut.test(rutLimpio)) {
            return false;
        }

        // Separar número y dígito verificador
        const numero = rutLimpio.slice(0, -1);
        const dv = rutLimpio.slice(-1).toUpperCase();

        // Calcular dígito verificador
        let suma = 0;
        let multiplicador = 2;

        for (let i = numero.length - 1; i >= 0; i--) {
            suma += parseInt(numero[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const resto = suma % 11;
        const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();

        return dv === dvCalculado;
    };

    // Función para formatear RUT mientras se escribe
    const formatearRut = (texto: string): string => {
        // Remover todo excepto números y 'k'
        const rutLimpio = texto.replace(/[^0-9kK]/g, '');

        if (rutLimpio.length === 0) return '';

        // Separar número y dígito verificador
        const numero = rutLimpio.slice(0, -1);
        const dv = rutLimpio.slice(-1).toUpperCase();

        // Formatear número con puntos
        let numeroFormateado = '';
        for (let i = numero.length - 1, j = 0; i >= 0; i--, j++) {
            if (j > 0 && j % 3 === 0) {
                numeroFormateado = '.' + numeroFormateado;
            }
            numeroFormateado = numero[i] + numeroFormateado;
        }

        return numeroFormateado + '-' + dv;
    };

    const handleRutChange = (texto: string) => {
        const rutFormateado = formatearRut(texto);
        setRut(rutFormateado);
    };

    const handleNext = async () => {
        // Validación de campos
        if (!nombre || !apellido || !telefono || sexo === null || !fechaNacimiento || !direccion || !idProfesionSeleccionada) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        // Validación específica del RUT
        if (!rut) {
            Alert.alert('Error', 'El RUT es obligatorio');
            return;
        }

        if (!validarRut(rut)) {
            Alert.alert('Error', 'El RUT ingresado no es válido. Debe tener el formato XX.XXX.XXX-X');
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
                sexo,
                fecha_nacimiento: fechaNacimiento.toISOString(),
                edad: edadCalculada,
                direccion: direccion,
                profesion: categoriaSeleccionada,
                id_profesion: idProfesionSeleccionada
            };

            console.log('Datos finales a guardar:', datosUsuario);
            await AsyncStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));

            // Obtener todos los datos almacenados
            const tipoUsuario = await AsyncStorage.getItem('tipoUsuario');
            const datosGuardados = await AsyncStorage.getItem('datosUsuario');

            // Mostrar los datos en un alert
            /*Alert.alert(
                'Datos Almacenados',
                `Tipo de Usuario: ${tipoUsuario}\nDatos Personales: ${datosGuardados}`,
                [
                    {
                        text: 'Continuar',
                        onPress: () => router.push('Register_three')
                    }
                ]
            );*/

            // Navegar directamente a Register_three
            router.push('Register_three');
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

                    <TouchableOpacity
                        style={styles.categoriaInput}
                        onPress={obtenerProfesiones}
                    >
                        <Ionicons name="search" size={20} color="#666" style={styles.inputIcon} />
                        <Text style={categoriaSeleccionada ? styles.categoriaText : styles.categoriaPlaceholder}>
                            {categoriaSeleccionada || "Selecciona tu profesión"}
                        </Text>
                    </TouchableOpacity>

                    {showProfesiones && (
                        <Modal
                            visible={showProfesiones}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setShowProfesiones(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Selecciona una profesión</Text>
                                        <TouchableOpacity onPress={() => setShowProfesiones(false)}>
                                            <Ionicons name="close" size={24} color="#333" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.searchContainer}>
                                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Buscar profesión..."
                                            value={busqueda}
                                            onChangeText={filtrarProfesiones}
                                            autoCapitalize="none"
                                        />
                                    </View>

                                    <ScrollView style={styles.profesionesList}>
                                        {profesionesFiltradas.map((profesion: any) => (
                                            <TouchableOpacity
                                                key={profesion.id}
                                                style={styles.profesionItem}
                                                onPress={() => {
                                                    console.log('Profesión seleccionada:', profesion);
                                                    setCategoriaSeleccionada(profesion.descripcion);
                                                    setDescripcion(profesion.descripcion);
                                                    setIdProfesionSeleccionada(profesion.id);
                                                    console.log('ID de profesión guardado:', profesion.id);
                                                    setShowProfesiones(false);
                                                    setBusqueda('');
                                                }}
                                            >
                                                <Text style={styles.profesionText}>{profesion.descripcion}</Text>
                                            </TouchableOpacity>
                                        ))}
                                        {profesionesFiltradas.length === 0 && (
                                            <Text style={styles.noResultsText}>No se encontraron resultados</Text>
                                        )}
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                    )}


                    <View style={styles.sexoContainer}>
                        <View style={styles.pickerContainer}>
                            <Ionicons name="male-female-outline" size={20} color="#666" style={styles.pickerIcon} />
                            <Picker
                                selectedValue={sexo}
                                onValueChange={(itemValue) => setSexo(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#666"
                            >
                                <Picker.Item label="Selecciona tu género" value={null} color="#666" />
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
                            accentColor="#4CAF50"
                            locale="es-ES"
                        />
                    )}

                    <View style={styles.inputContainer}>
                        <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="RUT (ej: 12.345.678-9)"
                            value={rut}
                            onChangeText={handleRutChange}
                            keyboardType="numeric"
                            maxLength={12}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TouchableOpacity style={styles.input} onPress={toDireccion}>
                            <Text style={!direccion?.descripcion ? styles.inputTextPlaceHolder : styles.inputText}>
                                {direccion?.descripcion ?? "Seleccionar dirección"}
                            </Text>
                        </TouchableOpacity>
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
        gap: 15,
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
        justifyContent: 'center',
    },
    categoriaInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
        height: 50,
    },
    categoriaText: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    categoriaPlaceholder: {
        flex: 1,
        color: '#999',
        fontSize: 16,
    },
    sexoContainer: {
        height: 50,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
        paddingHorizontal: 15,
        height: 50,
    },
    pickerIcon: {
        marginRight: 10,
    },
    picker: {
        flex: 1,
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
        marginTop: -10,
        marginBottom: 5,
        marginLeft: 15,
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#333',
    },
    profesionesList: {
        maxHeight: 400,
    },
    profesionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profesionText: {
        fontSize: 16,
        color: '#333',
    },
    noResultsText: {
        textAlign: 'center',
        color: '#666',
        padding: 20,
    },
    inputTextPlaceHolder: {
        fontSize: 16,
        color: '#999',
    },
    inputText: {
        color: '#333',
    },
});

export default Register_two_trabajador;
