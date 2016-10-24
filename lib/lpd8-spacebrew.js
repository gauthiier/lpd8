'use strict';

var lpd8 = require('./lpd8.js');
var sb = require('spacebrew');

// this should config file
const server = 'localhost';
const name = 'lpd8';
const desc = 'lpd8 midi controller';

class LPD8_SB {

	constructor(lpd8) {

		this.lpd8 = lpd8;
        this.client = new sb.Client(server, name, desc); 

		var i;
		for(i in lpd8.PADS) {
			let pad = lpd8.PADS[i];
			let padname = 'PAD' + pad.nbr;
			this.client.addPublish(padname, 'boolean', false);
		}

		for(i in lpd8.KONTROLS) {
			let k = lpd8.KONTROLS[i];
			let kname = 'K' + k.nbr;
			this.client.addPublish(kname, 'range', 0);
		}

        this.client.connect();

	}

	// rest params
	signal(...params) {

		// weird.. params = [[]]
		params = params[0];

		switch(params[0])
		{
			case 'pad':
				// 'pad', this.nbr, this.note, this.state, this.vel, this.dt				
				let padname = 'PAD' + params[1];
				this.client.send(padname, 'boolean', params[3]);
				break;
			case 'k':
				// 'k', this.nbr, this.cc, this.kv, this.dt
				let kname = 'K' + params[1];
				this.client.send(kname, 'range', params[3]);
				break;
			default:
				break;
		}

	}
}

module.exports.LPD8_SB = LPD8_SB;
