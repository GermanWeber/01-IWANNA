import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from "../../../components/rating-stars";
import { recuperarStorage } from "../../../services/asyncStorage";

export default function PerfilUsuario() {
    const { idUsuario } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const handleCotizar = async () => {
        try {
            setIsLoading(true);
            const usuario = await recuperarStorage('usuario');
            
            if (!usuario) {
                Alert.alert(
                    "No puedes cotizar :(",
                    "Debes estar registrado para realizar una cotización",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push('/(auth)')
                        }
                    ]
                );
                return;
            }

            // Si el usuario existe, procedemos con la cotización
            router.push('/(mas)/(cotizacion)/cotizacion-form');
        } catch (error) {
            console.error('Error al verificar usuario:', error);
            Alert.alert("Error", "Ocurrió un error al verificar tu sesión");
        } finally {
            setIsLoading(false);
        }
    };

    //Aqui deberiamos llamar a la api para recuperar los datos del usuario segun el ID
    const posts = [
        { id: 1, url: 'https://picsum.photos/600/600?random=1' },
        { id: 2, url: 'https://picsum.photos/600/600?random=2' },
        { id: 3, url: 'https://picsum.photos/600/600?random=3' },
        { id: 4, url: 'https://picsum.photos/600/600?random=4' },
        { id: 5, url: 'https://picsum.photos/600/600?random=5' },
        { id: 6, url: 'https://picsum.photos/600/600?random=6' },
    ]
    
    const usuario = {
        id: idUsuario,
        tipo_usuario: 1,
        img_perfil: "https://randomuser.me/api/portraits/men/25.jpg",
        nombre: "Manuel Perez",
        profesion: "Maestro parrillera",
        edad: "20 años",
        ubicacion: "Santiago, Chile",
        descripcion: "Maestro parrillero con más de 5 años de experiencia en eventos y restaurantes. Especializado en carnes premium y técnicas de cocción tradicionales. Comprometido con la calidad y la satisfacción del cliente.",
        correo: "manuel_perez@gmail.com",
        telefono: "+56 9 3452 5252",
        estadisticas: {
            servicios: "150+",
            satisfaccion: "98%",
            experiencia: "5+"
        },
        calificacion: 4.5,
    }
    
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {usuario && (
                <View style={styles.container}>
                    {/* Sección de Perfil */}
                    <View style={styles.profileHeader}>
                        <Image
                            source={{ uri: usuario.img_perfil }}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{usuario.nombre}</Text>
                            {usuario.tipo_usuario === 1 ? (
                                <Text style={styles.profileProfession}>{usuario.profesion}</Text>
                            ):(<Text style={styles.profileProfession}>Cliente</Text>)}
                            <View style={styles.ratingContainer}>
                                <RatingStars rating={usuario.calificacion} showValue />
                            </View>
                        </View>
                    </View>
                    {/* Boton de Cotizar */}
                    {usuario.tipo_usuario === 1 && (
                        <TouchableOpacity 
                            style={styles.cotizacionButton}
                            onPress={handleCotizar}
                            disabled={isLoading}
                        >
                            <Text style={styles.cotizacionButtonText}>
                                {isLoading ? 'Verificando...' : 'Cotizar'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {/* SOLO MUESTRA LA ID DEL USUARIO */}
                    {/* <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: '#f0f0f0',
                        borderRadius: 8,
                        marginVertical: 10
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#333',
                            fontWeight: 'bold'
                        }}>
                            ID: {usuario.id}
                        </Text>
                    </View> */}

                    {/* Sección de usuario Personales */}
                    <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-circle-outline" size={24} color="#8BC34A" />
                        <Text style={styles.sectionTitle}>Datos personales</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Edad:</Text>
                        <Text style={styles.infoValue}>{usuario.edad}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Ubicación:</Text>
                        <Text style={styles.infoValue}>{usuario.ubicacion}</Text>
                    </View>
                    </View>

                    {/* Sección de Descripción */}
                    <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                        <Text style={styles.sectionTitle}>Sobre Mí</Text>
                    </View>
                    <Text style={styles.description}>
                        {usuario.descripcion}
                    </Text>
                    </View>

                    {/* Sección de Contacto */}
                    <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="call-outline" size={24} color="#8BC34A" />
                        <Text style={styles.sectionTitle}>Contacto</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <Text style={styles.infoValue}>{usuario.correo}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="call-outline" size={20} color="#666" />
                        <Text style={styles.infoValue}>{usuario.telefono}</Text>
                    </View>
                    </View>


                    {/* Sección de Estadísticas */}
                    {usuario.tipo_usuario === 1 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="stats-chart-outline" size={24} color="#8BC34A" />
                                <Text style={styles.sectionTitle}>Estadísticas</Text>
                            </View>
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{usuario.estadisticas.servicios}</Text>
                                    <Text style={styles.statLabel}>Servicios</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{usuario.estadisticas.satisfaccion}</Text>
                                    <Text style={styles.statLabel}>Satisfacción</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{usuario.estadisticas.experiencia}</Text>
                                    <Text style={styles.statLabel}>Años Exp.</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    
                    {/* POSTS */}
                    {usuario.tipo_usuario === 1 && (
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
                </View>
            )}
        </ScrollView>
    ); 
};

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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#8BC34A',
    },
    profileInfo: {
        marginLeft: 20,
        flex: 1,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    profileProfession: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
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
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        width: 100,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
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
    postsContainer:{
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
    cotizacionButton: {
        backgroundColor: '#8BC34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    cotizacionButtonText: {
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
});
