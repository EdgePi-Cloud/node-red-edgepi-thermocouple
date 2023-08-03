module.exports = function(RED) {
    const rpc = require("@edgepi-cloud/edgepi-rpc")

    function ThermocoupleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.Method = config.Method;
        console.log(node.Method)
        const tc = new rpc.TcService()
        this.on('input', async function (msg, send, done) {
            try{
                if(node.Method){
                    let temps = await tc[node.Method]();
                    msg.payload = temps;
                }
                else{
                    msg.payload = "Select a method for edgepi thermocouple"
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
