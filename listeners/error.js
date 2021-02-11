const { Listener } = require("discord-akairo");

class ErrorListener extends Listener {
  constructor() {
    super("error", { emitter: "client", event: "error" });
  }

  exec() {
    console.error;
  }
}

module.exports = ErrorListener;
