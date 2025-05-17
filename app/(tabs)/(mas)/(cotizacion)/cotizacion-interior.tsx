import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

// Datos de ejemplo que normalmente vendrían de la API
type Quote = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  asunto: string;
  descripcion: string;
  fecha: string;
  imagen: string;
  estado: string;
};

export default function CotizacionInterior() {
  const { id } = useLocalSearchParams();
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cotizacion, setCotizacion] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulando la carga de datos
  useEffect(() => {
    // Aquí iría la llamada a la API para obtener los detalles de la cotización
    const fetchCotizacion = async () => {
      try {
        // Datos de ejemplo
        const data: Quote = {
          id: id as string,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          telefono: '+56 9 1234 5678',
          asunto: 'Instalación eléctrica en departamento',
          descripcion: 'Necesito instalar tomacorrientes y luces en mi departamento de 3 habitaciones. El trabajo incluye la instalación de 10 tomacorrientes dobles y 8 luces LED empotradas. También necesito un nuevo tablero eléctrico. El departamento es de aproximadamente 80m2. Por favor, incluir en la cotización el costo de materiales y mano de obra.',
          fecha: '13/05/2025',
          imagen: 'https://randomuser.me/api/portraits/men/1.jpg',
          estado: 'Pendiente'
        };
        setCotizacion(data);
      } catch (error) {
        console.error('Error al cargar la cotización:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCotizacion();
  }, [id]);

  const handleEnviarCotizacion = () => {
    if (!precio || !mensaje) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    // Aquí iría la lógica para enviar la cotización
    console.log('Enviando cotización:', { precio, mensaje });
    alert('Cotización enviada exitosamente');
    // Navegar atrás o actualizar el estado
  };

  if (loading || !cotizacion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Sección del usuario */}
        <View style={styles.usuarioContainer}>
          <Image 
            source={{ uri: cotizacion.imagen }} 
            style={styles.avatar} 
          />
          <View style={styles.usuarioInfo}>
            <Text style={styles.nombre}>
              {cotizacion.nombre} {cotizacion.apellido}
            </Text>
            <Text style={styles.fecha}>{cotizacion.fecha}</Text>
            <Text style={styles.contacto}>{cotizacion.email}</Text>
            <Text style={styles.contacto}>{cotizacion.telefono}</Text>
          </View>
        </View>

        {/* Sección del asunto */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Asunto</Text>
          <Text style={styles.asunto}>{cotizacion.asunto}</Text>
        </View>

        {/* Sección de descripción */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Descripción</Text>
          <Text style={styles.descripcion}>{cotizacion.descripcion}</Text>
        </View>

        {/* Sección de respuesta */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Tu Cotización</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mensaje</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe aquí los detalles de tu cotización..."
              multiline
              numberOfLines={4}
              value={mensaje}
              onChangeText={setMensaje}
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio de la cotización (CLP)</Text>
            <View style={styles.precioContainer}>
              <Text style={styles.precioSimbolo}>$</Text>
              <TextInput
                style={styles.inputPrecio}
                placeholder="0"
                keyboardType="numeric"
                value={precio}
                onChangeText={setPrecio}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón de envío fijo en la parte inferior */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.botonEnviar}
          onPress={handleEnviarCotizacion}
        >
          <Text style={styles.textoBoton}>
            <MaterialIcons name="send" size={18} color="white" /> Enviar Cotización
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  usuarioInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contacto: {
    fontSize: 14,
    color: '#4a90e2',
    marginBottom: 2,
  },
  seccion: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  asunto: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  descripcion: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  precioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precioSimbolo: {
    fontSize: 20,
    marginRight: 8,
    color: '#333',
  },
  inputPrecio: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  botonEnviar: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});