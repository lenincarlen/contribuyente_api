# DGII API - Backend

Este es el backend de la prueba técnica para la DGII, construido con .NET 9.

## Características

- Clean Architecture con separación de capas.
- Inyección de dependencias modular.
- Base de Datos en Memoria (InMemory) para fácil prueba.

## Puntos Extra Implementados

- **Persistencia SQL**: Migrado de base de datos en memoria a **SQL Server real** utilizando Entity Framework Core.
- **Dockerización**: Proyecto completamente dockerizado. Incluye `Dockerfile` para la API y `docker-compose.yml` para orquestar la API y SQL Server.

## Cómo ejecutar con Docker

Para levantar todo el entorno (API + Base de Datos) con un solo comando, ejecuta desde la raíz:

```bash
docker-compose up --build
```

La API estará disponible en `http://localhost:5097` y aplicará las migraciones automáticamente al iniciar.

## Documentación de la API

Si quieres probar los endpoints de manera rápida, he preparado una colección de Postman que ya incluye el ambiente configurado con variables como `{{baseUrl}}` y `{{rncCedula}}`. Solo tienes que importarlos y estarás listo para testear.

Puedes ver la documentación y descargar la colección aquí:
[Postman DGII Test Collection](https://www.postman.com/nest55-6791/workspace/dgii-test/request/22958472-7e3ada7b-767b-463a-8820-75f3b53f2d9a?action=share&creator=22958472&ctx=documentation&active-environment=22958472-60e49b1d-3b67-40b3-a1e3-9fc13952bfef)

¡Espero que te sea de ayuda! 🎉
