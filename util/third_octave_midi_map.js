// for akai lpd8 config [C-2..G8] -- third octave (re: C0 on third octave)
// see /lib/lpd8.js
var oct = ['-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8'];
var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
var i = 0, j, k;
var midi_map = {};

for(j = 0; j < oct.length; j++) {
	for(k = 0; k < notes.length; k++) {		
		process.stdout.write('0x' + i.toString(16).toUpperCase() + ': "' + notes[k] + oct[j] + '", ');
		if (k == 5) process.stdout.write('\n');
		i++;
	}	
	process.stdout.write('\n');
}