import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image, SafeAreaView, TouchableOpacity, Platform, Button } from 'react-native';
import BotonCategorias from '../../../components/BotonCategorias';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from '../../../components/rating-stars';

const imgPerfil = require('../../../assets/images/perfil.png');

export default function Mas() {
    const router = useRouter();
    const averageRating = 4;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {/* Sección de Perfil */}
                    <View style={styles.perfilContainer}>

                        <View style={styles.perfilContent}>
                            <Image
                                source={imgPerfil}
                                style={styles.perfilImage}
                            />
                            <View style={styles.perfilInfo}>
                                <Text style={styles.perfilNombre}>Manuel Perez</Text>
                                <Text style={styles.perfilPlan}>Plan: Free</Text>
                                <TouchableOpacity
                                    style={styles.verPerfilButton}
                                    onPress={() => router.push('/(mas)/(perfil_usuario)')}
                                >
                                    <Text style={styles.verPerfilText}>Ver mi perfil</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#8BC34A" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.verPerfilButton}
                                    onPress={() => router.push('/(mas)/mi-perfil-cliente')}
                                >
                                    <Text style={styles.verPerfilText}>Ver mi perfil cliente (test)</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#8BC34A" />
                                </TouchableOpacity>

                                <View>
                                    <RatingStars rating={Number(averageRating)} showValue />
                                </View>
                            </View>
                        </View>
                        {/* Sección boton autenticación */}
                        <View style={styles.authSection}>
                            <View>
                                <Text style={{ color: 'red' }}>No estas autentificado</Text>
                                <Text>Inicia el proceso y accede a los beneficios</Text>
                            </View>
                            <View style={styles.authButton}>
                                <Button 
                                title="IR"
                                color="#8BC34A"
                                onPress={() => router.push('/(mas)/(auth2)/auth2-info')}
                                />
                            </View>
                        </View>
                    </View>

                    
                    
                    

                    {/* Sección de Opciones */}

                    <View style={styles.opcionesContainer}>
                        <Text style={styles.seccionTitulo}>Mi Cuenta</Text>
                        <BotonCategorias
                            textoBoton="MENSAJES"
                            colorTexto="#333"
                            textoBotonSub="Revisa todos tus mensajes aquí"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="chatbubbles"
                            onPress={() => router.push('/(mas)/(mensajes)/mensajes')}
                        />
                        <BotonCategorias
                            textoBoton="MI PLAN"
                            colorTexto="#333"
                            textoBotonSub="Administra tu plan aquí"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="card"
                            onPress={() => router.push('/(mas)/mi-plan')}
                        />
                        <BotonCategorias
                            textoBoton="MIS POSTS"
                            colorTexto="#333"
                            textoBotonSub="Mira, edita y crea tus posts aquí"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="image"
                            onPress={() => router.push('/(mas)/(posts)/post')}
                        />
                        <BotonCategorias
                            textoBoton="COTIZACIONES"
                            colorTexto="#333"
                            textoBotonSub="Revisa tus cotizaciones entrantes aquí"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="cart"
                            onPress={() => router.push('/(mas)/(cotizacion)/cotizacion')}
                        />
                        <BotonCategorias
                            textoBoton="MI AGENDA"
                            colorTexto="#333"
                            textoBotonSub="Revisa tu agenda de trabajo aquí"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="calendar"
                            onPress={() => router.push('/(mas)/agenda')}
                        />
                    </View>

                    {/* Sección de Información */}
                    <View style={styles.opcionesContainer}>
                        <Text style={styles.seccionTitulo}>Información</Text>
                        <BotonCategorias
                            textoBoton="QUIENES SOMOS"
                            colorTexto="#333"
                            textoBotonSub="Revisa nuestras políticas y condiciones de uso"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="briefcase"
                            onPress={() => router.push('/(mas)/quienes-somos')}
                        />
                        <BotonCategorias
                            textoBoton="PREGUNTAS FRECUENTES"
                            colorTexto="#333"
                            textoBotonSub="Encuentra respuestas a tus dudas"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="help"
                            onPress={() => router.push('/(mas)/preguntas-frecuentes')}
                        />
                        <BotonCategorias
                            textoBoton="DENUNCIAS"
                            colorTexto="#333"
                            textoBotonSub="Reporta contenidos sospechosos o malintencionados"
                            colorTextoSub="#666"
                            bgColor="#F5F5F5"
                            iconoDerecha="chevron-forward"
                            colorIconoDerecha="#8BC34A"
                            colorIconoIzquierda="#8BC34A"
                            iconoIzquierda="eye"
                            onPress={() => router.push('/(mas)/denuncias')}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 30,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    perfilContainer: {
        padding: 20,
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    perfilContent: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
        borderRadius: 10,
        padding: 15,
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        alignItems: 'center',
    },
    perfilImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#8BC34A',
    },
    perfilInfo: {
        marginLeft: 15,
        flex: 1,
    },
    perfilNombre: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    perfilPlan: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    verPerfilButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    verPerfilText: {
        color: '#8BC34A',
        fontWeight: '600',
        marginRight: 5,
    },
    opcionesContainer: {
        padding: 20,
        marginTop: 20,
    },
    seccionTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginLeft: 5,
    },
    authSection: {
        justifyContent: 'center',
        gap: 20,
        flexDirection: 'row',
        marginVertical: 20,      
    },
    authButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
});
