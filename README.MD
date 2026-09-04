# Parte 1

### ✨ Justificación de elección de "pg" como cliente de conexión.

Decidi elegir el paquete "pg" para conectarme a la base de datos, porque es la librería nativa oficial más rápida y liviana para conectar Node.js con PostgreSQL, (la base de datos la hice en PostgreSQL) además, soporta promesas (async/await) y consultas parametrizadas contra inyección SQL.

### ✨ Estrategia de conexión.

Decidi utilizar "new Pool()" en lugar de un Client único porque la aplicación requiere manejar múltiples peticiones concurrentes.
El pool administra automáticamente la reutilización de conexiones sin saturar la base de datos abriendo y cerrando una conexión por cada request.

### ✨ Protección de datos sensibles.

Se concreta la protección de datos sensibles de conexión a traves del uso de variables de entorno (dotenv),
cargando las variables de entorno desde un archivo .env, protegiendo las credenciales o datos sensibles de ser expuestos en el código fuente.

### ✨ Modificación / Actualización de campos especificos (CRUD)

**Seguridad y privacidad:** Campos como la contraseña (password_hash) no deben exponerse ni modificarse accidentalmente en peticiones comunes de perfil.
Separar las actualizaciones en endpoints específicos (o usando PATCH) evita sobreescribir datos sensibles por error.

**Eficiencia en la base de datos:** Al actualizar un dato puntual (como el email o el teléfono), la consulta SQL ejecuta solo el cambio necesario
(UPDATE usuarios SET email = $1),lo que reduce la sobrecarga de datos innecesarios.

**Diseño RESTful y flexibilidad de UI:** Permite que la aplicación web o móvil edite campos de forma independiente desde la interfaz de usuario (por ejemplo, un botón dedicado a "Cambiar email" o "Cambiar teléfono") sin requerir que el cliente envíe todo el objeto del usuario nuevamente.

### ✨ Validaciones aplicadas para evitar erroes (CRUD)

**Validación de payload/cuerpo de la petición (400 Bad Request):** Comprobación previa de que el campo obligatorio venga presente en req.body antes de consultar la base de datos (por ejemplo, verificar si !email).

**Verificación de existencia en base de datos (404 Not Found):** Evaluación de result.rowCount === 0 inmediatamente después de la consulta SQL para asegurar que el ID especificado en la URL pertenezca a un usuario registrado.

**Control de excepciones global (500 Internal Server Error):** Bloque try/catch para capturar cualquier falla en la conexión con la base de datos o errores en la ejecución de la consulta SQL, evitando que el servidor colapse.

**Protección de datos sensibles en la respuesta:** Limpieza del objeto retornado mediante rest operator (const { password_hash, ...usuarioProcesado } = result.rows[0]), evitando filtrar contraseñas o hashes hacia el cliente.

# Parte 5

### ✨ SQL manual vs Sequelize

**Usar SQL manual** es como construir las consultas letra por letra escribiendo cadenas de texto, donde hay que cuidar cada comilla y encargarse manualmente de la seguridad para evitar inyecciones de código. **Descubrir Sequelize cambia esa dinámica por completo:** en lugar de pelear con la sintaxis de SQL, interactúas con la base de datos usando métodos u objetos de JavaScript nativos que devuelven resultados listos para manipular. Aunque al inicio cuesta un poco adaptar la lógica para consultas muy complejas, para el trabajo diario agiliza muchísimo el desarrollo y deja el código mil veces más limpio.

### ✨ Ventajas del ORM vs SQL tradicional

Personalmente despues de que me costo bastante tomar ritmo a SQL Manual, puedo decir con claridad que usar ORM (Sequelize) es mucho mas ligero e intuitivo,
el código en si se ve mucho mas ordenado y facil de leer que con SQL Manual, siento que para el dia a dia Sequelize puede agilizar el desarrollo
y SQL Manual ofrece control absoluto en detalle.
