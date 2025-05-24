import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Register_term = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Términos y Condiciones</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
                    <Text style={styles.text}>
                        Al acceder y utilizar esta aplicación, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Uso del Servicio</Text>
                    <Text style={styles.text}>
                        2.1. La aplicación está diseñada para conectar profesionales con clientes. Usted se compromete a utilizar el servicio de manera ética y responsable.
                    </Text>
                    <Text style={styles.text}>
                        2.2. Debe proporcionar información precisa y completa al registrarse y mantener actualizada su información.
                    </Text>
                    <Text style={styles.text}>
                        2.3. Es responsable de mantener la confidencialidad de su cuenta y contraseña.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Contenido Prohibido</Text>
                    <Text style={styles.text}>
                        3.1. Está estrictamente prohibido publicar, compartir o promover cualquier tipo de contenido ilegal, incluyendo pero no limitado a:
                    </Text>
                    <Text style={styles.text}>
                        • Material pornográfico o contenido sexual explícito{'\n'}
                        • Contenido que promueva la violencia o el odio{'\n'}
                        • Material que infrinja derechos de autor{'\n'}
                        • Contenido que promueva actividades ilegales{'\n'}
                        • Discriminación de cualquier tipo{'\n'}
                        • Acoso o bullying{'\n'}
                        • Información falsa o engañosa{'\n'}
                        • Spam o contenido malicioso
                    </Text>
                    <Text style={styles.text}>
                        3.2. Nos reservamos el derecho de eliminar cualquier contenido que viole estas políticas y suspender o terminar las cuentas de los infractores.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Privacidad y Datos</Text>
                    <Text style={styles.text}>
                        4.1. Recopilamos y procesamos sus datos personales de acuerdo con nuestra Política de Privacidad.
                    </Text>
                    <Text style={styles.text}>
                        4.2. Usted acepta que podemos utilizar sus datos para mejorar nuestros servicios y enviarle comunicaciones relacionadas con el servicio.
                    </Text>
                    <Text style={styles.text}>
                        4.3. Sus datos personales están protegidos y no serán compartidos con terceros sin su consentimiento, excepto cuando la ley lo requiera.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Responsabilidades del Usuario</Text>
                    <Text style={styles.text}>
                        5.1. Es responsable de todas las actividades que ocurran bajo su cuenta.
                    </Text>
                    <Text style={styles.text}>
                        5.2. Debe notificar inmediatamente cualquier uso no autorizado de su cuenta.
                    </Text>
                    <Text style={styles.text}>
                        5.3. No debe intentar acceder a áreas restringidas del sistema o a otras cuentas de usuario.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Limitación de Responsabilidad</Text>
                    <Text style={styles.text}>
                        6.1. No nos hacemos responsables por daños indirectos, incidentales o consecuentes que puedan surgir del uso del servicio.
                    </Text>
                    <Text style={styles.text}>
                        6.2. No garantizamos que el servicio esté siempre disponible o libre de errores.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Modificaciones</Text>
                    <Text style={styles.text}>
                        7.1. Nos reservamos el derecho de modificar estos términos en cualquier momento.
                    </Text>
                    <Text style={styles.text}>
                        7.2. Las modificaciones entrarán en vigor inmediatamente después de su publicación.
                    </Text>
                    <Text style={styles.text}>
                        7.3. El uso continuado del servicio después de los cambios constituye su aceptación de los nuevos términos.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Terminación</Text>
                    <Text style={styles.text}>
                        8.1. Podemos suspender o terminar su acceso al servicio en cualquier momento por violaciones de estos términos.
                    </Text>
                    <Text style={styles.text}>
                        8.2. Usted puede terminar su cuenta en cualquier momento siguiendo el proceso de cancelación.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Ley Aplicable</Text>
                    <Text style={styles.text}>
                        9.1. Estos términos se rigen por las leyes del país donde opera la aplicación.
                    </Text>
                    <Text style={styles.text}>
                        9.2. Cualquier disputa será resuelta en los tribunales competentes de dicha jurisdicción.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 15,
    }
});

export default Register_term;
