module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function ThermocoupleNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    initializeNode(config).then((tc) => {
      this.on("input", async function (msg, send, done) {
        node.status({ fill: "green", shape: "dot", text: "input received" });
        try {
          let temps = await tc.singleSample();
          msg.payload = temps[1];
        } catch (err) {
          console.error(err);
          msg.payload = err;
        }
        send(msg);
        done?.();
      });
    });

    async function initializeNode(config) {
      const transport =
        config.transport === "Network"
          ? `tcp://${config.tcpAddress}:${config.tcpPort}`
          : "ipc:///tmp/edgepi.pipe";

      try {
        const tc = new rpc.TcService(transport);
        console.debug("Thermocouple node initialized on: ", transport);
        node.status({ fill: "green", shape: "ring", text: "TC initialized" });
        return tc;
      } catch (error) {
        console.error(error);
        node.status({
          fill: "red",
          shape: "ring",
          text: "Initialization error.",
        });
      }
    }
  }
  RED.nodes.registerType("thermocouple", ThermocoupleNode);
};
