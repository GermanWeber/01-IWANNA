import React from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, Platform } from 'react-native';
import { List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const preguntasFrecuentes = [
  {
    pregunta: "¿Cómo funciona IWANNA?",
    respuesta: "IWANNA es una plataforma que conecta clientes con trabajadores profesionales. Los clientes pueden buscar trabajadores por categorías, revisar sus perfiles y calificaciones, y enviar cotizaciones para servicios específicos. Los trabajadores pueden crear perfiles, publicar posts de sus trabajos, y recibir solicitudes de cotización."
  },
  {
    pregunta: "¿Cómo puedo contratar un servicio?",
    respuesta: "Para contratar un servicio: 1) Navega por las categorías y encuentra el trabajador que necesitas, 2) Revisa su perfil, calificaciones y posts de trabajos anteriores, 3) Envía una cotización con los detalles de tu proyecto, 4) El trabajador te responderá con un precio y propuesta, 5) Puedes aceptar o rechazar la cotización."
  },
  {
    pregunta: "¿Cómo puedo ofrecer mis servicios como trabajador?",
    respuesta: "Para ofrecer servicios: 1) Regístrate como trabajador seleccionando tu profesión, 2) Completa tu perfil con información personal y profesional, 3) Sube fotos de trabajos anteriores, 4) Publica posts mostrando tu trabajo, 5) Opcionalmente suscríbete a un plan premium para mayor visibilidad."
  },
  {
    pregunta: "¿Qué son las cotizaciones y cómo funcionan?",
    respuesta: "Las cotizaciones son solicitudes de trabajo que los clientes envían a los trabajadores. Incluyen: asunto del trabajo, descripción detallada, dirección y fecha. El trabajador responde con un precio estimado y mensaje. El cliente puede aceptar, rechazar o solicitar modificaciones. Una vez aceptada, el trabajo puede comenzar."
  },
  {
    pregunta: "¿Qué beneficios obtengo con un plan premium?",
    respuesta: "Los planes premium incluyen: mayor visibilidad en búsquedas, marco especial en tu perfil, acceso a estadísticas detalladas, prioridad en resultados, publicación ilimitada de posts, soporte prioritario, y más solicitudes de trabajo. Los planes están disponibles en modalidad mensual o anual con descuentos."
  },
  {
    pregunta: "¿Cómo funciona la verificación de trabajadores?",
    respuesta: "La verificación es un proceso opcional que aumenta la confianza de los clientes. Los trabajadores pueden enviar un formulario de verificación que incluye documentación personal y profesional. Una vez aprobado, reciben un badge de verificación en su perfil. El proceso es gratuito y mejora significativamente la visibilidad."
  },
  {
    pregunta: "¿Cómo se califica a los trabajadores?",
    respuesta: "Después de completar un trabajo, los clientes pueden calificar al trabajador en diferentes aspectos: puntualidad, calidad del trabajo, profesionalismo y comunicación. Estas calificaciones se promedian y se muestran en el perfil del trabajador, ayudando a otros clientes a tomar decisiones informadas."
  },
  {
    pregunta: "¿Qué son los posts y para qué sirven?",
    respuesta: "Los posts son publicaciones que los trabajadores crean para mostrar sus trabajos anteriores. Incluyen fotos, descripciones y detalles del proyecto. Sirven como portafolio visual para que los clientes vean la calidad del trabajo antes de contratar. Los posts aparecen en las categorías correspondientes y en el perfil del trabajador."
  },
  {
    pregunta: "¿Cómo funciona el sistema de mensajes?",
    respuesta: "El sistema de mensajes permite comunicación directa entre clientes y trabajadores. Se activa automáticamente cuando se envía una cotización. Ambos pueden intercambiar mensajes para aclarar detalles, coordinar fechas, o resolver dudas sobre el proyecto. Los mensajes se mantienen organizados por conversación."
  },
  {
    pregunta: "¿Puedo cancelar mi suscripción premium?",
    respuesta: "Sí, puedes cancelar tu suscripción premium en cualquier momento desde la sección 'Mi Plan' en tu perfil. La cancelación será efectiva al final del período actual de facturación. Mantendrás todos los beneficios premium hasta esa fecha. No hay penalizaciones por cancelar."
  },
  {
    pregunta: "¿Qué debo hacer si tengo un problema con un servicio?",
    respuesta: "Si tienes algún problema: 1) Intenta resolverlo directamente con el trabajador a través de mensajes, 2) Si no se resuelve, puedes denunciar el contenido o trabajador desde la sección correspondiente, 3) Contacta nuestro equipo de soporte con los detalles del problema. Trabajamos para asegurar experiencias justas para todos."
  },
  {
    pregunta: "¿Cómo puedo buscar trabajadores por categoría?",
    respuesta: "Para buscar trabajadores: 1) Ve a la sección 'Categorías' en el menú principal, 2) Selecciona la categoría que necesitas (ej: plomería, electricidad, limpieza), 3) Verás todos los trabajadores de esa categoría, 4) Usa el buscador para filtrar por nombre o especialidad, 5) Revisa perfiles y posts antes de contactar."
  },
  {
    pregunta: "¿Es seguro usar IWANNA?",
    respuesta: "IWANNA implementa múltiples medidas de seguridad: verificación de identidad, sistema de calificaciones, perfiles verificados, y sistema de denuncias. Sin embargo, siempre recomendamos: revisar calificaciones antes de contratar, comunicarse a través de la plataforma, y reportar cualquier comportamiento sospechoso."
  }
];

export default function Preguntas() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="help-circle" size={24} color="#84AE46" />
            </View>
            <Text style={styles.titulo}>Preguntas Frecuentes</Text>
            <Text style={styles.subtitulo}>Encuentra respuestas a tus dudas más comunes</Text>
          </View>

          {/* Lista de preguntas */}
          <View style={styles.preguntasContainer}>
            {preguntasFrecuentes.map((item, index) => (
              <View key={index} style={styles.preguntaCard}>
                <List.Accordion
                  style={styles.acordion}
                  title={item.pregunta}
                  titleStyle={styles.acordionTitle}
                  titleNumberOfLines={2}
                  left={(props) => (
                    <View style={styles.questionIconContainer}>
                      <Ionicons name="help-circle-outline" size={20} color="#84AE46" />
                    </View>
                  )}
                >
                  <View style={styles.respuestaContainer}>
                    <View style={styles.respuestaIconContainer}>
                      <Ionicons name="information-circle-outline" size={16} color="#666" />
                    </View>
                    <Text style={styles.respuestaText}>{item.respuesta}</Text>
                  </View>
                </List.Accordion>
              </View>
            ))}
          </View>

          {/* Footer informativo */}
          <View style={styles.footerContainer}>
            <View style={styles.footerCard}>
              <View style={styles.footerIconContainer}>
                <Ionicons name="chatbubbles-outline" size={24} color="#84AE46" />
              </View>
              <Text style={styles.footerTitle}>¿No encuentras tu respuesta?</Text>
              <Text style={styles.footerText}>
                Si tienes alguna pregunta específica que no está cubierta aquí, no dudes en contactarnos a través de nuestro correo electrónico.
              </Text>
              <View style={styles.contactContainer}>
                <Ionicons name="mail-outline" size={20} color="#84AE46" />
                <Text style={styles.contactEmail}>soporte@iwanna.com</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#84AE46',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  preguntasContainer: {
    padding: 16,
  },
  preguntaCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  acordion: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    margin: 0,
  },
  acordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    lineHeight: 22,
    flex: 1,
  },
  questionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  respuestaContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  respuestaIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  respuestaText: {
    flex: 1,
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
  },
  footerContainer: {
    padding: 16,
    paddingTop: 8,
  },
  footerCard: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    alignItems: 'center',
  },
  footerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#84AE46',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  contactEmail: {
    fontSize: 14,
    color: '#84AE46',
    marginLeft: 8,
  },
});
