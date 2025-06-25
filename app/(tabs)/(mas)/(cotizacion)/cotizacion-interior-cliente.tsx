import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Platform, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { getCotizacionesId, getRespuestaId, updateRespondido, getRechazo, createRechazoCot } from '../../../../services/cotizacionService';

import { createRating, getRating } from '../../../../services/ratingService';
import { RatingData } from '../../../../types/rating';

// Función para formatear números con separadores de miles
const formatNumber = (num: number | string | undefined): string => {
    if (num === undefined || num === null) return '0';

    const number = typeof num === 'string' ? parseFloat(num) : num;

    if (isNaN(number)) return '0';

    return number.toLocaleString('es-CL');
};

type DetalleCotizacion = {
    id_cotizacion: number;
    id_cliente: number;
    id_trabajador: number;
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

type RespuestaCotizacion = {
    id: number;
    id_cotizacion: number;
    mensaje: string;
    valor_estimado: number;
    fecha_respuesta: string;
};

type RechazoCotizacion = {
    id: number;
    id_cotizacion: number;
    motivo: string;
    fecha_rechazo: string;
    rechazado_por: number;
};

export default function CotizacionInteriorCliente() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [cotizacion, setCotizacion] = useState<DetalleCotizacion | null>(null);
    const [respuesta, setRespuesta] = useState<RespuestaCotizacion | null>(null);
    const [rechazo, setRechazo] = useState<RechazoCotizacion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [procesando, setProcesando] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [showRechazoForm, setShowRechazoForm] = useState(false);

    // Estados para el sistema de rating
    const [rating, setRating] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);
    const [dateRating, setdateRating] = useState<string | null>(null);;

    // Animación para la flecha del chat
    const arrowAnimation = useRef(new Animated.Value(0)).current;

    // Función para animar la flecha
    const animateArrow = () => {
        Animated.sequence([
            Animated.timing(arrowAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(arrowAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Repetir la animación cada 3 segundos
            setTimeout(animateArrow, 3000);
        });
    };

    // Iniciar animación cuando la cotización está en estado 4 (aceptada)
    useEffect(() => {
        if (cotizacion?.id_estado === 4) {
            animateArrow();
        }
    }, [cotizacion?.id_estado]);

    useEffect(() => {
        const fetchDetalleCotizacion = async () => {
            try {
                setLoading(true);
                const resultado = await getCotizacionesId(Number(id));
                setCotizacion(resultado);

                // Si la cotización está respondida o aceptada, obtener la respuesta
                if (resultado.id_estado === 2 || resultado.id_estado === 4 || resultado.id_estado === 5) {
                    const respuestaData = await getRespuestaId(Number(id));
                    setRespuesta(respuestaData);
                }

                // Si la cotización está rechazada, obtener el motivo del rechazo
                if (resultado.id_estado === 3) {
                    const rechazoData = await getRechazo(Number(id));
                    setRechazo(rechazoData);
                }

                // Verificar si ya existe una puntuación para esta cotización
                try {
                    const ratingData = await getRating(Number(id));

                    // Solo marcar como ya puntuada si realmente tiene una puntuación válida
                    if (ratingData.puntuacion && ratingData.puntuacion > 0) {
                        setRatingSubmitted(true);
                    }
                } catch (ratingError) {
                    // No marcar como enviada si no hay datos
                    setRatingSubmitted(false);
                }

                setLoading(false);
                setError(null);
            } catch (error: any) {
                setError('No se pudo cargar la cotización. Por favor, intenta más tarde.');
                setLoading(false);
            }
        };

        fetchDetalleCotizacion();
    }, [id]);

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
            case 1: return '#FFA000';
            case 2: return '#2E7D32';
            case 3: return '#C62828';
            case 4: return '#1565C0';
            case 5: return '#28A745';
            default: return '#666666';
        }
    };

    const handleAceptar = async () => {
        try {
            setProcesando(true);
            await updateRespondido(Number(id), 4);

            // Actualizar el estado local
            if (cotizacion) {
                setCotizacion({
                    ...cotizacion,
                    id_estado: 4
                });
            }

            Alert.alert(
                "¡Éxito!",
                "Has aceptado la cotización",
                [
                    {
                        text: "OK",
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            Alert.alert(
                "Error",
                "No se pudo procesar la aceptación. Por favor, intenta nuevamente."
            );
        } finally {
            setProcesando(false);
        }
    };

    const handleRechazar = async () => {
        if (!cotizacion) return;

        if (!motivoRechazo.trim()) {
            Alert.alert('Error', 'Por favor, ingresa un motivo para el rechazo');
            return;
        }

        try {
            const data = {
                id_cotizacion: Number(id),
                motivo: motivoRechazo,
                rechazado_por: "cliente"
            };

            const response = await createRechazoCot(data);
            if (response.message === 'Rechazo creado correctamente') {
                // Actualizar el estado local
                setCotizacion(prev => prev ? {
                    ...prev,
                    id_estado: 3 // Estado rechazado
                } : null);

                // Obtener y actualizar el rechazo
                const rechazoData = await getRechazo(Number(id));
                setRechazo(rechazoData);

                Alert.alert('Éxito', 'Cotización rechazada correctamente');
                setShowRechazoForm(false);
                setMotivoRechazo('');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo rechazar la cotización. Por favor, intenta nuevamente.');
        }
    };

    const handleStarPress = (starValue: number) => {
        setRating(starValue);
        setShowRatingForm(true);
    };

    const getRatingText = (ratingValue: number) => {
        switch (ratingValue) {
            case 1: return 'Muy malo';
            case 2: return 'Malo';
            case 3: return 'Regular';
            case 4: return 'Bueno';
            case 5: return 'Excelente';
            default: return 'Califica el servicio';
        }
    };

    const handleSubmitRating = async () => {
        if (!cotizacion || !respuesta || rating === 0) {
            Alert.alert('Error', 'Por favor, selecciona una puntuación');
            return;
        }

        try {
            setSubmittingRating(true);

            const ratingData: RatingData = {
                id_cotizacion: Number(id),
                id_trabajador: cotizacion.id_trabajador, // Usar el ID del trabajador de la cotización
                puntuacion: rating,
                comentario: ratingComment.trim() || 'Sin comentarios',

            };

            const response = await createRating(ratingData);

            if (response.message === 'Puntuación de trabajador creada exitosamente') {
                setRatingSubmitted(true);
                setShowRatingForm(false);

                Alert.alert(
                    '¡Gracias!',
                    'Tu calificación ha sido enviada exitosamente',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudo enviar la calificación. Por favor, intenta nuevamente.'
            );
        } finally {
            setSubmittingRating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando cotización...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!cotizacion) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
                <Text style={styles.errorText}>No se encontró la cotización</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Detalles de la Cotización</Text>
            </View>

            {/* Mensaje de Chat Activo para estado 4 */}
            {cotizacion?.id_estado === 4 && (
                <TouchableOpacity
                    style={styles.chatStatusContainer}
                    onPress={() => router.push('/(mas)/(mensajes)/mensajes')}
                >
                    <MaterialIcons name="chat-bubble" size={16} color="#007AFF" />
                    <Text style={styles.chatStatusText}>Chat activo</Text>
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateX: arrowAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 8], // Se mueve 8 píxeles hacia la derecha
                                    }),
                                },
                            ],
                        }}
                    >
                        <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
                    </Animated.View>
                </TouchableOpacity>
            )}

            <View style={styles.content}>
                {/* Detalles de la Cotización */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="description" size={24} color="#007AFF" />
                        <Text style={styles.sectionTitle}>Detalles de la Cotización</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="subject" size={20} color="#666" />
                            <Text style={styles.detailLabel}>Asunto:</Text>
                            <Text style={styles.detailText}>{cotizacion.asunto}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="info" size={20} color="#666" />
                            <Text style={styles.detailLabel}>Descripción:</Text>
                            <Text style={styles.detailText}>{cotizacion.descripcion}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="location-on" size={20} color="#666" />
                            <Text style={styles.detailLabel}>Dirección:</Text>
                            <Text style={styles.detailText}>{cotizacion.direccion}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="event" size={20} color="#666" />
                            <Text style={styles.detailLabel}>Fecha de Creación:</Text>
                            <Text style={styles.detailText}>
                                {new Date(cotizacion.f_creacion).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Respuesta del Trabajador (si existe) */}
                {(cotizacion.id_estado === 2 || cotizacion.id_estado === 4 || cotizacion.id_estado === 5) && respuesta && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons
                                name={cotizacion.id_estado === 4 ? "assignment-turned-in" :
                                    cotizacion.id_estado === 5 ? "task-alt" : "check-circle"}
                                size={24}
                                color={cotizacion.id_estado === 4 ? "#1565C0" :
                                    cotizacion.id_estado === 5 ? "#28A745" : "#2E7D32"}
                            />
                            <Text style={styles.sectionTitle}>
                                {cotizacion.id_estado === 4 ? "Cotización Aceptada" :
                                    cotizacion.id_estado === 5 ? "Trabajo Terminado" : "Respuesta del Trabajador"}
                            </Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={[
                                styles.responseCard,
                                cotizacion.id_estado === 4 && styles.acceptedCard,
                                cotizacion.id_estado === 5 && styles.completedCard
                            ]}>
                                <View style={styles.responseHeader}>
                                    <MaterialIcons
                                        size={24}
                                        color={cotizacion.id_estado === 4 ? "#1565C0" :
                                            cotizacion.id_estado === 5 ? "#28A745" : "#2E7D32"}
                                    />
                                    <Text style={[
                                        styles.responsePrice,
                                        {
                                            color: cotizacion.id_estado === 4 ? "#1565C0" :
                                                cotizacion.id_estado === 5 ? "#28A745" : "#2E7D32"
                                        }
                                    ]}>
                                        ${formatNumber(respuesta.valor_estimado)}
                                    </Text>
                                </View>
                                <View style={styles.responseMessage}>
                                    <MaterialIcons name="message" size={20} color="#666" />
                                    <Text style={styles.responseText}>{respuesta.mensaje}</Text>
                                </View>
                                <View style={styles.responseFooter}>
                                    <MaterialIcons name="event" size={16} color="#666" />
                                    <Text style={styles.responseDate}>
                                        {cotizacion.id_estado === 4 ? "Aceptada" :
                                            cotizacion.id_estado === 5 ? "Terminada" : "Respondida"} el {new Date(respuesta.fecha_respuesta).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>

                            {/* Sistema de Rating para trabajos terminados */}
                            {cotizacion.id_estado === 5 && (
                                <View style={styles.ratingContainer}>
                                    {!ratingSubmitted ? (
                                        <>
                                            <Text style={styles.ratingTitle}>Califica el servicio</Text>
                                            <View style={styles.starsContainer}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <TouchableOpacity
                                                        key={star}
                                                        onPress={() => handleStarPress(star)}
                                                        style={styles.starButton}
                                                    >
                                                        <MaterialIcons
                                                            name={star <= rating ? "star" : "star-border"}
                                                            size={32}
                                                            color={star <= rating ? "#FFD700" : "#D3D3D3"}
                                                            style={styles.star}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
                                        </>
                                    ) : (
                                        <View style={styles.ratingSubmittedContainer}>
                                            <MaterialIcons name="check-circle" size={48} color="#28A745" />
                                            <Text style={styles.ratingSubmittedText}>¡Cotización ya puntuada!</Text>
                                            <Text style={styles.ratingSubmittedSubtext}>Gracias por tu calificación</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Formulario de Rating */}
                            {showRatingForm && !ratingSubmitted && (
                                <View style={styles.ratingFormContainer}>
                                    <View style={styles.ratingFormHeader}>
                                        <Text style={styles.ratingFormTitle}>Tu opinión es importante</Text>
                                        <Text style={styles.ratingFormSubtitle}>
                                            Calificación: {rating} estrellas - {getRatingText(rating)}
                                        </Text>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Comentario (opcional)</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            value={ratingComment}
                                            onChangeText={setRatingComment}
                                            multiline
                                            numberOfLines={4}
                                            placeholder="Cuéntanos cómo fue tu experiencia con el servicio (opcional)..."
                                            placeholderTextColor="#999"
                                            maxLength={500}
                                        />
                                        <Text style={styles.charCount}>
                                            {ratingComment.length}/500 caracteres
                                        </Text>
                                    </View>

                                    <View style={styles.ratingButtonsContainer}>
                                        <TouchableOpacity
                                            style={[styles.ratingButton, styles.submitRatingButton]}
                                            onPress={handleSubmitRating}
                                            disabled={submittingRating}
                                        >
                                            {submittingRating ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <MaterialIcons name="send" size={20} color="#fff" />
                                            )}
                                            <Text style={styles.ratingButtonText}>
                                                {submittingRating ? 'Enviando...' : 'Enviar Calificación'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.ratingButton, styles.cancelRatingButton]}
                                            onPress={() => {
                                                setShowRatingForm(false);
                                                setRatingComment('');
                                                setRating(0);
                                            }}
                                            disabled={submittingRating}
                                        >
                                            <Text style={styles.ratingButtonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Motivo del Rechazo (si existe) */}
                {cotizacion.id_estado === 3 && rechazo && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="cancel" size={24} color="#C62828" />
                            <Text style={styles.sectionTitle}>Motivo del Rechazo</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.rechazoCard}>
                                <View style={styles.rechazoMessage}>
                                    <MaterialIcons name="message" size={20} color="#666" />
                                    <Text style={styles.rechazoText}>{rechazo.motivo}</Text>
                                </View>
                                <View style={styles.rechazoFooter}>
                                    <MaterialIcons name="event" size={16} color="#666" />
                                    <Text style={styles.rechazoDate}>
                                        Rechazado el {new Date(rechazo.fecha_rechazo).toLocaleDateString()} por {rechazo.rechazado_por}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Botones de Acción para Cotizaciones Respondidas */}
                {cotizacion && cotizacion.id_estado === 2 && !procesando && (
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.acceptButton]}
                            onPress={handleAceptar}
                            disabled={procesando}
                        >
                            <MaterialIcons name="check-circle" size={24} color="#fff" />
                            <Text style={styles.actionButtonText}>
                                {procesando ? 'Procesando...' : 'Aceptar Cotización'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => setShowRechazoForm(true)}
                            disabled={procesando}
                        >
                            <MaterialIcons name="cancel" size={24} color="#fff" />
                            <Text style={styles.actionButtonText}>
                                {procesando ? 'Procesando...' : 'Rechazar Cotización'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Formulario de Rechazo */}
                {showRechazoForm && (
                    <View style={styles.rechazoFormContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Motivo del Rechazo</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={motivoRechazo}
                                onChangeText={setMotivoRechazo}
                                multiline
                                numberOfLines={4}
                                placeholder="Ingrese el motivo del rechazo..."
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={styles.rechazoButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.rechazoButton, styles.confirmRechazoButton]}
                                onPress={handleRechazar}
                                disabled={procesando}
                            >
                                <Text style={styles.rechazoButtonText}>
                                    {procesando ? 'Enviando...' : 'Confirmar'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.rechazoButton, styles.cancelRechazoButton]}
                                onPress={() => {
                                    setShowRechazoForm(false);
                                    setMotivoRechazo('');
                                }}
                                disabled={procesando}
                            >
                                <Text style={styles.rechazoButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: '#6C757D',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 16,
    },
    errorText: {
        marginTop: 16,
        fontSize: 15,
        color: '#DC3545',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#212529',
        letterSpacing: 0.5,
    },
    content: {
        padding: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        backgroundColor: '#F8F9FA',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#212529',
        marginLeft: 12,
    },
    sectionContent: {
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#495057',
        marginLeft: 8,
        marginRight: 8,
        minWidth: 100,
    },
    detailText: {
        fontSize: 15,
        color: '#212529',
        flex: 1,
        lineHeight: 22,
    },
    responseCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    responseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    responsePrice: {
        marginLeft: 8,
        fontSize: 24,
        fontWeight: '700',
        color: '#28A745',
    },
    responseMessage: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    responseText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#212529',
        flex: 1,
        lineHeight: 22,
    },
    responseFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    responseDate: {
        marginLeft: 8,
        fontSize: 13,
        color: '#6C757D',
    },
    actionButtonsContainer: {
        padding: 16,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 8,
        gap: 8,
    },
    acceptButton: {
        backgroundColor: '#28A745',
    },
    rejectButton: {
        backgroundColor: '#DC3545',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    rechazoCard: {
        backgroundColor: '#F8D7DA',
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F5C6CB',
    },
    rechazoMessage: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    rechazoText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#721C24',
        flex: 1,
        lineHeight: 22,
    },
    rechazoFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F5C6CB',
    },
    rechazoDate: {
        marginLeft: 8,
        fontSize: 13,
        color: '#721C24',
    },
    inputContainer: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212529',
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: '#212529',
        borderWidth: 1,
        borderColor: '#CED4DA',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    rechazoFormContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    rechazoButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 8,
    },
    rechazoButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmRechazoButton: {
        backgroundColor: '#DC3545',
    },
    cancelRechazoButton: {
        backgroundColor: '#6C757D',
    },
    rechazoButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    acceptedCard: {
        backgroundColor: '#E3F2FD',
        borderColor: '#BBDEFB',
    },
    completedCard: {
        backgroundColor: '#E8F5E9',
        borderColor: '#C8E6C9',
    },
    ratingContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        alignItems: 'center',
    },
    ratingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    star: {
        marginHorizontal: 4,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    starButton: {
        padding: 4,
    },
    ratingSubmittedContainer: {
        alignItems: 'center',
    },
    ratingSubmittedText: {
        marginTop: 16,
        fontSize: 15,
        fontWeight: '600',
        color: '#28A745',
    },
    ratingSubmittedSubtext: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
    },
    ratingFormContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    ratingFormHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingFormTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 8,
    },
    ratingFormSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    ratingButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 8,
    },
    ratingButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitRatingButton: {
        backgroundColor: '#28A745',
    },
    cancelRatingButton: {
        backgroundColor: '#6C757D',
    },
    ratingButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    charCount: {
        alignSelf: 'flex-end',
        marginTop: 8,
        fontSize: 12,
        color: '#6C757D',
    },
    chatStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#E3F2FD',
        borderBottomWidth: 1,
        borderBottomColor: '#BBDEFB',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
    },
    chatStatusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1565C0',
        flex: 1,
        textAlign: 'center',
    },
});
