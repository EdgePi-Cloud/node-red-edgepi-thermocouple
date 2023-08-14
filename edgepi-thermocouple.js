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
        const tc = new rpc.TcService()
        if (tc){
            console.debug("Thermocouple node initialized on: ", transport);
            node.status({fill:"green", shape:"ring", text:"d-out initialized"});
          }

        // Input event listener
        this.on('input', async function (msg, send, done) {
            try{
                let temps = await tc.singleSample();
                if(config.output === 'cj-lin'){
                    msg.payload = temps
                }
                else{
                    msg.payload = (config.output === 'cj') ? output[0] : output[1]
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


        // handle exit
        node.on("close", function(done) {
            node.status({fill:"grey", shape:"ring", text:"tc terminated"});
            
             done();
        });
    }
    RED.nodes.registerType("edgepi-thermocouple-node", ThermocoupleNode);
}
