// Test utility to use GeoLite2-City-Blocks converted to JSON
// Author: Jan van der Meiden
// Copyright (c) 2015 Jan van der Meiden
// Copying and distribution of this file, with or without modification,
// are permitted in any medium without royalty provided the copyright
// notice and this notice are preserved.  
//
// Run as 'node test 123.1.17.1' for instance

var address = process.argv[2];
var blocks = require('./blocks');
var location = require('./location');
var dns = require('dns');

// Do a binary search on blocks
function getIpInfo(addr){ 
	var ret = new Object(); 
	address=addr.split(".");
	ipnum=16777216*parseInt(address[0])+65536*parseInt(address[1])+256*parseInt(address[2])+parseInt(address[3]);
	var low=0;
	var high=blocks.blocks.length;
	var i=Math.round((high+low)/2);
	
	// Do a binary search on blocks	
	while ((high - low) > 1) {
		i=Math.round((high+low)/2);
		if (blocks.blocks[i][0] < ipnum) {
			low=i;
		} else if (blocks.blocks[i][0] > ipnum) {
			high=i;
		} 
	}
    
	ret.IP=addr;	
	ret.anonProxy=blocks.blocks[low][2];
	ret.viaSatellite=blocks.blocks[low][3];
	ret.latitude=blocks.blocks[low][4];
	ret.longitude=blocks.blocks[low][5];
    ret.continent=location[blocks.blocks[low][1]][0];
    ret.countryISO=location[blocks.blocks[low][1]][1];
    ret.country=location[blocks.blocks[low][1]][2];
    ret.city=location[blocks.blocks[low][1]][3];	
	return(ret);
}

console.log(JSON.stringify(getIpInfo(address)));
