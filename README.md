# node-red-contrib-nordic-thingy

NordicSemi Thingy nodes for node-red.

This node lets you use the Thingy - a multi-sensor Bluetooth development kit from NordicSemi - inside you IOT flows.

![Nordi Thingy 52](https://www.nordicsemi.com/var/ezwebin_site/storage/images/media/images/products/nordic-thingy-52/2129008-1-eng-GB/Nordic-Thingy-52_imagelarge.jpg)

## Requirements

1. noble 1.8.1 
1. node-red 0.17.5

## Install via NPM
From inside your node-red directory: 

`npm install red-contrib-nordic-thingy`

## Features

* Periodically scans for new Thingy device
* Write custom scan filters
* Enable or disable the sensors in the node configuration
* Send sensor readings by topic
* Easy identification of the connected devices from the UI
