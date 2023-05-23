module.exports = function(RED) {
    const zmq = require("zeromq")
    // file_path to edgepi-thermocouple bash script for passing commands to Python script
    const executablePath = __dirname + '/edgepi-thermocouple'

    function ThermocoupleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        function inputlistener(msg, send, done) {
            runClient(msg,send);
            if(done) {done()};
        }

        // creates child process instance which will run command located at executablePath
        // with the argument 2 (single-shot sample).

        async function runClient(msg,send)
        {
            const sock = new zmq.Request();
            sock.connect("tcp://localhost:5555");
            await sock.send("2");
            let [result] = await sock.receive();
            result = result.toString();
            result = JSON.parse(result);
            msg.payload = result;
            send(msg
                
                
                
                );
        }

        // called on input to this node
        node.on("input", inputlistener);


        // handle exit from parent process
        node.on("close", function(done) {
            node.status({fill:"grey", shape:"ring", text:"parent process terminated"});
            if (node.child != null) {
                node.finished = done;
                node.child.stdin.write("exit");
                node.child.kill(); 
                node.log("edgepi-thermocouple: exited parent process");
            }
            else { done(); }
        });
    }
    RED.nodes.registerType("edgepi-thermocouple-node", ThermocoupleNode);
}
