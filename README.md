# 📚 BookFinder App

Aplicación móvil desarrollada en **React Native con Expo** que permite buscar libros y visualizar su información utilizando la **Google Books API**.

El usuario puede ingresar el nombre de un libro, autor o palabra clave, y la aplicación mostrará una lista de resultados con información relevante como el título, autor, portada y descripción.

---

# 🎯 Objetivo del Proyecto

Desarrollar una aplicación móvil multiplataforma que consuma una API REST pública y muestre información dinámica en una interfaz amigable para el usuario.

Este proyecto forma parte del **Proyecto de Cátedra - Fase 1** de la asignatura:

**Diseño y Programación de Software Multiplataforma**

---

# 🚀 Tecnologías Utilizadas

* React Native
* Expo
* JavaScript / TypeScript
* Axios
* Google Books API
* GitHub
* Figma

---

# 📱 Funcionalidades Principales

* Búsqueda de libros por título o autor
* Visualización de lista de resultados
* Visualización de detalles del libro
* Interfaz sencilla y amigable

---

# 🧩 Estructura del Proyecto

```
BookFinderApp
│
├── app
│   ├── index.tsx
│   ├── splash.tsx
│   ├── results.tsx
│   └── detail.tsx
│
├── components
│
├── assets
│
├── services
│
├── package.json
├── app.json
└── README.md
```

---

# ⚙️ Instalación y Ejecución

1. Clonar el repositorio

```
git clone https://github.com/USUARIO/BookFinderApp.git
```

2. Entrar al proyecto

```
cd BookFinderApp
```

3. Instalar dependencias

```
npm install
```

4. Ejecutar el proyecto

```
npx expo start
```

5. Abrir la aplicación en:

* Emulador Android
* Dispositivo móvil con **Expo Go**
* Navegador web

---

# 🌐 API Utilizada

Se utiliza la **Google Books API** para obtener información de libros.

Ejemplo de petición:

```
https://www.googleapis.com/books/v1/volumes?q=harry+potter
```

Esta API proporciona datos como:

* Título del libro
* Autor
* Imagen de portada
* Descripción
* Editorial
* Fecha de publicación

---

# 🎨 Diseño de Interfaz

El prototipo de la aplicación fue diseñado utilizando **Figma**, incluyendo las siguientes pantallas:

* Splash Screen
* Home Screen
* Resultados de búsqueda
* Detalle del libro

---

# 👨‍💻 Integrantes del Equipo

*Alejandra Cristal Calderón Escobar – CE231635
*Francisco Armando Morales Flores – MF230357
*Daniel Alexander Girón Cornejo – GC221469
*Geisel Gabriela Castellanos Flores – CF231034
*Gladis del Carmen Rivas Miranda – RM191684

---

# 📌 Estado del Proyecto

🚧 En desarrollo – Proyecto académico correspondiente a la **Fase 1** del proyecto de cátedra.

---

# 📄 Licencia

Este proyecto es únicamente para fines educativos.
