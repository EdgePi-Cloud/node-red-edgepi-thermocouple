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

Any message can be used to trigger this node.

### Outputs

- **payload** _number_: TC temperature reading.
