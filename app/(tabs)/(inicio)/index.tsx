import React, { useState } from 'react';
import { FlatList, View, Text, Image, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Post from '../../../components/post';
import { useEffect } from 'react';
import HeaderPrincipal from '../../../components/Header';
import { guardarStorage, recuperarStorage } from '../../../services/asyncStorage';

const Home = () => {
    const posts = [
        {
            id: 2,
            id_usuario: 3,
            tipo_usuario: 1,
            nombre: 'linda_code',
            profesion: 'Ingeniera de Software',
            img_perfil: 'https://randomuser.me/api/portraits/women/44.jpg',
            img_post: 'https://picsum.photos/600/600?random=2',
            descripcion: 'Conferencia tech en Berlín 💻✈️',
            likes: 220,
            cant_comentarios: 4,
            comentarios: [
            {
                id_post: 2,
                id_comentario: 106,
                id_usuario: 6,
                tipo_usuario: 2,
                usuario: 'dev_mateo',
                img_perfil: 'https://randomuser.me/api/portraits/men/88.jpg',
                comentario: '¡Qué envidia! ¿Qué temas tocaron?',
                likes: 6,
                respuestas: [
                {
                    id_post: 2,
                    id_comentario: 206,
                    id_usuario: 3,
                    tipo_usuario: 1,
                    usuario: 'linda_code',
                    img_perfil: 'https://randomuser.me/api/portraits/women/44.jpg',
                    comentario: 'Mucho sobre IA, Web3 y seguridad digital.',
                    likes: 3,
                    fecha: '2025-04-20',
                    hora: '13:10',
                    respuestas: []
                }
                ],
                fecha: '2025-04-19',
                hora: '10:00'
            },
            {
                id_post: 2,
                id_comentario: 107,
                id_usuario: 14,
                tipo_usuario: 1,
                usuario: 'tech_girl',
                img_perfil: 'https://randomuser.me/api/portraits/women/12.jpg',
                comentario: '¡Wow! Se ve muy pro el evento.',
                likes: 4,
                respuestas: [],
                fecha: '2025-04-19',
                hora: '12:45'
            },
            {
                id_post: 2,
                id_comentario: 108,
                id_usuario: 5,
                tipo_usuario: 2,
                usuario: 'frontend_love',
                img_perfil: 'https://randomuser.me/api/portraits/men/23.jpg',
                comentario: '¿Grabaste algo de las charlas?',
                likes: 2,
                respuestas: [
                {
                    id_post: 2,
                    id_comentario: 207,
                    id_usuario: 3,
                    tipo_usuario: 1,
                    usuario: 'linda_code',
                    img_perfil: 'https://randomuser.me/api/portraits/women/44.jpg',
                    comentario: 'Sí, pronto subiré un resumen a mi canal.',
                    likes: 1,
                    fecha: '2025-04-20',
                    hora: '15:25',
                    respuestas: []
                }
                ],
                fecha: '2025-04-19',
                hora: '17:40'
            },
            {
                id_post: 2,
                id_comentario: 109,
                id_usuario: 19,
                tipo_usuario: 1,
                usuario: 'code_traveler',
                img_perfil: 'https://randomuser.me/api/portraits/men/67.jpg',
                comentario: '¿Recomiendas asistir?',
                likes: 5,
                respuestas: [
                {
                    id_post: 2,
                    id_comentario: 208,
                    id_usuario: 3,
                    tipo_usuario: 1,
                    usuario: 'linda_code',
                    img_perfil: 'https://randomuser.me/api/portraits/women/44.jpg',
                    comentario: '¡Definitivamente! Vale cada centavo.',
                    likes: 2,
                    fecha: '2025-04-20',
                    hora: '09:55',
                    respuestas: []
                }
                ],
                fecha: '2025-04-19',
                hora: '14:30'
            }
            ]
        },
        {
            id: 3,
            id_usuario: 4,
            tipo_usuario: 2,
            nombre: 'mark_data',
            profesion: 'Analista de Datos',
            img_perfil: 'https://randomuser.me/api/portraits/men/52.jpg',
            img_post: 'https://picsum.photos/600/600?random=3',
            descripcion: 'Dashboard nuevo para el cliente 📊💼',
            likes: 180,
            cant_comentarios: 3,
            comentarios: [
            {
                id_post: 3,
                id_comentario: 110,
                id_usuario: 7,
                tipo_usuario: 1,
                usuario: 'excel_wizard',
                img_perfil: 'https://randomuser.me/api/portraits/men/40.jpg',
                comentario: '¡Buen diseño! ¿Lo hiciste con Power BI?',
                likes: 4,
                respuestas: [
                {
                    id_post: 3,
                    id_comentario: 209,
                    id_usuario: 4,
                    tipo_usuario: 2,
                    usuario: 'mark_data',
                    img_perfil: 'https://randomuser.me/api/portraits/men/52.jpg',
                    comentario: 'Gracias, esta vez usé Tableau.',
                    likes: 3,
                    fecha: '2025-04-21',
                    hora: '08:10',
                    respuestas: []
                }
                ],
                fecha: '2025-04-20',
                hora: '10:50'
            },
            {
                id_post: 3,
                id_comentario: 111,
                id_usuario: 10,
                tipo_usuario: 2,
                usuario: 'data_fan',
                img_perfil: 'https://randomuser.me/api/portraits/women/33.jpg',
                comentario: '¡Inspirador! ¿Vas a compartir la plantilla?',
                likes: 3,
                respuestas: [
                {
                    id_post: 3,
                    id_comentario: 210,
                    id_usuario: 4,
                    tipo_usuario: 2,
                    usuario: 'mark_data',
                    img_perfil: 'https://randomuser.me/api/portraits/men/52.jpg',
                    comentario: 'Sí, estoy subiéndola a GitHub esta semana.',
                    likes: 2,
                    fecha: '2025-04-21',
                    hora: '11:30',
                    respuestas: []
                }
                ],
                fecha: '2025-04-20',
                hora: '14:00'
            },
            {
                id_post: 3,
                id_comentario: 112,
                id_usuario: 18,
                tipo_usuario: 1,
                usuario: 'sql_master',
                img_perfil: 'https://randomuser.me/api/portraits/men/60.jpg',
                comentario: 'Me encanta la paleta de colores. 👏',
                likes: 2,
                respuestas: [],
                fecha: '2025-04-20',
                hora: '16:45'
            }
            ]
        }
    ]

    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
        const cargarUsuario = async () => {
            const datos = await recuperarStorage('usuario');
            console.log(datos);
            if (datos) {
                setUsuario(datos);
            }
        };
        cargarUsuario();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            {/* DATA */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <Post datos={item}/>
            )}/>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    contenedor_post: {
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    info_usuario: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    foto_usuario: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    nombre: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    imagen_post: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginVertical: 10,
    },
    icono: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    descripcion: {
        marginBottom: 4,
    },

    contenedor_datos_post: {
        flexDirection: 'row',
        gap: 10
    },

    dato_post: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        paddingBottom: 5,
    }
});

