import React from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native';
import { Card } from 'react-native-paper';

export default function QuienesSomos() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../../assets/images/icons/iwanna_manusc.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.subtitulo}>Nuestra Misión</Text>
                            <Text style={styles.texto}>
                                Somos una plataforma innovadora que conecta a profesionales talentosos con clientes que buscan servicios de calidad. Nuestro objetivo es facilitar el encuentro entre la oferta y la demanda de servicios, creando oportunidades de crecimiento para todos, mientras protegemos la privacidad y seguridad de nuestros usuarios.
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.subtitulo}>Nuestra Visión</Text>
                            <Text style={styles.texto}>
                                Aspiramos a ser la plataforma líder en la conexión de servicios profesionales, donde cada trabajador pueda mostrar su talento y cada cliente encuentre exactamente lo que necesita, todo en un ambiente seguro, confiable y respetuoso con la privacidad de nuestros usuarios.
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.subtitulo}>¿Por qué elegirnos?</Text>
                            <View style={styles.beneficiosContainer}>
                                <View style={styles.beneficio}>
                                    <Text style={styles.beneficioTitulo}>✓ Calidad Garantizada</Text>
                                    <Text style={styles.beneficioTexto}>Todos nuestros profesionales son verificados y calificados para asegurar la mejor experiencia.</Text>
                                </View>
                                <View style={styles.beneficio}>
                                    <Text style={styles.beneficioTitulo}>✓ Protección de Datos</Text>
                                    <Text style={styles.beneficioTexto}>Tu información personal está protegida. Cumplimos con las normativas de protección de datos y nunca compartimos tu información con terceros.</Text>
                                </View>
                                <View style={styles.beneficio}>
                                    <Text style={styles.beneficioTitulo}>✓ Flexibilidad</Text>
                                    <Text style={styles.beneficioTexto}>Elige el profesional y horario que mejor te convenga. Los trabajadores pueden gestionar sus propios precios y disponibilidad.</Text>
                                </View>
                                <View style={styles.beneficio}>
                                    <Text style={styles.beneficioTitulo}>✓ Beneficios Premium</Text>
                                    <Text style={styles.beneficioTexto}>Los trabajadores pueden suscribirse para obtener mayor visibilidad, destacar su perfil y acceder a herramientas avanzadas de gestión.</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.subtitulo}>Nuestros Valores</Text>
                            <View style={styles.valoresContainer}>
                                <Text style={styles.valor}>• Privacidad</Text>
                                <Text style={styles.valor}>• Transparencia</Text>
                                <Text style={styles.valor}>• Excelencia</Text>
                                <Text style={styles.valor}>• Innovación</Text>
                                <Text style={styles.valor}>• Compromiso</Text>
                            </View>
                        </Card.Content>
                    </Card>
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
    scrollContainer: {
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        elevation: 3,
    },
    subtitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#84AE46',
        marginBottom: 10,
    },
    texto: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    beneficiosContainer: {
        marginTop: 10,
    },
    beneficio: {
        marginBottom: 15,
    },
    beneficioTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#84AE46',
        marginBottom: 5,
    },
    beneficioTexto: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    valoresContainer: {
        marginTop: 10,
    },
    valor: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        lineHeight: 22,
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: '100%',
        height: 150,
    },
});