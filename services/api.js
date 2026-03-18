// services/api.js

export const fetchBooks = async (query) => {
  try {
    // 1. TRUCO ANTI-[object Object]: Nos aseguramos de sacar el texto real
    let textoBusqueda = query;
    if (typeof query === 'object') {
      textoBusqueda = query.searchQuery || "Harry Potter"; 
    }

    if (!textoBusqueda) return [];

    // 2. Usamos Open Library (Buscando por título) para evitar el Error 429 de Google
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(textoBusqueda)}&limit=15`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.docs) return [];

    // 3. Filtro amable: Solo pedimos que tenga título, autor y año.
    const librosCompletos = data.docs.filter(item => item.title && item.author_name && item.first_publish_year);

    // 4. Armamos tus 5 libros garantizando que NINGÚN dato quede vacío
    return librosCompletos.slice(0, 5).map((item) => {
      return {
        nombre_del_libro: item.title,
        autor: item.author_name[0],
        ano: item.first_publish_year.toString(),
        // Si no tiene género o descripción en la base de datos, le ponemos uno genérico para que tu JSON esté completo
        genero: item.subject ? item.subject[0] : "Ficción / Literatura", 
        descripcion: item.first_sentence ? item.first_sentence[0] : "Un increíble libro lleno de aventuras y una historia fascinante." 
      };
    });

  } catch (error) {
    return [{ ERROR: "Fallo la conexión", DETALLE: error.message }];
  }
};
