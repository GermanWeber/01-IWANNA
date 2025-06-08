import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
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
  respondida: number;
};

type Cotizacion = {
  id: string;
  nombre: string;
  apellido: string;
  fecha: string;
  motivo: string;
  imagen: string;
  estado: string;
};


type Section = {
  title: string;
  key: string;
};



const SECTIONS: Section[] = [
  { title: 'No Respondidas', key: 'noRespondidas' },
  { title: 'Respondidas', key: 'respondidas' },
];

export default function Cotizacion() {
  const router = useRouter();
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setName] = useState<string | null>(null)

  const fetchCotizaciones = async () => {
    try {
      const usuario = await recuperarStorage('usuario');
      if (usuario?.id) {
        setUserId(Number(usuario.id));
        setName(String(usuario.nombre))

        const resultado = await getCotizaciones(Number(usuario.id));
        console.log('ID del trabajador:', usuario.id);
        console.log('Cotizaciones recibidas del backend:', resultado);
        setCotizaciones(resultado.map((cot: CotizacionBackend) => ({
          id: cot.id.toString(),
          nombre: cot.nombre_cliente,
          apellido: cot.apellido_cliente,
          fecha: cot.f_creacion,
          motivo: cot.asunto,
          estado: cot.respondida === 1 ? 'Respondida' : 'No Respondida'
        })));
      } else {
        console.error('No se pudo obtener el ID del usuario');
      }
    } catch (error) {
      console.error('Error al cargar cotizaciones:', error);
    }
  };

  // Usar useFocusEffect para recargar las cotizaciones cuando la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      fetchCotizaciones();
    }, [])
  );

  const handleCardPress = (id: string) => {
    console.log('ID de la cotización tocada:', id);
    router.push(`/(mas)/(cotizacion)/cotizacion-interior?id=${id}`);
  };

  // Filtrar cotizaciones basado en el campo respondida
  const noRespondidas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'No Respondida');
  const respondidas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'Respondida');

  const _renderHeader = (section: Section, _: number, isActive: boolean) => {
    const count = section.key === 'noRespondidas' ? noRespondidas.length : respondidas.length;

    return (
      <View style={[styles.header, isActive && styles.headerActive]}>
        <View style={styles.headerContent}>
          <MaterialIcons
            name={section.key === 'noRespondidas' ? 'pending-actions' : 'check-circle'}
            size={24}
            color={section.key === 'noRespondidas' ? '#FF9500' : '#34C759'}
          />
          <Text style={styles.headerText}>{section.title}</Text>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
        <MaterialIcons
          name={isActive ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#666"
        />
      </View>
    );
  };

  const _renderContent = (section: Section, _: number, isActive: boolean) => {
    const data = section.key === 'noRespondidas' ? noRespondidas : respondidas;

    return (
      <View style={styles.content}>
        {data.length > 0 ? (
          <ScrollView
            style={styles.contentScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.scrollContent}
          >
            {data.map((cotizacion) => (
              <View key={cotizacion.id} style={styles.cardContainer}>
                <CotizacionCard
                  {...cotizacion}
                  onPress={() => handleCardPress(cotizacion.id)}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name={section.key === 'noRespondidas' ? 'pending-actions' : 'check-circle'}
              size={48}
              color="#ccc"
            />
            <Text style={styles.emptyText}>
              {section.key === 'noRespondidas'
                ? 'No hay cotizaciones pendientes'
                : 'No hay cotizaciones respondidas'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Cotizaciones de <Text style={styles.titleHighlight}>{userName?.toUpperCase()}</Text>
        </Text>
      </View>
      <View style={styles.accordionContainer}>
        <Accordion<Section>
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={setActiveSections}
          underlayColor="transparent"
          sectionContainerStyle={styles.sectionContainer}
          expandMultiple={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  titleHighlight: {
    color: '#007AFF',
  },
  accordionContainer: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerActive: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    color: '#333',
  },
  countContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 12,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  content: {
    backgroundColor: '#fff',
    minHeight: 300,
  },
  contentScrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});