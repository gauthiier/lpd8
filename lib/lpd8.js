
'use strict';

var fs = require('fs');

// midi
const NOTEOFF = 0x80;
const NOTEON = 0x90;
const KCHANGE = 0xB0;

// akai's third ocatave config
var lpd8_midi_notes = { 0x0: "C-2", 0x1: "C#-2", 0x2: "D-2", 0x3: "D#-2", 0x4: "E-2", 0x5: "F-2", 
                        0x6: "F#-2", 0x7: "G-2", 0x8: "G#-2", 0x9: "A-2", 0xA: "A#-2", 0xB: "B-2", 
                        0xC: "C-1", 0xD: "C#-1", 0xE: "D-1", 0xF: "D#-1", 0x10: "E-1", 0x11: "F-1", 
                        0x12: "F#-1", 0x13: "G-1", 0x14: "G#-1", 0x15: "A-1", 0x16: "A#-1", 0x17: "B-1", 
                        0x18: "C0", 0x19: "C#0", 0x1A: "D0", 0x1B: "D#0", 0x1C: "E0", 0x1D: "F0", 
                        0x1E: "F#0", 0x1F: "G0", 0x20: "G#0", 0x21: "A0", 0x22: "A#0", 0x23: "B0", 
                        0x24: "C1", 0x25: "C#1", 0x26: "D1", 0x27: "D#1", 0x28: "E1", 0x29: "F1", 
                        0x2A: "F#1", 0x2B: "G1", 0x2C: "G#1", 0x2D: "A1", 0x2E: "A#1", 0x2F: "B1", 
                        0x30: "C2", 0x31: "C#2", 0x32: "D2", 0x33: "D#2", 0x34: "E2", 0x35: "F2", 
                        0x36: "F#2", 0x37: "G2", 0x38: "G#2", 0x39: "A2", 0x3A: "A#2", 0x3B: "B2", 
                        0x3C: "C3", 0x3D: "C#3", 0x3E: "D3", 0x3F: "D#3", 0x40: "E3", 0x41: "F3", 
                        0x42: "F#3", 0x43: "G3", 0x44: "G#3", 0x45: "A3", 0x46: "A#3", 0x47: "B3", 
                        0x48: "C4", 0x49: "C#4", 0x4A: "D4", 0x4B: "D#4", 0x4C: "E4", 0x4D: "F4", 
                        0x4E: "F#4", 0x4F: "G4", 0x50: "G#4", 0x51: "A4", 0x52: "A#4", 0x53: "B4", 
                        0x54: "C5", 0x55: "C#5", 0x56: "D5", 0x57: "D#5", 0x58: "E5", 0x59: "F5", 
                        0x5A: "F#5", 0x5B: "G5", 0x5C: "G#5", 0x5D: "A5", 0x5E: "A#5", 0x5F: "B5", 
                        0x60: "C6", 0x61: "C#6", 0x62: "D6", 0x63: "D#6", 0x64: "E6", 0x65: "F6", 
                        0x66: "F#6", 0x67: "G6", 0x68: "G#6", 0x69: "A6", 0x6A: "A#6", 0x6B: "B6", 
                        0x6C: "C7", 0x6D: "C#7", 0x6E: "D7", 0x6F: "D#7", 0x70: "E7", 0x71: "F7", 
                        0x72: "F#7", 0x73: "G7", 0x74: "G#7", 0x75: "A7", 0x76: "A#7", 0x77: "B7", 
                        0x78: "C8", 0x79: "C#8", 0x7A: "D8", 0x7B: "D#8", 0x7C: "E8", 0x7D: "F8", 
                        0x7E: "F#8", 0x7F: "G8"
                      };

// default conf
var conf = {
      'CHANNEL': 0,
      'PADS': [
            {'note': 0x24, 'pc': 0, 'cc': 1, 'channel': 0},
            {'note': 0x25, 'pc': 1, 'cc': 2, 'channel': 0},
            {'note': 0x26, 'pc': 2, 'cc': 3, 'channel': 0},
            {'note': 0x27, 'pc': 3, 'cc': 4, 'channel': 0},
            {'note': 0x28, 'pc': 4, 'cc': 5, 'channel': 0},
            {'note': 0x29, 'pc': 5, 'cc': 6, 'channel': 0},
            {'note': 0x2A, 'pc': 6, 'cc': 8, 'channel': 0},
            {'note': 0x2B, 'pc': 7, 'cc': 9, 'channel': 0}
      ],
      'KONTROLS': [
            {'cc': 1, 'low': 0, 'hi': 127},
            {'cc': 2, 'low': 0, 'hi': 127},
            {'cc': 3, 'low': 0, 'hi': 127},
            {'cc': 4, 'low': 0, 'hi': 127},
            {'cc': 5, 'low': 0, 'hi': 127},
            {'cc': 6, 'low': 0, 'hi': 127},
            {'cc': 7, 'low': 0, 'hi': 127},
            {'cc': 8, 'low': 0, 'hi': 127}
      ]
};


