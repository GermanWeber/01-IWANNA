import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { getCotizacionesId, createRespuestaCot, updateRespondido, getRespuestaId, getCotizacionesCli } from '../../../../services/cotizacionService';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { getRating } from '../../../../services/ratingService';

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
    isRated?: boolean; // Nuevo campo para indicar si está calificada
};

export default function CotizacionCliente() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('pendientes');
    const [userId, setUserId] = useState<number | null>(null);
    const [cotizaciones, setCotizaciones] = useState<CotizacionCliente[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // Estados para filtros
    const [searchText, setSearchText] = useState('');

    // Función para verificar si una cotización terminada ya fue calificada
    const checkRatingStatus = async (cotizacionesData: CotizacionCliente[]): Promise<CotizacionCliente[]> => {
        const cotizacionesWithRating = await Promise.all(
            cotizacionesData.map(async (cotizacion) => {
                if (cotizacion.id_estado === 5) { // Solo verificar cotizaciones terminadas
                    try {
                        const ratingData = await getRating(cotizacion.id_cotizacion);
                        return {
                            ...cotizacion,
                            isRated: Boolean(ratingData.puntuacion && ratingData.puntuacion > 0)
                        };
                    } catch (error) {
                        return {
                            ...cotizacion,
                            isRated: false
                        };
                    }
                }
                return cotizacion;
            })
        );
        return cotizacionesWithRating;
    };

    // Función para filtrar cotizaciones por texto (nombre de trabajador)
    const filterByText = (cotizacion: CotizacionCliente): boolean => {
        if (!searchText.trim()) return true;
        const fullName = `${cotizacion.nombre} ${cotizacion.apellido}`.toLowerCase();
        const searchLower = searchText.toLowerCase();
        return fullName.includes(searchLower) ||
            cotizacion.asunto.toLowerCase().includes(searchLower) ||
            cotizacion.descripcion.toLowerCase().includes(searchLower);
    };

    // Función para limpiar filtros
    const clearFilters = () => {
        setSearchText('');
    };

    // Función para verificar si hay filtros activos
    const hasActiveFilters = (): boolean => {
        return searchText.trim() !== '';
    };

    // Función para obtener texto de filtros activos
    const getActiveFiltersText = (): string => {
        if (searchText.trim()) {
            return `"${searchText}"`;
        }
        return '';
    };

    // Filtrar cotizaciones según la pestaña activa y filtros
    const filteredCotizaciones = cotizaciones
        .filter(cotizacion => {
            // Primero filtrar por estado
            let stateFilter = false;
            switch (activeTab) {
                case 'pendientes':
                    stateFilter = cotizacion.id_estado === 1;
                    break;
                case 'respondidas':
                    stateFilter = cotizacion.id_estado === 2;
                    break;
                case 'aceptadas':
                    stateFilter = cotizacion.id_estado === 4;
                    break;
                case 'terminadas':
                    stateFilter = cotizacion.id_estado === 5;
                    break;
                case 'rechazadas':
                    stateFilter = cotizacion.id_estado === 3;
                    break;
                default:
                    stateFilter = true;
            }

            if (!stateFilter) return false;

            // Luego aplicar filtro de texto
            return filterByText(cotizacion);
        });

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const usuarioData = await recuperarStorage('usuario');
                if (usuarioData?.id) {
                    setUserId(Number(usuarioData.id));

                    // Obtener cotizaciones del cliente
                    const cotizacionesData = await getCotizacionesCli(Number(usuarioData.id));
                    // Verificar estado de rating para cotizaciones terminadas
                    const cotizacionesWithRating = await checkRatingStatus(cotizacionesData);
                    setCotizaciones(cotizacionesWithRating);
                }
            } catch (error) {
                // Error silencioso para mejor UX
            }
        };

        loadUserId();
    }, []);

    // Actualizar cotizaciones cuando el usuario regrese a la pantalla
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                const refreshCotizaciones = async () => {
                    try {
                        const cotizacionesData = await getCotizacionesCli(userId);
                        // Verificar estado de rating para cotizaciones terminadas
                        const cotizacionesWithRating = await checkRatingStatus(cotizacionesData);
                        setCotizaciones(cotizacionesWithRating);
                    } catch (error) {
                        // Error silencioso para mejor UX
                    }
                };
                refreshCotizaciones();
            }
        }, [userId])
    );

    const getEstadoText = (id_estado: number, isRated?: boolean) => {
        if (id_estado === 5) {
            return isRated ? 'Terminada y Calificada' : 'Terminada';
        }

        switch (id_estado) {
            case 1: return 'Pendiente';
            case 2: return 'Respondida';
            case 3: return 'Rechazada';
            case 4: return 'Aceptada';
            default: return 'Desconocido';
        }
    };

    const getEstadoColor = (id_estado: number, isRated?: boolean) => {
        if (id_estado === 5) {
            return isRated ? '#FF6B35' : '#28A745'; // Naranja para calificada, verde para terminada
        }

        switch (id_estado) {
            case 1: return '#FFA000'; // Naranja para pendientes
            case 2: return '#2E7D32'; // Verde para respondidas
            case 3: return '#C62828'; // Rojo para rechazadas
            case 4: return '#1565C0'; // Azul para aceptadas
            default: return '#666666';
        }
    };

    const getEstadoBackground = (id_estado: number, isRated?: boolean) => {
        if (id_estado === 5) {
            return isRated ? '#FFF3E0' : '#E8F5E9'; // Naranja claro para calificada, verde claro para terminada
        }

        switch (id_estado) {
            case 1: return '#FFF3E0'; // Naranja claro para pendientes
            case 2: return '#E8F5E9'; // Verde claro para respondidas
            case 3: return '#FFEBEE'; // Rojo claro para rechazadas
            case 4: return '#E3F2FD'; // Azul claro para aceptadas
            default: return '#F5F5F5';
        }
    };

    const getEstadoIcon = (id_estado: number, isRated?: boolean) => {
        if (id_estado === 5) {
            return isRated ? 'star' : 'task-alt';
        }

        switch (id_estado) {
            case 1: return 'pending-actions';
            case 2: return 'check-circle';
            case 3: return 'cancel';
            case 4: return 'assignment-turned-in';
            default: return 'help';
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (userId) {
            try {
                const cotizacionesData = await getCotizacionesCli(userId);
                // Verificar estado de rating para cotizaciones terminadas
                const cotizacionesWithRating = await checkRatingStatus(cotizacionesData);
                setCotizaciones(cotizacionesWithRating);
            } catch (error) {
                // Error silencioso para mejor UX
            }
        }
        setRefreshing(false);
    }, [userId]);

    const renderCotizacionCard = (cotizacion: CotizacionCliente) => (
        <TouchableOpacity
            key={cotizacion.id_cotizacion}
            style={styles.card}
            onPress={() => {
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
                    { backgroundColor: getEstadoBackground(cotizacion.id_estado, cotizacion.isRated) }
                ]}>
                    <MaterialIcons
                        name={getEstadoIcon(cotizacion.id_estado, cotizacion.isRated) as any}
                        size={16}
                        color={getEstadoColor(cotizacion.id_estado, cotizacion.isRated)}
                    />
                    <Text style={[
                        styles.estado,
                        { color: getEstadoColor(cotizacion.id_estado, cotizacion.isRated) }
                    ]}>
                        {getEstadoText(cotizacion.id_estado, cotizacion.isRated)}
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

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por trabajador, asunto..."
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholderTextColor="#999"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <MaterialIcons name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Indicador de filtros activos */}
            {hasActiveFilters() && (
                <View style={styles.activeFiltersContainer}>
                    <View style={styles.activeFiltersInfo}>
                        <MaterialIcons name="search" size={16} color="#1565C0" />
                        <Text style={styles.activeFiltersText}>
                            {getActiveFiltersText()}
                        </Text>
                    </View>
                    <View style={styles.activeFiltersActions}>
                        <Text style={styles.resultsCount}>
                            {filteredCotizaciones.length} resultado{filteredCotizaciones.length !== 1 ? 's' : ''}
                        </Text>
                        <TouchableOpacity onPress={clearFilters}>
                            <Text style={styles.clearFiltersText}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredCotizaciones.length > 0 ? (
                    filteredCotizaciones.map(renderCotizacionCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="info" size={48} color="#ccc" />
                        <Text style={styles.emptyText}>
                            {hasActiveFilters() ? 'No se encontraron cotizaciones con la búsqueda aplicada' :
                                activeTab === 'pendientes' ? 'No hay cotizaciones pendientes' :
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
    },
    activeFiltersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#E3F2FD',
        borderBottomWidth: 1,
        borderBottomColor: '#BBDEFB',
    },
    activeFiltersInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeFiltersText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1565C0',
        marginLeft: 8,
    },
    activeFiltersActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultsCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1565C0',
        marginRight: 8,
    },
    clearFiltersText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#007AFF',
    },
});
