import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import CotizacionCard from '../../../../components/card-cotizacion';
import { getCotizaciones } from '../../../../services/cotizacionService';
import { recuperarStorage } from '../../../../services/asyncStorage';

type CotizacionBackend = {
  id: number;
  id_cliente: number;
  nombre_cliente: string;
  apellido_cliente: string;
  id_trabajador: number;
  asunto: string;
  descripcion: string;
  direccion: string;
  f_creacion: string;
  id_estado: number;
};

type Cotizacion = {
  id: string;
  nombre: string;
  apellido: string;
  fecha: string;
  motivo: string;
  estado: string;
};

type Tab = {
  id: string;
  title: string;
  color: string;
};

const TABS: Tab[] = [
  { id: 'noRespondidas', title: 'Pendientes', color: '#FF9500' },
  { id: 'respondidas', title: 'Respondidas', color: '#34C759' },
  { id: 'aceptadas', title: 'Aceptadas', color: '#1565C0' },
  { id: 'terminadas', title: 'Terminadas', color: '#28A745' },
  { id: 'rechazadas', title: 'Rechazadas', color: '#C62828' },
];

const capitalizeWords = (str: string | undefined) => {
  if (!str) return '';
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function Cotizacion() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('noRespondidas');
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setName] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para filtros
  const [searchText, setSearchText] = useState('');

  const fetchCotizaciones = async () => {
    try {
      const usuario = await recuperarStorage('usuario');
      if (usuario?.id) {
        setUserId(Number(usuario.id));
        setName(String(usuario.nombre));

        const resultado = await getCotizaciones(Number(usuario.id));
        setCotizaciones(resultado.map((cot: CotizacionBackend) => ({
          id: cot.id.toString(),
          nombre: capitalizeWords(cot.nombre_cliente),
          apellido: capitalizeWords(cot.apellido_cliente),
          fecha: cot.f_creacion,
          motivo: cot.asunto,
          estado: cot.id_estado === 2 ? 'Respondida' :
            cot.id_estado === 3 ? 'Rechazada' :
              cot.id_estado === 4 ? 'Aceptada' :
                cot.id_estado === 5 ? 'Terminada' : 'No Respondida'
        })));
      } else {
        // Usuario no encontrado
      }
    } catch (error) {
      // Error silencioso para mejor UX
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCotizaciones();
    }, [])
  );

  const handleCardPress = (id: string) => {
    router.push(`/(mas)/(cotizacion)/cotizacion-interior?id=${id}`);
  };

  // Función para filtrar cotizaciones por texto
  const filterByText = (cotizacion: Cotizacion): boolean => {
    if (!searchText.trim()) return true;
    const fullName = `${cotizacion.nombre} ${cotizacion.apellido}`.toLowerCase();
    const searchLower = searchText.toLowerCase();
    return fullName.includes(searchLower) ||
      cotizacion.motivo.toLowerCase().includes(searchLower);
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

  const noRespondidas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'No Respondida');
  const respondidas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'Respondida');
  const aceptadas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'Aceptada');
  const terminadas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'Terminada');
  const rechazadas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'Rechazada');

  const getCurrentCotizaciones = () => {
    let currentCotizaciones;
    switch (activeTab) {
      case 'noRespondidas':
        currentCotizaciones = noRespondidas;
        break;
      case 'respondidas':
        currentCotizaciones = respondidas;
        break;
      case 'aceptadas':
        currentCotizaciones = aceptadas;
        break;
      case 'terminadas':
        currentCotizaciones = terminadas;
        break;
      case 'rechazadas':
        currentCotizaciones = rechazadas;
        break;
      default:
        currentCotizaciones = noRespondidas;
    }

    // Aplicar filtro de texto
    return currentCotizaciones.filter(filterByText);
  };

  const currentCotizaciones = getCurrentCotizaciones();
  const activeTabData = TABS.find(tab => tab.id === activeTab);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (userId) {
      try {
        const resultado = await getCotizaciones(userId);
        setCotizaciones(resultado.map((cot: CotizacionBackend) => ({
          id: cot.id.toString(),
          nombre: capitalizeWords(cot.nombre_cliente),
          apellido: capitalizeWords(cot.apellido_cliente),
          fecha: cot.f_creacion,
          motivo: cot.asunto,
          estado: cot.id_estado === 2 ? 'Respondida' :
            cot.id_estado === 3 ? 'Rechazada' :
              cot.id_estado === 4 ? 'Aceptada' :
                cot.id_estado === 5 ? 'Terminada' : 'No Respondida'
        })));
      } catch (error) {
        // Error silencioso para mejor UX
      }
    }
    setRefreshing(false);
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Cotizaciones de <Text style={styles.titleHighlight}>{userName?.toUpperCase()}</Text>
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente, asunto..."
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
              {currentCotizaciones.length} resultado{currentCotizaciones.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'noRespondidas' && styles.activeTab]}
          onPress={() => setActiveTab('noRespondidas')}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="schedule"
            size={24}
            color={activeTab === 'noRespondidas' ? '#FF9500' : '#666'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'noRespondidas' && { color: '#FF9500', fontWeight: '600' }
          ]}>
            {noRespondidas.length}
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
            color={activeTab === 'respondidas' ? '#34C759' : '#666'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'respondidas' && { color: '#34C759', fontWeight: '600' }
          ]}>
            {respondidas.length}
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
            {aceptadas.length}
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
            {terminadas.length}
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
            {rechazadas.length}
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
        {currentCotizaciones.length > 0 ? (
          currentCotizaciones.map((cotizacion) => (
            <View key={cotizacion.id} style={styles.cardContainer}>
              <CotizacionCard
                {...cotizacion}
                onPress={() => handleCardPress(cotizacion.id)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="info"
              size={48}
              color="#ccc"
            />
            <Text style={styles.emptyText}>
              {hasActiveFilters() ? 'No se encontraron cotizaciones con la búsqueda aplicada' :
                activeTab === 'noRespondidas' ? 'No hay cotizaciones pendientes' :
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
  cardContainer: {
    marginBottom: 8,
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