# Web-App-Bd - Aplicación Web para Gestión de Usuarios y Datos (PostgreSQL & Sequelize)

Evolución del sistema backend desarrollado con Node.js y Express. En esta etapa se integró la capa de persistencia utilizando **PostgreSQL** y se implementó **Sequelize ORM** para el mapeo objeto-relacional, permitiendo gestionar relaciones complejas (1:1 y 1:N) con _eager loading_, consultas optimizadas y control de datos sensibles.

---

## 📋 Requisitos del Sistema

- **Node.js** (v18.x o superior)
- **npm** (gestor de paquetes de Node.js)
- **PostgreSQL** (instancia local o en la nube en ejecución)
- Cliente de pruebas HTTP (Postman, Thunder Client o Navegador)

---

## 🛠️ Instalación y Configuración

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone [https://github.com/RenLEspinoza/Web-App.git](https://github.com/RenLEspinoza/Web-App-Bd.git)
   cd web-app-bd
   ```

## 🛠️ Stack de Dependencias

- **Express** (`^5.2.1`): Framework web backend.
- **Sequelize** (`^6.37.8`) & **pg** / **pg-hstore**: ORM y driver de conexión para PostgreSQL.
- **dotenv** (`^17.4.2`): Gestión de variables de entorno.
- **hbs** (`^4.2.1`): Motor de plantillas Handlebars.
- **nodemon** (`^3.1.14`): Dependencia de desarrollo para reinicio automático.

## 🛠️ Configurar variables de entorno (.env)

```
DB_NAME=tu_base_de_datos

DB_USER=tu_usuario

DB_PASS=tu_contraseña

DB_HOST=localhost

DB_PORT=5432

DB_DIALECT=postgres`

PORT=3000
```

## Ejecutar la aplicación

**Modo desarrollo (auto-reload con nodemon):**

```bash
npm run dev
```

**Modo producción**

```bash
npm start
```

**Servidor disponible en:** http://localhost:3000

## 🚀 Ejemplos de Uso y Rutas (API REST con Sequelize)

| Método   | Ruta                      | Descripción                                                                       | Tipo de Respuesta |
| :------- | :------------------------ | :-------------------------------------------------------------------------------- | :---------------- |
| **GET**  | `/usuarios/orm-users`     | Obtiene todos los usuarios omitiendo campos sensibles (`password`, `telefono`)    | JSON              |
| **GET**  | `/usuarios/orm-users/:id` | Obtiene un usuario por ID con sus datos anidados (_Perfil_, _Cuenta_ y _Pedidos_) | JSON Ordenado     |
| **POST** | `/usuarios/orm-users`     | Crea un usuario completo junto con sus entidades asociadas en una sola operación  | JSON              |

## 📁 Estructura del Proyecto

```
web-app-bd/
├── config/
│   ├── db.js                    # Configuración y conexión a la base de datos
│   └── sequelize.js             # Configuración e instancia de Sequelize
│
├── controllers/
│   ├── appController.js         # Funciones de la app básicas
│   ├── transferController.js    # Funciones de transferencia
│   ├── userControllerORM.js     # Funciones con ORM
│   └── userController.js        # Funciones SQL Manual
│
├── helpers/
│   ├── hbHelpers.js             #
│   ├── loggerHelper.js          # Registro de acceso a la app básica
│   ├── retryHelper.js           # Auxiliares de reintento
│   └── validators.js            # Auxiliar de validación
│
├── middlewares
│   └── loggerMiddleware.js      # Registro HTTP
│
├── models/
│   ├── index.js                 # Definición e inicialización de asociaciones
│   ├── Usuario.js               # Modelo principal Usuario
│   ├── Perfil.js                # Modelo Perfil (1:1 con Usuario)
│   ├── Cuenta.js                # Modelo Cuenta (1:1 con Usuario)
│   └── Pedido.js                # Modelo Pedido (1:N con Usuario)
│
├── routes/
│   ├── router.js                # Rutas básicas de la aplicación
│   ├── transferRoutes.js        # Ruta de transferencia SQL Manual
│   └── userRoutes.js            # Rutas generales incluyendo ORM
│
├── services/
│   ├── cuentaServices.js        # Auxiliares de funciones SQL Manual
│   └── userService.js           # Registro de usuario con cuenta SQL Manual
│
├── src/
│   └── app.js                   # Configuración de la Aplicación
│
├── utils/
│   └── logger.js                # Registro de acceso y registro de errores en .txt
│
├── views/
│   └── index.hbs                # Plantilla de Handlebars
│
├── .env                         # Variables de entorno (excluido de Git)
├── .gitignore
├── error.txt                    # Registro de errores de transacción en texto plano
├── log.txt                      # Registro de entradas a la app en texto plano
├── server.js                    # Punto de entrada a la aplicación
├── readme.md
└── package.json                 # Dependencias y scripts
```

# 🏛️ Justificación y Reflexión Técnica

## 🔗 Modelado de Relaciones con Sequelize ORM

### Se diseñó un esquema relacional centrado en la entidad Usuario, asociando múltiples modelos para estructurar la información del sistema:

```
**Relación (1:1) Usuario - Perfil:** Un usuario cuenta con una única ficha de perfil.
**Relación (1:1) Usuario - Cuenta:** Un usuario posee un registro único de cuenta.
**Relación (1:N) Usuario - Pedidos:** Un usuario puede registrar múltiples pedidos dentro de la plataforma.
```

## 🛡️ Protección de datos sensibles en consultas

```
**Para cumplir con estándares de seguridad básica, se aplicó la opción "attributes":**
 { exclude: ["password", "telefono"] } directamente desde el ORM al realizar consultas masivas.
 Esto asegura que datos confidenciales no sean transmitidos al cliente en la respuesta JSON.
```

## ⚡ Carga anidada (Eager Loading) con "include"

```
**Para la obtención de un usuario especifico (/usuarios/orm-users/:id),** se implemento la propiedad includee se Sequelize.
Esto ejecuta una consulta optimizada a nivel de base de datos para retornar el usuario junto con sus objetos y arreglos
asociados en una estructura JSON ordenada, evitando realizar peticiones fragmentadas.
```

## 📷 Screens entregables

### Obtención de usuarios SQL Manual A

![Obtención de usuarios SQL Manual](/assets/images/getUsuarios-SQLM-A.png)

### Obtención de usuarios SQL Manual B

![Obtención de usuarios SQL Manual](/assets/images/getUsuarios-SQLM-B.png)

### Eliminar usuario SQL Manual A

![Eliminar usuario SQL Manual](/assets/images/eliminarUsuario-SQLM-A.png)

### Eliminar usuario SQL Manual B

![Eliminar usuario SQL Manual](/assets/images/eliminarUsuario-SQLM-B.png)

### Actualizar email SQL Manual

![Actualizar email SQL Manual](/assets/images/actualizarEmail-SQLM.png)

### COMMIT en creación de cuenta y saldo SQL Manual

![COMMIT en creación de cuenta y saldo SQL Manual](/assets/images/commit-cuenta+saldo-SQLM.png)

### Error con Rollback SQL Manual

![Error Rollback SQL Manual](/assets/images/error-rollback-SQLM.png)

### Obtener usuarios con ORM

![Obtener usuarios con ORM](</assets/images/ORM-USER%20(L5).png>)

### Obtener usuarios sin campos sensibles

![Obtención de Usuarios sin campos sensibles](/assets/images/GetUsuarios-ORM.png)

### Obtener usuarios con datos anidados

![Consulta de Usuarios con datos anidados](/assets/images/usuario-anidados.png)

### Obtener usuarios con datos anidados resultado en consola

![Consulta d Usuarios con datos anidados resultado consola](/assets/images/usuario-anidados-console.png)

### Creación de Usuario completo con sus relaciones

![Creación de Usuario completo con sus relaciones](/assets/images/create-usuario-relaciones.png)

## Justificaciones de decisiones sobre la aplicación durante el desarrollo.

### ✨ Justificación de elección de "pg" como cliente de conexión.

Decidi elegir el paquete "pg" para conectarme a la base de datos, porque es la librería nativa oficial más rápida y liviana para conectar Node.js con PostgreSQL, (la base de datos la hice en PostgreSQL) además, soporta promesas (async/await) y consultas parametrizadas contra inyección SQL.

### ✨ Estrategia de conexión.

Decidi utilizar "new Pool()" en lugar de un Client único porque la aplicación requiere manejar múltiples peticiones concurrentes.
El pool administra automáticamente la reutilización de conexiones sin saturar la base de datos abriendo y cerrando una conexión por cada request.

### ✨ Protección de datos sensibles.

Se concreta la protección de datos sensibles de conexión a traves del uso de variables de entorno (dotenv),
cargando las variables de entorno desde un archivo .env, protegiendo las credenciales o datos sensibles de ser expuestos en el código fuente.

### ✨ Modificación / Actualización de campos especificos (CRUD)

**Seguridad y privacidad:** Campos como la contraseña no deben exponerse ni modificarse accidentalmente en peticiones comunes de usuario o perfil.
Separar las actualizaciones en endpoints específicos (o usando PATCH) evita sobreescribir datos sensibles por error.

**Eficiencia en la base de datos:** Al actualizar un dato puntual (como el email o el teléfono), la consulta SQL ejecuta solo el cambio necesario
(UPDATE usuarios SET email = $1),lo que reduce la sobrecarga de datos innecesarios.

**Diseño RESTful y flexibilidad de UI:** Permite que la aplicación web o móvil edite campos de forma independiente desde la interfaz de usuario (por ejemplo, un botón dedicado a "Cambiar email" o "Cambiar teléfono") sin requerir que el cliente envíe todo el objeto del usuario nuevamente.

### ✨ Validaciones aplicadas para evitar erroes (CRUD)

**Validación de payload/cuerpo de la petición (400 Bad Request):** Comprobación previa de que el campo obligatorio venga presente en req.body antes de consultar la base de datos (por ejemplo, verificar si !email).

**Verificación de existencia en base de datos (404 Not Found):** Evaluación de result.rowCount === 0 inmediatamente después de la consulta SQL para asegurar que el ID especificado en la URL pertenezca a un usuario registrado.

**Control de excepciones global (500 Internal Server Error):** Bloque try/catch para capturar cualquier falla en la conexión con la base de datos o errores en la ejecución de la consulta SQL, evitando que el servidor colapse.

**Protección de datos sensibles en la respuesta:** Limpieza del objeto retornado mediante rest operator (const { contraseña, telefono...usuarioProcesado } = result.rows[0]), evitando filtrar contraseñas o hashes hacia el cliente.

### ✨ SQL manual vs Sequelize

**Usar SQL manual** es como construir las consultas letra por letra escribiendo cadenas de texto, donde hay que cuidar cada comilla y encargarse manualmente de la seguridad para evitar inyecciones de código. **Descubrir Sequelize cambia esa dinámica por completo:** en lugar de pelear con la sintaxis de SQL, interactúas con la base de datos usando métodos u objetos de JavaScript nativos que devuelven resultados listos para manipular. Aunque al inicio cuesta un poco adaptar la lógica para consultas muy complejas, para el trabajo diario agiliza muchísimo el desarrollo y deja el código mil veces más limpio.

### ✨ Ventajas del ORM vs SQL tradicional

Personalmente despues de que me costo bastante tomar ritmo a SQL Manual, puedo decir con claridad que usar ORM (Sequelize) es mucho mas ligero e intuitivo,
el código en si se ve mucho mas ordenado y facil de leer que con SQL Manual, siento que para el dia a dia Sequelize puede agilizar el desarrollo
y SQL Manual ofrece control absoluto en detalle en proyectos mas complejos o masivos.

## 🤖 Declaración de uso de IA y Referencias

**El desarrollo este módulo se fundamento en los contenidos y pautas entregadas durante las clases**

**Se utilizo Gemini de Google como asistente de apoyo técnico para:**

**Resolución de sintaxis**: Corrección de estructura de parametros en findAll() y revisión de llaves y parentesis en controladores.

**Estrategia de anidamiento**: Orientación técnica para responder con datos anidados en formato JSON ordenado mediante eager loading (include).

**Formato y documentación**: Estructuración y redacción en Markdown para el archivo README.md
