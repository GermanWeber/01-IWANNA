import { API_URL } from "@env";



    export const fetchTrabajadores = async (id_usuario:number) => {
      try {
        const response = await fetch(`${API_URL}fav/trabajadores/${id_usuario}`); 
        
        if (!response.ok) {
          throw new Error('Error al cargar los trabajadores');
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
        
        if (!response.ok) {
          throw new Error('Error al cargar los posts');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };


    export const btnFavPost = async (id_usuario:number, id_post:number) => {
      try {
        const response = await fetch(`${API_URL}fav/create/post/${id_usuario}/user/${id_post}`); 
        
        if (!response.ok) {
          throw new Error('Error al cargar los posts');
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
        const response = await fetch(`${API_URL}fav/create/trabajador/${id_usuario}/user/${id_trabajador}`); 
        
        if (!response.ok) {
          throw new Error('Error al cargar los posts');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        return null;
      } 
    };