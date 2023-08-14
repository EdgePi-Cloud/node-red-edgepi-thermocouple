module.exports = function(RED) {
    const rpc = require("@edgepi-cloud/edgepi-rpc")

    function ThermocoupleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const ipc_transport = "ipc:///tmp/edgepi.pipe"
        const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`
        const transport = (config.transport === "Network") ? tcp_transport : ipc_transport;
        node.Method = config.Method;

        const tc = new rpc.TcService()
        this.on('input', async function (msg, send, done) {
            try{
                let temps = await tc[node.Method]();
                msg.payload = temps;
            }
            catch(err) {
                console.error(err);
                msg.payload = err;
            }
            
            send(msg);
            if (done) {
                done();
            }
        })


        // handle exit
        node.on("close", function(done) {
            node.status({fill:"grey", shape:"ring", text:"tc terminated"});
            
             done();
        });
    }
    RED.nodes.registerType("edgepi-thermocouple-node", ThermocoupleNode);
}
