# node-red-edgepi-thermocouple

# Using Node Red
If Node-RED is not yet installed, please see instructions for installing Node-RED at https://github.com/osensa/node-red-edgepi-led-array.

# About
This node sets up a multiprocessing environment consisting of the following features:
1. Node runs in parent process (where Node-RED is running), and receives as input an injected value. This injected value can be any value, its purpose is only to signal the Node to trigger a "sample temperature" command to the Python script running in the child process.
2. A child process running a Python script which uses code provided by Steven to sample ambient temperature using the RTU-Thermocouple.
3. The parent process communicates with the child process, allowing the node in the parent process to receive temperature readings and display them in Node-RED.

# Sample Flow and UI Dashboard using thermocouple node and led-trigger node
This sample flow shows the thermocouple node being used to obtain temperature readings, which are then used along with the LED trigger node (https://github.com/osensa/node-red-edgepi-led-array) to toggle an EdgePi LED on/off. Here, the on/off temperature is 23.5 degrees Celsius.
![image](https://user-images.githubusercontent.com/77416463/168665781-9a839a97-b3d2-43c3-abbe-896bff401972.png)

![image](https://user-images.githubusercontent.com/77416463/168665854-7b7ae0b1-4735-44b6-a04f-9f2df7388c4b.png)
