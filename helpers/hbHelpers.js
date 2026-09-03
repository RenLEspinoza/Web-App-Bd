const pool = require("../config/db");

const registrarHelpers = (hbs) => {
  hbs.registerHelper("statusBadge", function (estado) {
    if (estado === "OK" || estado === "Operativo") {
      return new hbs.SafeString(`
        <span class="badge badge-success">
          <span class="status-dot dot-online"></span> ${estado}
        </span>
      `);
    } else {
      return new hbs.SafeString(`
        <span class="badge badge-danger">
          <span class="status-dot dot-offline"></span> ${estado}
        </span>
      `);
    }
  });
};

module.exports = { registrarHelpers };
