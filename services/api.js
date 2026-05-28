// services/api.js

export const fetchBooksAdvanced = async (filtros) => {
  try {
    let query = '';

    // Construcción inteligente de búsqueda
    if (filtros.titulo) {
      query += ` ${filtros.titulo}`;
    }

    if (filtros.autor) {
      query += ` author:${filtros.autor}`;
    }

    if (
      filtros.categoria &&
      filtros.categoria !== 'todas'
    ) {
      query += ` subject:${filtros.categoria}`;
    }

    query = query.trim();

    if (!query) {
      return {
        items: [],
        error:
          'Ingresa al menos un criterio.',
      };
    }

    // URL REAL CORRECTA
    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query
    )}`;

    // Idioma
    if (
      filtros.idioma &&
      filtros.idioma !== 'todos'
    ) {
      const lang =
        filtros.idioma === 'es'
          ? 'spa'
          : 'eng';

      url += `&language=${lang}`;
    }

    // Orden
    if (filtros.orden === 'newest') {
      url += '&sort=new';
    }

    url += '&limit=12';

    console.log('URL FINAL:', url);

    const response = await fetch(url);

    const data = await response.json();

    if (
      !data.docs ||
      data.docs.length === 0
    ) {
      return {
        items: [],
        error:
          'No se encontraron libros.',
      };
    }

    const libros = data.docs.map(
      (item, index) => {
        let descLimpia = '';

        if (
          item.first_sentence &&
          item.first_sentence.length > 0
        ) {
          descLimpia =
            item.first_sentence[0];
        } else {
          descLimpia = `Explora "${item.title ||
            'esta obra'}", una lectura fascinante llena de aventuras y descubrimientos.`;
        }

        const portadaUrl = item.cover_i
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
          : null;

        return {
          id:
            item.key ||
            index.toString(),

          titulo:
            item.title ||
            'Título desconocido',

          autor: item.author_name
            ? item.author_name.join(', ')
            : 'Autor desconocido',

          categoria: item.subject
            ? item.subject
                .slice(0, 2)
                .join(', ')
            : 'General',

          editorial: item.publisher
            ? item.publisher[0]
            : 'Editorial desconocida',

          fecha_publicacion:
            item.first_publish_year
              ? item.first_publish_year.toString()
              : 'Desconocida',

          rating: `${(
            4 +
            Math.random()
          ).toFixed(1)} ⭐`,

          paginas: `${
            item.number_of_pages_median ||
            200
          } págs.`,

          formato:
            index % 2 === 0
              ? 'Físico'
              : 'Digital',

          descripcion: descLimpia,

          portada: portadaUrl,
        };
      }
    );

    return {
      items: libros,
      error: null,
    };
  } catch (error) {
    console.error(error);

    return {
      items: [],
      error:
        'Error de red: ' +
        error.message,
    };
  }
};

export const fetchRecommendations = async (
  autor
) => {
  try {
    if (
      !autor ||
      autor === 'Autor desconocido'
    ) {
      return [];
    }

    const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(
      autor
    )}&limit=5`;

    const response = await fetch(url);

    const data = await response.json();

    if (!data.docs) return [];

    return data.docs.map((item) => ({
      titulo:
        item.title ||
        'Título desconocido',

      ano:
        item.first_publish_year ||
        'Desconocido',
    }));
  } catch (error) {
    return [];
  }
};