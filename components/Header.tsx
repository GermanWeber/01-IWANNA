import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    
    const handleProfilePress = async () => {
        try {
            const usuarioData = await AsyncStorage.getItem('usuario');

            if (usuarioData) {
                router.push('/(tabs)/(mas)/mi-perfil');
            } else {
                router.push('/(auth)');
            }
        } catch (error) {
            console.error('Error al verificar la sesión:', error);
            router.push('/(auth)');
        }
    };

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
                        ): 
                        (
                            <TouchableOpacity 
                                style={styles.imgContainer}
                                onPress={() => router.back()}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={require('../assets/images/icons/iwanna_manusc.png')}
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
                                        source={require('../assets/images/perfil.png')}
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
        height: Platform.OS === 'ios' ? 90 : 70,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    gradient: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 30 : 10,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    leftContainer: {
        width: 100,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightContainer: {
        width: 100,
        alignItems: 'flex-end',
    },
    backButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },
    backButtonInner: {
        width: 36,
        height: 36,
        backgroundColor: '#f5f5f5',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    profileContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#f5f5f5',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    userImage: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    logoContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 77,
        height: 77,
    },
    imgContainer: {
        width: "100%"
    },
    decorativeImage: {
        width: "100%",
    }
}); 