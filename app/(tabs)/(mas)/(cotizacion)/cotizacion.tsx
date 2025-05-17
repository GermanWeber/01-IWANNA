import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { MaterialIcons } from '@expo/vector-icons';
import CotizacionCard from '../../../../components/card-cotizacion';

// Datos de ejemplo para las cotizaciones
const cotizaciones = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    fecha: '13/05/2025',
    motivo: 'Instalación eléctrica en departamento',
    imagen: 'https://randomuser.me/api/portraits/men/1.jpg',
    estado: 'No Respondida',
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    fecha: '12/05/2025',
    motivo: 'Reparación de tuberías en baño',
    imagen: 'https://randomuser.me/api/portraits/women/2.jpg',
    estado: 'Respondida',
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    fecha: '11/05/2025',
    motivo: 'Pintura de interiores',
    imagen: 'https://randomuser.me/api/portraits/men/3.jpg',
    estado: 'No Respondida',  
  },
  {
    id: '4',
    nombre: 'Pedro',
    apellido: 'García',
    fecha: '11/05/2025',
    motivo: 'Pintura de interiores',
    imagen: 'https://randomuser.me/api/portraits/men/4.jpg',
    estado: 'No Respondida',
  },
  {
    id: '5',
    nombre: 'Ana',
    apellido: 'García',
    fecha: '11/05/2025',
    motivo: 'Pintura de interiores',
    imagen: 'https://randomuser.me/api/portraits/women/5.jpg',
    estado: 'No Respondida',
  },
  {
    id: '6',
    nombre: 'Luis',
    apellido: 'Torres',
    fecha: '11/05/2025',
    motivo: 'Pintura de interiores',
    imagen: 'https://randomuser.me/api/portraits/men/6.jpg',
    estado: 'No Respondida',
  },
  {
    id: '7',
    nombre: 'Luisa',
    apellido: 'Parada',
    fecha: '11/05/2025',
    motivo: 'Pintura de interiores',
    imagen: 'https://randomuser.me/api/portraits/women/7.jpg',
    estado: 'No Respondida',
  },
];


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

  const handleCardPress = (id: string) => {
    // Navegar a la pantalla de detalle de la cotización
    router.push(`/(mas)/(cotizacion)/cotizacion-interior?id=${id}`);
  };

  // Filtrar cotizaciones (ejemplo: asumimos que las primeras 2 no están respondidas)
  const noRespondidas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'No Respondida');
  const respondidas = cotizaciones.filter((cotizacion) => cotizacion.estado === 'Respondida');

  const _renderHeader = (section: Section, _: number, isActive: boolean) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
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
        <ScrollView 
          style={styles.contentScrollView}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {data.length > 0 ? (
            data.map((cotizacion) => (
              <View key={cotizacion.id} style={{ marginBottom: 10 }}>
                <CotizacionCard
                  {...cotizacion}
                  onPress={() => handleCardPress(cotizacion.id)}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay cotizaciones</Text>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cotizaciones Recibidas</Text>
      <View style={styles.accordionContainer}>
        <Accordion<Section>
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={setActiveSections}
          underlayColor="transparent"
          sectionContainerStyle={styles.sectionContainer}
          expandMultiple={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 10,
    backgroundColor: '#fff',
    maxHeight: 300, // Altura máxima para el contenido del acordeón
  },
  contentScrollView: {
    paddingHorizontal: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  accordionContainer: {
    flex: 1,
  },
});