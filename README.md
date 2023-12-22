# node-red-edgepi-thermocouple

## EdgePi thermocouple node

EdgePi thermocouple node that reads temperature on input received.

## Install

Install normally through the node-red editor or install with npm in your node-red directory
(typically located at `~/node.red`) by running the following command:

```
npm install @edgepi-cloud/node-red-edgepi-digital-thermocouple
```

### Properties

- **RPC Server**: The connection to your EdgePi's RPC Server.
- **Output**: What temperature reading(s) will be sent out through the flow.

### Inputs

- **payload** _string_: The output type. 'lin' for Linearized Temperature, 'cj' for Cold-Junction
  Temperature, 'cj-lin' for Cold Junction & Linearized Temperature.

Example input:
```
msg {
  "payload": "cj-lin"
}
```

### Outputs

- When configured to read linearized temperature:
  - **payload** _number_: Regular temperature reading.
- When configured to read cold junction temperature:
  - **payload** _number_: Temperature reading of the cold junction sensor.
- When configured to read both cold junction and linearized temperature:
  - **payload** _array[coldJunctionTemp, linearizedTemp]_: An array containing both the cold junction and linearized temperature.

Example output:
```
msg {
  "payload": [24.1875, 23.0703125]
}
```