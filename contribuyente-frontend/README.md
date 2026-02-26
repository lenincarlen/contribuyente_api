# Portal DGII - Frontend de Contribuyentes

Este proyecto es el frontend (Single-Page Application) para la gestión del listado de contribuyentes de la DGII y su detalle de comprobantes, desarrollado con un enfoque en diseño profesional, estético y optimización de rendimiento.

## 🚀 Tecnologías Principales
- **React 19 + TypeScript**: Para una UI robusta y tipado estricto.
- **Vite**: Como herramienta de compilado ultrarrápida.
- **Tailwind CSS v4**: Para estilos con enfoque en diseño minimalista y editorial (Premium Financial Dashboard).
- **SWR**: Para data-fetching optimizado y caché de consultas del lado del cliente.
- **Lucide React**: Set de íconos consistentes y limpios.
- **React Router v7**: Enrutamiento estructural.

## ⚙️ Requisitos y Ejecución
Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
> **Importante:** El API backend (.NET) debe estar localmente corriendo en el puerto `5097` para que la aplicación muestre la data.

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para entorno productivo
npm run build
```

## 🏗 Arquitectura y Prácticas 
- **Rendimiento Client-Side**: Manejo correcto de estados asíncronos y prevención de *waterfalls* durante los fetches gracias a SWR, usando estados de simulación visual (*skeleton loaders*).
- **Clean Design**: Interfaz minimalista que no satura de información. Manejo deliberado de espacios en blanco y transiciones fluidas diseñadas específicamente para un panel corporativo o de contribuciones.
