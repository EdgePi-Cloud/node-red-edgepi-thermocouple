# node-red-edgepi-thermocouple

# Using Node Red
If Node-RED is not yet installed, please see instructions for installing Node-RED at https://github.com/osensa/node-red-edgepi-led-array.

# About
This node sets up a multiprocessing environment consisting of the following features:
1. Node runs in parent process (where Node-RED is running), and receives as input an injected value. This injected value can be any value, its purpose is only to signal the Node to trigger a "sample temperature" command to the Python script running in the child process.
2. A child process running a Python script which uses code provided by Steven to sample ambient temperature using the RTU-Thermocouple.
3. The parent process communicates with the child process, allowing the node in the parent process to receive temperature readings and display them in Node-RED.

# Sample Flow and UI Dashboard using thermocouple node and led-trigger node
This sample flow shows the thermocouple node being used to obtain temperature readings, which are then used along with the LED trigger node (https://github.com/osensa/node-red-edgepi-led-array) to toggle an EdgePi LED on/off. Here, the on/off temperature is 24.5 degrees Celsius.
![image](https://user-images.githubusercontent.com/77416463/168688664-a7c5646e-a811-49d5-a6bd-0015b8b9d99d.png)

![image](https://user-images.githubusercontent.com/77416463/168688751-14f4eef6-b45b-4bfd-a072-582adcf61c7d.png)
