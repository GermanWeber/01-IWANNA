import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { recuperarStorage } from '../services/asyncStorage';
import { BUCKET_URL } from '@env';
const imgPerfil = require('../assets/images/perfil.png');

interface HeaderProps {
    showBackButton?: boolean;
    showLogo?: boolean;
    showProfile?: boolean;
}
export default function Header({
    showBackButton = true,
    showLogo = true,
    showProfile = true
}: HeaderProps) {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    const [profileUri, setProfileUri] = useState<string | null>(null);
    const handleProfilePress = async () => {
        try {
            if (usuario) {
                router.push('/(tabs)/(mas)/mi-perfil');
            } else {
                router.push('/(auth)');
            }
        } catch (error) {
            console.error('Error al verificar la sesión:', error);
            router.push('/(auth)');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const cargarUsuario = async () => {
                const datos = await recuperarStorage('usuario');
                if (datos) {
                    setUsuario(datos);
                }
            };
            cargarUsuario();
        }, [])
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#84AE46', '#84AE46']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.leftContainer}>
                        {showBackButton ? (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                                activeOpacity={0.8}
                            >
                                <View style={styles.backButtonInner}>
                                    <Ionicons name="arrow-back" size={22} color="#84AE46" />
                                </View>
                            </TouchableOpacity>
                        ) :
                            (
                                <TouchableOpacity
                                    style={styles.imgContainer}
                                    onPress={() => router.back()}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../assets/images/icons/iwanna_manusc_grueso.png')}
                                        style={styles.decorativeImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>)
                        }
                    </View>

                    <View style={styles.centerContainer}>
                        {showLogo && (
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../assets/images/icons/logo-sin-fondo-sin-nombre.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.rightContainer}>
                        {showProfile && (
                            <TouchableOpacity
                                style={styles.profileContainer}
                                onPress={handleProfilePress}
                                activeOpacity={0.7}
                            >
                                <View style={styles.profileImageContainer}>
                                    <Image
                                        key={usuario?.foto || 'defaultFoto'}
                                        source={
                                            usuario?.foto
                                                ? { uri: `${BUCKET_URL}foto-perfil/${usuario.foto}`, cache: 'force-cache' }
                                                : imgPerfil
                                        }
                                        style={styles.userImage}
                                    />

                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' ? 64 : 54,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    gradient: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 16 : 4,
        paddingBottom: 0,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    leftContainer: {
        width: 80,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightContainer: {
        width: 60,
        alignItems: 'flex-end',
    },
    backButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
    },
    backButtonInner: {
        width: 28,
        height: 28,
        backgroundColor: '#f5f5f5',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.12,
                shadowRadius: 1,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    profileContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#f5f5f5',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.12,
                shadowRadius: 1,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    userImage: {
        width: 26,
        height: 26,
        borderRadius: 13,
    },
    logoContainer: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 72,
        height: 48,
    },
    imgContainer: {
        width: "100%"
    },
    decorativeImage: {
        width: "100%",
        height: 40,
    }
}); 