import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from '../../../../components/rating-stars';
import { router, useFocusEffect } from 'expo-router';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { useCallback, useEffect, useState } from 'react';
import { BUCKET_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerDatos } from '../../../../services/userService'


const imgPerfil = require('../../../../assets/images/perfil.png');

const obtenerFechaCreacion = (fechaCreacion: string): string => {
    try {
        const fecha = new Date(fechaCreacion);
        if (isNaN(fecha.getTime())) {
            return 'N/A';
        }

        // Restar 1 día
        const fechaAjustada = new Date(fecha.getTime() - (24 * 60 * 60 * 1000));

        // Formatear la fecha
        const dia = fechaAjustada.getDate().toString().padStart(2, '0');
        const mes = (fechaAjustada.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaAjustada.getFullYear();

        return `${dia}/${mes}/${año}`;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'N/A';
    }
};

export default function MiPerfil() {




    const posts = [
        { id: 1, url: 'https://picsum.photos/600/600?random=1' },
        { id: 2, url: 'https://picsum.photos/600/600?random=2' },
        { id: 3, url: 'https://picsum.photos/600/600?random=3' },
        { id: 4, url: 'https://picsum.photos/600/600?random=4' },
        { id: 5, url: 'https://picsum.photos/600/600?random=5' },
        { id: 6, url: 'https://picsum.photos/600/600?random=6' },
    ]

    const [usuario, setUsuario] = useState<any>(null);
    const [fotoPerfil, setFotoPerfil] = useState<any>(null);
    const [datosCompletos, setDatosCompletos] = useState<any>(null);


    useFocusEffect(
        useCallback(() => {
            const cargarUsuario = async () => {
                try {
                    const datos = await recuperarStorage('usuario');
                    console.log("datos: ", datos);
                    if (datos) {
                        setUsuario(datos);
                        const datosCompletos = await obtenerDatos(datos.id);
                        console.log("Datos completos:", datosCompletos);
                        console.log("Fecha creación:", datosCompletos?.fecha_creacion);
                        setDatosCompletos(datosCompletos);
                    }
                } catch (error) {
                    console.error('Error al cargar usuario:', error);
                }
            };

            cargarUsuario();
        }, []) // sin dependencias para que se ejecute siempre que el módulo gana foco
    );

    const cerrarSesion = async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('usuario');
                            await AsyncStorage.removeItem('stripeData');

                            router.replace('/(auth)');
                        } catch (error) {
                            console.error('Error al cerrar sesión:', error);
                            Alert.alert('Error', 'No se pudo cerrar la sesión');
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {usuario && (
                <View style={styles.container}>
                    {/* Sección de Perfil */}
                    <View style={styles.profileHeader}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={usuario.foto ? { uri: `${BUCKET_URL}foto-perfil/${usuario.foto}?t=${new Date().getTime()}` } : imgPerfil}
                                style={styles.profileImage}
                            />
                            {usuario.id_auth === 2 && (
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                </View>
                            )}
                        </View>
                        <View style={styles.profileInfo}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.profileName}>
                                    {usuario.nombre?.charAt(0).toUpperCase() + usuario.nombre?.slice(1).toLowerCase()} {usuario.apellido?.charAt(0).toUpperCase() + usuario.apellido?.slice(1).toLowerCase()}
                                </Text>
                                {usuario.id_auth === 2 && (
                                    <Ionicons name="checkmark-circle" size={20} color="#1d9bf0" style={styles.verifiedIcon} />
                                )}
                            </View>
                            <View style={styles.profileDetails}>
                            </View>
                            <View style={styles.profileStatus}>
                                {usuario.id_estado === 2 && (
                                    <View style={styles.premiumBadge}>
                                        <Ionicons name="diamond" size={14} color="#FFD700" />
                                        <Text style={styles.premiumText}>Plan Premium</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.ratingContainer}>
                                {/* {<RatingStars rating={usuario.calificacion} showValue />} */}
                            </View>
                        </View>
                    </View>

                    {/* Botón de Editar Perfil */}
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(perfil_usuario)/editar-perfil')}>
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>

                    {/* Sección de usuario Personales */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-circle-outline" size={24} color="#8BC34A" />
                            <Text style={styles.sectionTitle}>Datos personales</Text>
                        </View>
                        <View style={styles.infoList}>
                            <View style={styles.infoRow}>
                                <Ionicons name="calendar-outline" size={20} color="#8BC34A" />
                                <Text style={styles.infoLabel}>Edad:</Text>
                                <Text style={styles.infoValue}>{datosCompletos?.edad} años </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={20} color="#8BC34A" />
                                <Text style={styles.infoLabel}>Ubicación:</Text>
                                <Text style={styles.infoValue}>{datosCompletos?.direccion || 'Sin información'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="person-outline" size={20} color="#8BC34A" />
                                <Text style={styles.infoLabel}>Sexo:</Text>
                                <Text style={styles.infoValue}>{datosCompletos?.sexo || 'Sin información'}</Text>
                            </View>
                            {usuario.rut && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="card-outline" size={20} color="#8BC34A" />
                                    <Text style={styles.infoLabel}>RUT:</Text>
                                    <Text style={styles.infoValue}>{usuario.rut}</Text>
                                </View>
                            )}
                            {usuario.telefono && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="call-outline" size={20} color="#8BC34A" />
                                    <Text style={styles.infoLabel}>Teléfono:</Text>
                                    <Text style={styles.infoValue}>{usuario.telefono}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Sección de Descripción */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                            <Text style={styles.sectionTitle}>Sobre Mí</Text>
                        </View>
                        <Text style={styles.description}>
                            {datosCompletos?.descripcion_usuario || usuario?.descripcion || 'Sin información'}
                        </Text>
                    </View>

                    {/* Sección de Contacto */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="call-outline" size={24} color="#8BC34A" />
                            <Text style={styles.sectionTitle}>Contacto</Text>
                        </View>
                        <View style={styles.infoList}>
                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={20} color="#8BC34A" />
                                <Text style={styles.infoLabel}>Email:  <Text style={styles.infoValue}>{datosCompletos?.email || 'Sin información'}</Text></Text>

                            </View>
                        </View>
                    </View>

                    {/* Sección de Información de Cuenta */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="settings-outline" size={24} color="#8BC34A" />
                            <Text style={styles.sectionTitle}>Información de Cuenta</Text>
                        </View>
                        <View style={styles.infoList}>
                            <View style={styles.infoRow}>
                                <Ionicons name="person-circle-outline" size={20} color="#8BC34A" />
                                <Text style={styles.infoLabel}>Tipo de Usuario:</Text>
                                <Text style={styles.infoValue}>
                                    {datosCompletos?.tipo_usuario ||
                                        (usuario.id_tipo === 1 ? 'Administrador' :
                                            usuario.id_tipo === 2 ? 'Trabajador' :
                                                usuario.id_tipo === 3 ? 'Cliente' : 'Sin información')}
                                </Text>
                            </View>

                            {/* {datosCompletos?.tipo_usuario !== "Consumidor" && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#8BC34A" />
                                    <Text style={styles.infoLabel}>Estado de Cuenta:</Text>
                                    <Text style={styles.infoValue}>
                                        {datosCompletos?.estado_usuario ||
                                            (usuario.id_estado === 1 ? 'Activo' :
                                                usuario.id_estado === 2 ? 'Premium' :
                                                    usuario.id_estado === 3 ? 'Inactivo' : 'Sin información')}
                                    </Text>
                                </View>
                            )} */}

                            {datosCompletos?.tipo_usuario !== "Consumidor" && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#8BC34A" />
                                    <Text style={styles.infoLabel}>Estado suscripcion:</Text>
                                    <Text style={styles.infoValue}>
                                        {datosCompletos?.estado_usuario}
                                    </Text>
                                </View>
                            )}

                            {datosCompletos?.tipo_usuario !== "Consumidor" && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="briefcase-outline" size={20} color="#8BC34A" />
                                    <Text style={styles.infoLabel}>Profesión:</Text>
                                    <Text style={styles.infoValue}>{datosCompletos?.profesion || usuario?.profesion || 'Sin información'}</Text>
                                </View>
                            )}

                            <View style={styles.infoRow}>
                                <Ionicons name="calendar-outline" size={20} color="#8BC34A" />
                                <Text style={styles.infoLabel}>Fecha de Registro:</Text>
                                <Text style={styles.infoValue}>{datosCompletos?.fecha_creacion ? obtenerFechaCreacion(datosCompletos.fecha_creacion) : 'Sin información'}</Text>
                            </View>

                        </View>

                    </View>

                    {/* POSTS */}
                    {usuario.id_tipo === 1 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                                <Text style={styles.sectionTitle}>Publicaciones</Text>
                            </View>
                            <View style={styles.postsContainer}>
                                {posts.map(post => (
                                    <TouchableOpacity key={post.id} onPress={() => console.log('Post presionado:', post.id)} style={styles.post}>
                                        <Image
                                            source={{ uri: post.url }}
                                            style={styles.postImage}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Sección de Servicios Activos */}
                    {usuario.tipo_usuario === 2 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="time-outline" size={24} color="#8BC34A" />
                                <Text style={styles.sectionTitle}>Servicios Activos</Text>
                            </View>
                            <View style={styles.serviceList}>
                                <TouchableOpacity style={styles.serviceItem}>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceTitle}>Servicio de Parrillada</Text>
                                        <Text style={styles.serviceDate}>15 de Marzo, 2024</Text>
                                        <Text style={styles.serviceStatus}>En progreso</Text>
                                    </View>
                                    <View style={styles.serviceWorker}>
                                        <Image
                                            source={imgPerfil}
                                            style={styles.workerImage}
                                        />
                                        <Text style={styles.workerName}>Manuel Perez</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.serviceItem}>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceTitle}>Reparación de Plomería</Text>
                                        <Text style={styles.serviceDate}>20 de Marzo, 2024</Text>
                                        <Text style={styles.serviceStatus}>Programado</Text>
                                    </View>
                                    <View style={styles.serviceWorker}>
                                        <Image
                                            source={imgPerfil}
                                            style={styles.workerImage}
                                        />
                                        <Text style={styles.workerName}>Carlos López</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.viewAllButton}
                                onPress={() => router.push('/(mas)/historial-servicios')}
                            >
                                <Text style={styles.viewAllText}>Ver todo</Text>
                                <Ionicons name="chevron-forward" size={20} color="#8BC34A" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Sección de Historial de Servicios */}
                    {usuario.tipo_usuario === 2 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="list-outline" size={24} color="#8BC34A" />
                                <Text style={styles.sectionTitle}>Historial de Servicios</Text>
                            </View>
                            <View style={styles.serviceList}>
                                <TouchableOpacity style={styles.serviceItem}>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceTitle}>Limpieza de Hogar</Text>
                                        <Text style={styles.serviceDate}>10 de Marzo, 2024</Text>
                                        <Text style={[styles.serviceStatus, styles.completedStatus]}>Completado</Text>
                                    </View>
                                    <View style={styles.serviceWorker}>
                                        <Image
                                            source={imgPerfil}
                                            style={styles.workerImage}
                                        />
                                        <Text style={styles.workerName}>Ana Martínez</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.serviceItem}>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceTitle}>Instalación Eléctrica</Text>
                                        <Text style={styles.serviceDate}>5 de Marzo, 2024</Text>
                                        <Text style={[styles.serviceStatus, styles.completedStatus]}>Completado</Text>
                                    </View>
                                    <View style={styles.serviceWorker}>
                                        <Image
                                            source={imgPerfil}
                                            style={styles.workerImage}
                                        />
                                        <Text style={styles.workerName}>Roberto Silva</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.viewAllButton}
                                onPress={() => router.push('/(mas)/historial-servicios')}
                            >
                                <Text style={styles.viewAllText}>Ver todo</Text>
                                <Ionicons name="chevron-forward" size={20} color="#8BC34A" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Botón de Cerrar Sesión */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={cerrarSesion}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#fff" />
                        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        padding: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#8BC34A',
    },
    verifiedBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        padding: 2,
    },
    profileInfo: {
        marginLeft: 20,
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 5,
    },
    verifiedIcon: {
        marginLeft: 5,
    },
    profileDetails: {
        marginBottom: 10,
    },
    profileProfession: {
        fontSize: 16,
        color: '#666',
    },
    profileId: {
        fontSize: 14,
        color: '#666',
    },
    profileStatus: {
        marginBottom: 10,
    },
    premiumBadge: {
        backgroundColor: '#FFD700',
        borderRadius: 15,
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 5,
    },
    ratingContainer: {
        marginTop: 5,
    },
    section: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    infoList: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    infoLabel: {
        fontWeight: '600',
        color: '#7f8c8d',
        fontSize: 14,
        marginLeft: 8,
        marginRight: 8,
        minWidth: 120,
    },
    infoValue: {
        color: '#34495e',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8BC34A',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    postsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignSelf: 'stretch',
    },
    post: {
        width: '32%',
        height: 150,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    editButton: {
        backgroundColor: '#8BC34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,

    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    serviceList: {
        gap: 15,
    },
    serviceItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    serviceDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    serviceStatus: {
        fontSize: 14,
        color: '#FFA000',
        fontWeight: '500',
    },
    completedStatus: {
        color: '#4CAF50',
    },
    serviceWorker: {
        alignItems: 'center',
        marginLeft: 15,
    },
    workerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 5,
    },
    workerName: {
        fontSize: 12,
        color: '#666',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        padding: 10,
    },
    viewAllText: {
        color: '#8BC34A',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 30,
        marginHorizontal: 16,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
