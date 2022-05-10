module.exports = function(RED) {
    const spawn = require('child_process').spawn;

    // file_path to edgepi-thermocouple bash script for passing commands to Python script
    const executablePath = __dirname + '/edgepi-thermocouple'

    sampleCommand = 2;

    function ThermocoupleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function inputlistener(msg, send, done) {
            if (node.child != null) {
                // send input to child process using stdin (Py script)
                node.child.stdin.write(sampleCommand+"\n", () => {
                    if (done) { done(); }
                });
                node.status({fill:"green", shape:"ring", text:"connected to child"});
            }
            else {
                // logs error to Node-RED's console.
                node.error(RED._("edgepi-thermocouple.errors.pythoncommandnotfound"), msg);
                node.status({fill:"red", shape:"ring", text:"disconnected from child"});
            }
        }

        // creates child process instance which will run command located at executablePath
        // with the argument 2 (single-shot sample).
        node.child = spawn(executablePath, [sampleCommand]);

        // called on input to this node
        node.on("input", inputlistener);

        // listen to output from child process
        node.child.stdout.on('data', function (data) {
            node.log("out: " + data + " :");
            // to-do: add logic for processing output temperature reading
        });

        node.child.stderr.on('data', function (data) {
            node.log("err: "+ data + " :");
        });

        // handle exit from child process
        node.child.on("close", function(data) {
            node.child = null;
            node.finished();
        });

        // handle exit from parent process
        node.on("close", function(done) {
            if (node.child != null) {
                node.child.stdin.write("closing");
                node.child.kill('SIGKILL');
            }
            else { done(); }
        });
    }
    RED.nodes.registerType("edgepi-thermocouple-node", ThermocoupleNode);
}