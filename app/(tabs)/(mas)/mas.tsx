import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, SafeAreaView, TouchableOpacity, Platform, Button, Linking, Alert, AppState } from 'react-native';
import BotonCategorias from '../../../components/BotonCategorias';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from '../../../components/rating-stars';
import { recuperarStorage } from '../../../services/asyncStorage';
import { BUCKET_URL } from '@env';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { getAverageRating } from '../../../services/ratingService';

const imgPerfil = require('../../../assets/images/perfil.png');

export default function Mas() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    const [averageRating, setAverageRating] = useState<number>(0);

    // Función para capitalizar nombres
    const capitalizeName = (name: string) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    const loadUsuario = async () => {
        try {
            const usuarioData = await recuperarStorage('usuario');

            if (usuarioData) {
                setUsuario(usuarioData);
                console.log(usuarioData);


                // Cargar el promedio de rating del trabajador
                if (usuarioData.id_tipo === 2) { // Solo para trabajadores
                    try {
                        const ratingData = await getAverageRating(usuarioData.id);
                        setAverageRating(ratingData.promedio_estrellas);
                    } catch (error) {
                        setAverageRating(0);
                    }
                }
            }
        } catch (error) {
            // Error silencioso
        }
    };

    const handlePressCalendar = async () => {
        // Intentar abrir la app nativa de Google Calendar
        const calendarAppUrl = 'content://com.android.calendar/time/';
        const webUrl = 'https://calendar.google.com/calendar/u/0/r';

        try {
            // Primero intentamos abrir la app nativa
            const supported = await Linking.canOpenURL(calendarAppUrl);
            if (supported) {
                await Linking.openURL(calendarAppUrl);
            } else {
                // Si no se puede abrir la app nativa, intentamos con la web
                await Linking.openURL(webUrl);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir Google Calendar. Asegúrate de tener la aplicación instalada.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            const cargarUsuario = async () => {
            try {
                const datos = await recuperarStorage('usuario');
                console.log("datos: ", datos);
                if (datos) {
                setUsuario(datos);
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            }
            };

            cargarUsuario();
        }, []) // sin dependencias para que se ejecute siempre que el módulo gana foco
    );
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                loadUsuario();
            }
        });
        // Cargar datos iniciales
        loadUsuario();

        return () => {
            subscription.remove();
        };
    }, []);
    const pathname = usePathname();
    useEffect(() => {
        // Ruta actual disponible si es necesaria
    }, [pathname]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {/* Sección de Perfil */}
                    <View style={styles.perfilContainer}>
                        <View style={styles.perfilContent}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={usuario?.foto ? { uri: `${BUCKET_URL}foto-perfil/${usuario?.foto}?t=${new Date().getTime()}` } : imgPerfil}
                                    style={styles.perfilImage}
                                />
                                {usuario?.id_auth === 2 && (
                                    <View style={styles.verifiedBadge}>
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                    </View>
                                )}
                            </View>
                            <View style={styles.perfilInfo}>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.perfilNombre}>
                                        {capitalizeName(usuario?.nombre)} {capitalizeName(usuario?.apellido)}
                                    </Text>
                                    {usuario?.id_auth === 2 && (
                                        <Ionicons name="checkmark-circle" size={20} color="#1d9bf0" style={styles.verifiedIcon} />
                                    )}
                                </View>

                                <View style={styles.statusContainer}>
                                    {usuario?.id_estado == 2 && (
                                        <View style={styles.premiumBadge}>
                                            <Ionicons name="diamond" size={14} color="#FFD700" />
                                            <Text style={styles.premiumText}>Plan Premium</Text>
                                        </View>
                                    )}
                                </View>

                                {usuario?.id_tipo === 2 && (
                                    <View style={styles.ratingContainer}>
                                        <RatingStars rating={Number(averageRating)} showValue />
                                        <Text style={styles.ratingLabel}>Calificación promedio</Text>
                                    </View>
                                )}



                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.verPerfilButton}
                                        onPress={() => router.push('/(mas)/(perfil_usuario)')}
                                    >
                                        <Ionicons name="person-circle" size={18} color="#8BC34A" />
                                        <Text style={styles.verPerfilText}>Ver mi perfil</Text>
                                        <Ionicons name="chevron-forward" size={16} color="#8BC34A" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Sección boton autenticación */}
                        {usuario?.id_auth == 1 && usuario?.id_tipo == 2 && (
                            <View style={styles.authSection}>
                                <View style={styles.authContent}>
                                    <View style={styles.authInfo}>
                                        <View style={styles.authIconContainer}>
                                            <Ionicons name="shield-checkmark" size={20} color="#FF5252" />
                                        </View>
                                        <View style={styles.authTextContainer}>
                                            <Text style={styles.authTitle}>Verificación pendiente</Text>
                                            <Text style={styles.authSubtitle}>Completa tu autenticación</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.authButton}
                                        onPress={() => router.push('/(mas)/(auth2)/auth2-info')}
                                    >
                                        <Text style={styles.authButtonText}>Verificar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {usuario?.id_auth == 3 && usuario?.id_tipo == 2 && (
                            <View style={styles.authSection}>
                                <View style={styles.authContent}>
                                    <View style={styles.authInfo}>
                                        <View style={styles.authIconContainer}>
                                            <Ionicons name="checkmark-circle" size={20} color="#1d9bf0" />
                                        </View>
                                        <View style={styles.authTextContainer}>
                                            <Text style={styles.authTitle}>Formulario enviado</Text>
                                            <Text style={styles.authSubtitle}>Nuestro equipo se pondra en contacto contigo proximamente.</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
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

                        {usuario?.id_tipo === 3 && (
                            <BotonCategorias
                                textoBoton="MIS COTIZACIONES"
                                colorTexto="#333"
                                textoBotonSub="Revisa las cotizaciones que has enviado"
                                colorTextoSub="#666"
                                bgColor="#F5F5F5"
                                iconoDerecha="chevron-forward"
                                colorIconoDerecha="#8BC34A"
                                colorIconoIzquierda="#8BC34A"
                                iconoIzquierda="cart"
                                onPress={() => router.push('/(mas)/(cotizacion)/cotizacion-cliente')}
                            />
                        )}

                        {usuario?.id_tipo === 2 && (
                            usuario?.id_estado == 2 ? (
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
                            ) : (
                                <BotonCategorias
                                    textoBoton="VER PLANES"
                                    colorTexto="#333"
                                    textoBotonSub="Revisa los planes disponibles aquí"
                                    colorTextoSub="#666"
                                    bgColor="#F5F5F5"
                                    iconoDerecha="chevron-forward"
                                    colorIconoDerecha="#8BC34A"
                                    colorIconoIzquierda="#8BC34A"
                                    iconoIzquierda="card"
                                    onPress={() => router.push('/(mas)/planes')}
                                />
                            )
                        )}
                        {usuario?.id_tipo !== 3 && (
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
                                onPress={() => router.push('/(mas)/(posts)/mis-posts')}
                            />
                        )}
                        {usuario?.id_tipo !== 3 && (
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
                        )}

                        {usuario?.id_tipo === 2 && (
                            <BotonCategorias
                                textoBoton="GOOGLE CALENDAR"
                                colorTexto="#5F6368"
                                textoBotonSub="Lleva tu agenda de trabajo organizada con Google Calendar"
                                colorTextoSub="#5F6368"
                                bgColor="#FFFFFF"
                                iconoDerecha="open"
                                colorIconoDerecha="#4285F4"
                                colorIconoIzquierda="#4285F4"
                                iconoIzquierda="calendar"
                                onPress={() => handlePressCalendar()}

                            />
                        )}
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
                        {/* <BotonCategorias
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
                        /> */}
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
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    perfilContent: {
        alignSelf: 'center',
        width: '100%',
        marginTop: 10,
        borderRadius: 16,
        padding: 20,
        backgroundColor: '#f8f9fa',
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    imageContainer: {
        position: 'relative',
    },
    perfilImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#8BC34A',
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    verifiedBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#1d9bf0',
        borderRadius: 12,
        padding: 3,
        borderWidth: 2,
        borderColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    verifiedIcon: {
        position: 'absolute',
        top: 2,
        right: 2,
    },
    perfilInfo: {
        marginLeft: 15,
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    perfilNombre: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statusContainer: {
        marginBottom: 10,
    },
    premiumBadge: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    premiumText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#B8860B',
        marginLeft: 6,
    },
    ratingContainer: {
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    ratingLabel: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 4,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    verPerfilButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8BC34A',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    verPerfilText: {
        color: '#fff',
        fontWeight: '600',
        marginHorizontal: 6,
        fontSize: 14,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    testText: {
        color: '#6c757d',
        fontWeight: '500',
        marginLeft: 6,
        fontSize: 14,
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
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginTop: 15,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    authContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    authInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    authIconContainer: {
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        borderRadius: 8,
        padding: 6,
        marginRight: 12,
    },
    authTextContainer: {
        flex: 1,
    },
    authTitle: {
        color: '#495057',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 2,
    },
    authSubtitle: {
        color: '#6c757d',
        fontSize: 12,
    },
    authButton: {
        backgroundColor: '#FF5252',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    authButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 13,
    },
});
