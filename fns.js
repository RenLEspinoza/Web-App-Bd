// afn Insertar un nuevo usuario en la base de datos
async function insertUser(firstName, lastName, phoneNumber, email) {
  try {
    const query = `
      INSERT INTO users (first_name, last_name, phone_number, email)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE
      SET preferencias = EXCLUDED.preferencias
      RETURNING *;
    `;
    const values = [firstName, lastName, phoneNumber, email];
    const result = await pool.query(query, values);

    console.log("Usuario insertado o actualizado con exito:");
    console.log( `ID: ${result.rows[0].id}`);
    console.log(`Nombre: ${result.rows[0].first_name} ${result.rows[0].last_name}`);
    console.log(`Teléfono: ${result.rows[0].phone_number}`);
    console.log(`Email: ${result.rows[0].email}`);
  } catch (error) {
    console.error("Error al insertar o actualizar el usuario:", error.message);
  }
}


// afn Obtener un usuario por email
async function getUserByEmail(email) {
  try {
    const query = {
      text: "SELECT * FROM users WHERE email = $1;",
      values: [email],
    };

    const result = await pool.query(query;
      if (result.rows.length > 0) {
        console.log(`No se encontro el usuario con email: ${email}`);
        return;
      }

    console.log("Usuario encontrado con Prepared Statement:");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Error en la consulta:", error.message);
  }
}
    


// afn Obtener usuario con DatkTheme
async function getUserByDartkTheme() {
  try {
    const query = `
      SELECT id, first_name, last_name, phone_number, email
      FROM users
      WHERE preferencias->>'darkTheme' = '$1';
    `;

    const result = await pool.query(query, ["dark"]);

    console.log(`Usuarios con darkTheme activado: ${result.rowCount}`);
    return result.rows;
  } catch (error) {
    console.error("Error en la consulta:", error.message);
    return [];
  }
}



// afn Listar usuarios formateados
async function listFormattedUsers() {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id;");

    connsole.log("LISTA DE USUARIOS");
    console.log("--------------------------------------------------");

    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
      console.log(`   Teléfono: ${user.phone_number}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Preferencias: ${JSON.stringify(user.preferencias)}`);
      console.log("--------------------------------------------------");

      if (user.preferencias) {
        Object.entries(user.preferencias).forEach(([key, value]) => {
          console.log(`   * ${key}: ${value}`);
        });

      } else {
        console.log("   Preferencias: Ninguna");
      }
    });
    console.log(`total: ${result.rowCount} usuarios\n`);
  } catch (error) {
    console.error("Error al listar usuarios:", error.message);
  }   
}

