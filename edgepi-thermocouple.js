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
                node.status({fill:"green", shape:"dot", text:"input to child sent"});
                node.log(`edgepi-thermocouple: sent input to child: ${msg.payload}`);
            }
            else {
                // logs error to Node-RED's console.
                node.status({fill:"red", shape:"ring", text:"disconnected from child"});
                node.error(RED._("edgepi-thermocouple:error:"), msg);
            }
        }

        // creates child process instance which will run command located at executablePath
        // with the argument 2 (single-shot sample).
        node.child = spawn(executablePath, [sampleCommand]);

        // to-do: handle spawn error
        
        node.child ? node.status({fill:"green", shape:"ring", text:"connected to child"}) :
        node.status({fill:"red", shape:"ring", text:"connection to child failed"});

        // called on input to this node
        node.on("input", inputlistener);

        // listen to output from child process
        node.child.stdout.on('data', function (data) {
            node.log(`edgepi-thermocouple: child output: ${data}`);
            // to-do: add logic for processing output temperature reading
        });

        node.child.stderr.on('data', function (data) {
            node.error(RED._("edgepi-thermocouple:error:child error:"), data);
        });

        // handle exit from child process
        node.child.on("close", function(code) {
            node.child = null;
            node.status({fill:"grey",shape:"ring",text:"child process closed."});
            if (node.finished) {
                node.finished();
                node.log(`edgepi-thermocouple: child process exit code: ${code}`);
            }
            else {
                node.status({fill:"red",shape:"ring",text:"parent process stopped"});
                node.error(RED._(`edgepi-thermocouple:error: ${code}`));
            }
        });

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