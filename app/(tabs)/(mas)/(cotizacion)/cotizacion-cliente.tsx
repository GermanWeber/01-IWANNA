import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getCotizacionesId, createRespuestaCot, updateRespondido, getRespuestaId, getCotizacionesCli } from '../../../../services/cotizacionService';
import { recuperarStorage } from '../../../../services/asyncStorage';

type CotizacionCliente = {
    id_cotizacion: number;
    id_cliente: number;
    nombre: string;
    apellido: string;
    asunto: string;
    descripcion: string;
    direccion: string;
    direccion_cliente: string;
    f_creacion: string;
    id_estado: number;
    email: string;
    telefono: string;
    rut: string;
    edad: number;
};

export default function CotizacionCliente() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('pendientes');
    const [userId, setUserId] = useState<number | null>(null);
    const [cotizaciones, setCotizaciones] = useState<CotizacionCliente[]>([]);

    // Filtrar cotizaciones según la pestaña activa
    const filteredCotizaciones = cotizaciones.filter(cotizacion => {
        switch (activeTab) {
            case 'pendientes':
                return cotizacion.id_estado === 1;
            case 'respondidas':
                return cotizacion.id_estado === 2;
            case 'aceptadas':
                return cotizacion.id_estado === 4;
            case 'terminadas':
                return cotizacion.id_estado === 5;
            case 'rechazadas':
                return cotizacion.id_estado === 3;
            default:
                return true;
        }
    });

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const usuarioData = await recuperarStorage('usuario');
                if (usuarioData?.id) {
                    console.log('ID de usuario recuperado:', usuarioData.id);
                    setUserId(Number(usuarioData.id));

                    // Obtener cotizaciones del cliente
                    console.log('Consultando cotizaciones para el cliente:', usuarioData.id);
                    const cotizacionesData = await getCotizacionesCli(Number(usuarioData.id));
                    console.log('Cotizaciones recibidas:', cotizacionesData);
                    setCotizaciones(cotizacionesData);
                }
            } catch (error) {
                console.error('Error al recuperar el ID del usuario:', error);
            }
        };

        loadUserId();
    }, []);

    const getEstadoText = (id_estado: number) => {
        switch (id_estado) {
            case 1: return 'Pendiente';
            case 2: return 'Respondida';
            case 3: return 'Rechazada';
            case 4: return 'Aceptada';
            case 5: return 'Terminada';
            default: return 'Desconocido';
        }
    };

    const getEstadoColor = (id_estado: number) => {
        switch (id_estado) {
            case 1: return '#FFA000'; // Naranja para pendientes
            case 2: return '#2E7D32'; // Verde para respondidas
            case 3: return '#C62828'; // Rojo para rechazadas
            case 4: return '#1565C0'; // Azul para aceptadas
            case 5: return '#28A745'; // Verde para terminadas
            default: return '#666666';
        }
    };

    const getEstadoBackground = (id_estado: number) => {
        switch (id_estado) {
            case 1: return '#FFF3E0'; // Naranja claro para pendientes
            case 2: return '#E8F5E9'; // Verde claro para respondidas
            case 3: return '#FFEBEE'; // Rojo claro para rechazadas
            case 4: return '#E3F2FD'; // Azul claro para aceptadas
            case 5: return '#E8F5E9'; // Verde claro para terminadas
            default: return '#F5F5F5';
        }
    };

    const renderCotizacionCard = (cotizacion: CotizacionCliente) => (
        <TouchableOpacity
            key={cotizacion.id_cotizacion}
            style={styles.card}
            onPress={() => {
                console.log('Cotización seleccionada:', cotizacion);
                router.push({
                    pathname: '/(tabs)/(mas)/(cotizacion)/cotizacion-interior-cliente',
                    params: { id: cotizacion.id_cotizacion }
                });
            }}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <MaterialIcons name="person" size={24} color="#007AFF" />
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{cotizacion.nombre} {cotizacion.apellido}</Text>
                        <Text style={styles.date}>{new Date(cotizacion.f_creacion).toLocaleDateString()}</Text>
                    </View>
                </View>
                <View style={[
                    styles.estadoContainer,
                    { backgroundColor: getEstadoBackground(cotizacion.id_estado) }
                ]}>
                    <MaterialIcons
                        name={cotizacion.id_estado === 1 ? 'pending-actions' :
                            cotizacion.id_estado === 2 ? 'check-circle' :
                                cotizacion.id_estado === 4 ? 'assignment-turned-in' :
                                    cotizacion.id_estado === 5 ? 'task-alt' : 'cancel'}
                        size={16}
                        color={getEstadoColor(cotizacion.id_estado)}
                    />
                    <Text style={[
                        styles.estado,
                        { color: getEstadoColor(cotizacion.id_estado) }
                    ]}>
                        {getEstadoText(cotizacion.id_estado)}
                    </Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.motivoContainer}>
                    <MaterialIcons name="description" size={20} color="#666" />
                    <Text style={styles.motivo} numberOfLines={2}>{cotizacion.asunto}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>
                    Mis <Text style={styles.titleHighlight}>Cotizaciones</Text>
                </Text>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pendientes' && styles.activeTab]}
                    onPress={() => setActiveTab('pendientes')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="schedule"
                        size={24}
                        color={activeTab === 'pendientes' ? '#FFA000' : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'pendientes' && { color: '#FFA000', fontWeight: '600' }
                    ]}>
                        {cotizaciones.filter(c => c.id_estado === 1).length}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'respondidas' && styles.activeTab]}
                    onPress={() => setActiveTab('respondidas')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="check-circle"
                        size={24}
                        color={activeTab === 'respondidas' ? '#2E7D32' : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'respondidas' && { color: '#2E7D32', fontWeight: '600' }
                    ]}>
                        {cotizaciones.filter(c => c.id_estado === 2).length}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'aceptadas' && styles.activeTab]}
                    onPress={() => setActiveTab('aceptadas')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="assignment-turned-in"
                        size={24}
                        color={activeTab === 'aceptadas' ? '#1565C0' : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'aceptadas' && { color: '#1565C0', fontWeight: '600' }
                    ]}>
                        {cotizaciones.filter(c => c.id_estado === 4).length}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'terminadas' && styles.activeTab]}
                    onPress={() => setActiveTab('terminadas')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="task-alt"
                        size={24}
                        color={activeTab === 'terminadas' ? '#28A745' : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'terminadas' && { color: '#28A745', fontWeight: '600' }
                    ]}>
                        {cotizaciones.filter(c => c.id_estado === 5).length}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'rechazadas' && styles.activeTab]}
                    onPress={() => setActiveTab('rechazadas')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="cancel"
                        size={24}
                        color={activeTab === 'rechazadas' ? '#C62828' : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'rechazadas' && { color: '#C62828', fontWeight: '600' }
                    ]}>
                        {cotizaciones.filter(c => c.id_estado === 3).length}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filteredCotizaciones.length > 0 ? (
                    filteredCotizaciones.map(renderCotizacionCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="info" size={48} color="#ccc" />
                        <Text style={styles.emptyText}>
                            {activeTab === 'pendientes' ? 'No hay cotizaciones pendientes' :
                                activeTab === 'respondidas' ? 'No hay cotizaciones respondidas' :
                                    activeTab === 'aceptadas' ? 'No hay cotizaciones aceptadas' :
                                        activeTab === 'terminadas' ? 'No hay trabajos terminados' :
                                            'No hay cotizaciones rechazadas'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    titleHighlight: {
        color: '#007AFF',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginHorizontal: 2,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginLeft: 4,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    nameContainer: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    date: {
        fontSize: 11,
        color: '#666',
    },
    estadoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 6,
    },
    estado: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 3,
    },
    cardContent: {
        marginTop: 6,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 8,
    },
    motivoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    motivo: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
        flex: 1,
        lineHeight: 18,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
