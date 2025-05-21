import React from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

const preguntasFrecuentes = [
  {
    pregunta: "¿Cómo puedo contratar un servicio?",
    respuesta: "Para contratar un servicio, navega por el catálogo de profesionales, revisa sus perfiles y calificaciones, selecciona el servicio que necesitas y contacta directamente con el trabajador. Puedes programar la fecha y hora que mejor te convenga."
  },
  {
    pregunta: "¿Cómo puedo ofrecer mis servicios como trabajador?",
    respuesta: "Para ofrecer tus servicios, crea una cuenta como profesional, completa tu perfil con tus habilidades, experiencia y fotos de trabajos anteriores. Puedes suscribirte a planes premium para obtener mayor visibilidad y beneficios especiales."
  },
  {
    pregunta: "¿Qué beneficios obtengo al suscribirme como trabajador?",
    respuesta: "Los trabajadores suscritos obtienen: mayor visibilidad en búsquedas, marco especial en su perfil, acceso a estadísticas detalladas, prioridad en la lista de resultados, y la posibilidad de destacar sus servicios especiales. Además, pueden recibir más solicitudes de trabajo."
  },
  {
    pregunta: "¿Cómo funciona el sistema de pagos?",
    respuesta: "Los pagos se procesan de manera segura a través de nuestra plataforma. Los clientes pueden pagar con tarjeta de crédito/débito o transferencia bancaria. El trabajador recibe el pago después de que el servicio sea completado y verificado."
  },
  {
    pregunta: "¿Cómo se califica a los trabajadores?",
    respuesta: "Después de cada servicio, los clientes pueden calificar al trabajador en diferentes aspectos como puntualidad, calidad del trabajo y profesionalismo. Estas calificaciones son visibles en el perfil del trabajador y ayudan a otros clientes a tomar decisiones informadas."
  },
  {
    pregunta: "¿Qué debo hacer si tengo un problema con un servicio?",
    respuesta: "Si tienes algún problema, puedes contactar a nuestro equipo de soporte a través de la sección 'Ayuda'. Contamos con un sistema de resolución de disputas para asegurar que tanto clientes como trabajadores tengan una experiencia justa y satisfactoria."
  }
];

export default function Preguntas() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Preguntas Frecuentes</Text>
          
          {preguntasFrecuentes.map((item, index) => (
            <List.Accordion
              key={index}
              style={styles.acordion}
              title={item.pregunta}
              titleStyle={styles.acordionTitle}
            >
              <List.Item
                style={styles.itemAcordeon}
                title={item.respuesta}
                titleStyle={styles.itemTitle}
                titleNumberOfLines={0}
              />
            </List.Accordion>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  acordion: {
    borderRadius: 10,
    backgroundColor: '#84AE46',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#689f38',
    elevation: 2,
  },
  acordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemAcordeon: {
    backgroundColor: '#eaf7db',
    borderRadius: 8,
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