class PAD {

      constructor(pad_nbr, note, pc, cc, channel) {
            this.nbr = pad_nbr;
            this.note = note;
            this.pc = pc;
            this.cc = cc;
            this.channel = channel;
            this.state = false;
            this.vel = 0;
            this.dt = 0;
      }

      on(status_byte, velocity, delta_time, signal) {
            if (this.channel == (status_byte & 0x0f)) {
                  this.state = ((status_byte & 0xf0) == NOTEON);
                  this.dt = delta_time;
                  if (signal)
                        signal('pad', this.nbr, this.note, this.state, this.vel, this.dt);
            }
      }
}

class Kontrol {

      constructor(k_nbr, cc, low, hi) {
            this.nbr = k_nbr;
            this.cc = cc;
            this.low = low;
            this.hi = hi;
            this.kv = 0;
            this.dt = 0;            
      }

      on(value, delta_time, signal) {
            this.kv = value;
            this.dt = delta_time;
            if(signal)
                  signal('k', this.nbr, this.cc, this.kv, this.dt);
      }
}

class LPD8 {

      constructor(config_file_path) {

            this.conf = parse_lpd8_config(config_file_path) || conf;
            this.CHANNEL = this.conf.CHANNEL;
            this.PADS = {};
            this.KONTROLS = {};

            var i = 0;
            for(i = 0; i < this.conf.PADS.length; i++) {
                  let pad = this.conf.PADS[i];
                  this.PADS[pad.note] = new PAD(i + 1, pad.note, pad.pc, pad.cc, pad.channel);
            }

            for(i = 0; i < this.conf.KONTROLS.length; i++) {
                  let k = this.conf.KONTROLS[i];
                  this.KONTROLS[k.cc] = new Kontrol(i + 1, k.cc, k.low, k.hi);
            }
      }

      set_pad_cb(callback) {
            this.pad_cb = callback;
      }

      set_kontrol_cb(callback) {
            this.k_cb = callback;
      }

      // based on node-midi (not raw midi)
      midi_signal(message, dt) {

            var cmd = message[0] & 0xf0;
            var channel = message[0] & 0x0f;

            if(this.CHANNEL !== channel) return;

            if(cmd == NOTEOFF || cmd == NOTEON) {
                  this.PADS[message[1]].on(message[0], message[2], dt, this.pad_cb);
            } else if(cmd == KCHANGE) {
                  this.KONTROLS[message[1]].on(message[2], dt, this.k_cb);
            }
      }
}



function parse_lpd8_config(config_file_path) {

      try {
            fs.accessSync(config_file_path, fs.R_OK)
      } catch (e) {
            console.log('error reading lpd8 config file\n' + e);
            return null;
      }

      var data = fs.readFileSync(config_file_path, 'utf8');
    var lpd8_conf = {'PADS': [], 'KONTROLS' : []}

    var tok = data.split(' ');
    var channel = parseInt(tok[8], 10);   

    lpd8_conf.CHANNEL = channel;         

    var i;            
    for (i = 9; i < (4 * 8) + 9; i += 4) {
      lpd8_conf.PADS.push({'note': parseInt(tok[i], 10), 
                              'pc': parseInt(tok[i + 1], 10), 
                              'cc': parseInt(tok[i + 2], 10), 
                              'channel': channel});
    }

    for(; i < (3 * 8) + 41; i += 3) {
      lpd8_conf.KONTROLS.push({'cc': parseInt(tok[i], 10), 
                                    'low': parseInt(tok[i + 1], 10), 
                                    'hi': parseInt(tok[i + 2], 10), 
                                    'channel': channel});
    }

    return lpd8_conf;

}

module.exports.PAD = PAD;
module.exports.Kontrol = Kontrol;
module.exports.LPD8 = LPD8;












