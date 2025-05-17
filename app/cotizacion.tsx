export const config = {
    headerShown: false, // Oculta el header predeterminado
};

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Asegúrate de instalar esta librería si no está incluida
import HeaderPrincipal from "../components/Header";
import { useNavigation } from "expo-router";

const CotizacionForm = () => {
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Verificar si los campos están vacíos
    const isButtonDisabled = region === "" || comuna === "" || descripcion.trim() === "";

    return (
        <View>
            <View>
                <HeaderPrincipal />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Formulario de Cotización</Text>

                <Text style={styles.label}>Región</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={region}
                        onValueChange={(itemValue: string) => setRegion(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecciona una región" value="" />
                        <Picker.Item label="Región Metropolitana" value="metropolitana" />
                        <Picker.Item label="Región de Los Lagos" value="los_lagos" />
                        <Picker.Item label="Región de Valparaíso" value="valparaiso" />
                        <Picker.Item label="Región del Biobío" value="biobio" />
                    </Picker>
                </View>

                <Text style={styles.label}>Comuna</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={comuna}
                        onValueChange={(itemValue: string) => setComuna(itemValue)}
                        style={styles.picker}
                        enabled={region !== ""}
                    >
                        <Picker.Item label="Selecciona una comuna" value="" />
                        <Picker.Item label="Santiago" value="santiago" />
                        <Picker.Item label="Puerto Montt" value="puerto_montt" />
                        <Picker.Item label="Valparaíso" value="valparaiso" />
                        <Picker.Item label="Concepción" value="concepcion" />
                    </Picker>
                </View>

                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descripción del trabajo"
                    placeholderTextColor="#888"
                    multiline={true}
                    numberOfLines={4}
                    value={descripcion}
                    onChangeText={setDescripcion}
                />

                <Pressable
                    style={[
                        styles.button,
                        isButtonDisabled && styles.buttonDisabled, // Aplica estilo deshabilitado
                    ]}
                    disabled={isButtonDisabled} // Deshabilita el botón si los campos están vacíos
                    onPress={() => {
                        console.log("Formulario enviado:", { region, comuna, descripcion });
                        alert("Formulario enviado correctamente");
                    }}
                >
                    <Text style={styles.buttonText}>Enviar</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonDisabled: {
        backgroundColor: "#ccc", // Cambia el color del botón cuando está deshabilitado
    },
    button: {
        backgroundColor: "#00BCD4",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff", // Fondo claro
    },
    title: {
        fontSize: 24,
        fontWeight: "400",
        marginBottom: 20,
        textAlign: "center",
        color: "#333", // Color del texto
    },
    label: {
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 5,
        color: "#333",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: "#fff", // Fondo blanco
        fontSize: 16,
        color: "#333", // Color del texto
    },
    textArea: {
        height: 200,
        textAlignVertical: "top", // Asegura que el texto comience desde la parte superior
    },
    pickerContainer: {
        fontWeight: "400",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 45,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    picker: {
        height: 50,
        width: "100%",
        borderRadius: 45,
    },

});

export default CotizacionForm;