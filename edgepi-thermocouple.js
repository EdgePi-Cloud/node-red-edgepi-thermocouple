module.exports = function(RED) {
    const rpc = require("@edgepi-cloud/edgepi-rpc")

    function ThermocoupleNode(config) {
        // Create node with user configs
        RED.nodes.createNode(this, config);
        const node = this;
        const ipc_transport = "ipc:///tmp/edgepi.pipe"
        const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`
        const transport = (config.transport === "Network") ? tcp_transport : ipc_transport;

        // Init new tc
        const tc = new rpc.TcService(transport)
        if (tc){
            console.debug("Thermocouple node initialized on: ", transport);
            node.status({fill:"green", shape:"ring", text:"tc initialized"});
          }

        // Input event listener
        this.on('input', async function (msg, send, done) {
            node.status({fill:"green", shape:"dot", text:"input recieved"});
            try{
                let temps = await tc.singleSample();
                if(config.output === 'cj-lin'){
                    msg.payload = temps
                }
                else{
                    msg.payload = (config.output === 'cj') ? temps[0] : temps[1]
                } 
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
    }
    RED.nodes.registerType("thermocouple", ThermocoupleNode);
}
