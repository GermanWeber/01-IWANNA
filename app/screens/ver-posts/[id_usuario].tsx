import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect } from "react";
import { FlatList, RefreshControl, View, Text, ActivityIndicator, StatusBar } from "react-native";
import PostSecundario from "../../../components/post-secundario";
import { obtenerPostsByUser } from "../../../services/postService";
import { useState } from "react";
import { PostType } from "../../../types/post";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";


export default function RootLayout() {

    const { id_usuario } = useLocalSearchParams();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        obtenerPostsByUser(Number(id_usuario));
        setRefreshing(false);
    }, []);


    useEffect(() => {
        const cargarPosts = async () => {
            setLoading(true);
            try {
                const posts = await obtenerPostsByUser(Number(id_usuario));
                setPosts(posts);
            } catch (error) {
                console.error('Error al cargar posts:', error);
                return null;
            } finally {
                setLoading(false);
            }
        };
        cargarPosts();
    }, [id_usuario]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Cargando publicaciones...</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <FlatList
                data={posts}
                keyExtractor={(item) => `post-${item.id}`}
                renderItem={({ item }) => {
                    return <PostSecundario datos={item} />;
                }}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={50}
                windowSize={7}
                removeClippedSubviews={true}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                    <Text>No hay publicaciones disponibles</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
