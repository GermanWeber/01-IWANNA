import { API_URL } from "@env";




    export const fetchTrabajadoresByCategory = async (id: string) => {
      try {
        const response = await fetch(`${API_URL}category/trabajadores/${id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los trabajadores');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        throw new Error('Error al cargar los trabajadores');
      }
    };
    

    export const fetchPostsByCategory = async (id: number) => {
      try {
        const response = await fetch(`${API_URL}category/posts/${id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los posts');
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error:', err);
        throw new Error('Error al cargar los posts');
      }
    };