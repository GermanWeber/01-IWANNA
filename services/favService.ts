import { API_URL } from "@env";



    export const fetchEstadoLikePost = async (id_usuario:number, id_post:number) => {
      try {
        const response = await fetch(`${API_URL}fav/isliked/user/${id_usuario}/post/${id_post}`); 
        
        if (!response.ok) {
          throw new Error('Error al cargar el estado del like del post');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };

    export const fetchEstadoLikeTrabajador = async (id_usuario:number, id_trabajador:number) => {
      try {
        const response = await fetch(`${API_URL}fav/isliked/user/${id_usuario}/trabajador/${id_trabajador}/`); 
        
        if (!response.ok) {
          throw new Error('Error al cargar el estado del like del trabajador');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };


    export const fetchLikesPosts = async (id_post:number) => {
      try {
        const response = await fetch(`${API_URL}fav/likes/post/${id_post}`); 
        
        if (!response.ok) {
          console.error('Error al cargar los likes del post');
          return null;
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };

    export const fetchLikesTrabajadores = async (id_usuario:number) => {
      try {
        const response = await fetch(`${API_URL}fav/likes/trabajador/${id_usuario}`); 
        
        if (!response.ok) {
          console.error('Error al cargar los likes del trabajador');
          return null;
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };

    export const fetchFavTrabajadores = async (id_usuario:number) => {
      try {
        const response = await fetch(`${API_URL}fav/trabajadores/${id_usuario}`); 
        
        if (response === null) {
          console.error('Error al cargar los trabajadores de favoritos');
          return null;
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };


    export const fetchPosts = async (id_usuario:number) => {
      try {
        const response = await fetch(`${API_URL}fav/posts/${id_usuario}`); 
        
        if (response === null) {
          console.error('Error al cargar los posts de favoritos');
          return null;
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };


    export const btnFavPost = async (id_post:number, id_usuario:number) => {
      console.log('Datos recibidos en btnFavPost: post:',id_post, 'usuario:', id_usuario);
      try {
        const response = await fetch(`${API_URL}fav/create/post/${id_post}/user/${id_usuario}`); 
        
        if (!response.ok) {
          throw new Error('Error al apretar el boton de agregar a favoritos');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };

    export const btnFavTrabajador = async (id_usuario:number, id_trabajador:number) => {
      try {
        const response = await fetch(`${API_URL}fav/create/trabajador/${id_trabajador}/user/${id_usuario}`); 
        
        if (!response.ok) {
          throw new Error('Error al apretar el boton de agregar a favoritos');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };