module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  const initializeNode = (config) => {
    const transport =
      config.transport === "Network"
        ? `tcp://${config.tcpAddress}:${config.tcpPort}`
        : "ipc:///tmp/edgepi.pipe";

    try {
      const tc = new rpc.TcService(transport);
      console.debug("Thermocouple node initialized on: ", transport);
      node.status({ fill: "green", shape: "ring", text: "tc initialized" });
      return tc;
    } catch (error) {
      console.error(error);
      node.status({
        fill: "red",
        shape: "ring",
        text: "Initialization error.",
      });
    }
  };

  const ThermocoupleNode = (config) => {
    RED.nodes.createNode(this, config);
    const node = this;
    let output = config.output;

    initializeNode(config).then((tc) => {
      this.on("input", async function (msg, send, done) {
        node.status({ fill: "green", shape: "dot", text: "input recieved" });
        try {
          output = msg.payload || output;
          let temps = await tc.singleSample();
          // if (output === "cj-lin") {
          //   msg.payload = temps;
          // } else {
          //   msg.payload = output === "cj" ? temps[0] : temps[1];
          // }
          if (output === "lin") {
            msg.payload = temps;
          }
        } catch (err) {
          console.error(err);
          msg.payload = err;
        }

        send(msg);
        done?.();
      });
    });
  };
  RED.nodes.registerType("thermocouple", ThermocoupleNode);
};
