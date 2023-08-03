# node-red-edgepi-thermocouple

# node-red-edgepi-thermocouple

## Installation: Node-Red on Debian
Install a supported version of Node.js: https://nodered.org/docs/faq/node-versions
```
    $ sudo apt install curl
    $ curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    $ sudo apt install nodejs
```
   Verify Node.js instalthermocouple: 
```
$ node -v
```
   Verify npm instalthermocouple: 
```
$ npm -v
```
3. Install Node-Red with npm
```
$ cd ~
$ sudo npm install -g --unsafe-perm node-red
```

4. Install Node Red Dashboard
```
$ cd ~/.node-red
$ npm i node-red-dashboard
```

## Installation of this node
```
$ npm install @edgepi-cloud/node-red-edgepi-thermocouple
```

## Running Node-Red
```
$ node-red
```