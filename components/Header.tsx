import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
    titulo?: string;
    showBackButton?: boolean;
    showLogo?: boolean;
    showProfile?: boolean;
}

export default function Header({ 
    titulo, 
    showBackButton = false, 
    showLogo = true,
    showProfile = true 
}: HeaderProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#8BC34A', '#4CAF50']}
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
                            >
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                        ) : titulo && (
                            <View style={styles.titleWrapper}>
                                <Text style={styles.title}>{titulo}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.centerContainer}>
                        {showLogo && (
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../assets/images/icons/logo-sin-fondo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.rightContainer}>
                        {showProfile && !showBackButton && (
                            <TouchableOpacity 
                                style={styles.profileContainer}
                                onPress={() => router.push('/(auth)')}
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
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
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
    titleWrapper: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 0.3,
        textTransform: 'capitalize',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    logoContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 95,
        height: 95,
    },
}); 