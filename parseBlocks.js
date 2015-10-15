// Utility to convert GeoLite2-City-Blocks-IPv4.csv to JSON
//
// Author: Jan van der Meiden
// Copyright (c) 2015 Jan van der Meiden
// Copying and distribution of this file, with or without modification,
// are permitted in any medium without royalty provided the copyright
// notice and this notice are preserved.  
//
// Fields in the 'blocks' csv:
// network,geoname_id,registered_country_geoname_id,represented_country_geoname_id,is_anonymous_proxy,is_satellite_provider,postal_code,latitude,longitude  
// We keep: geoname_id(key to location),is_anonymous_proxy,is_satellite_provider,latitude,longitude   
 
var  path = require('path'), 
  fs = require('fs'); 
 
var filename = path.join(process.cwd(), process.argv[2]);
 
fs.readFile( filename, 'utf8', function (err,data) {
 var list = new Object();
  
 list.blocks=[];
 lines=data.split('\n')
 var val=0;
 var lastId=0;
 lines.forEach(function (val, index, array) {
  line=lines[index].replace(/\"/g,'');
  entries=line.split(",");
  ipNum=entries[0].split(/[.\/]/);
  val=16777216*parseInt(ipNum[0])+65536*parseInt(ipNum[1])+256*parseInt(ipNum[2])+parseInt(ipNum[3]);
  // compress on the fly by combining entries
  if (parseInt(entries[1])!=lastId){
   if (val != null) list.blocks.push([val,parseInt(entries[1]),parseInt(entries[4]),parseInt(entries[5]),parseFloat(entries[7]),parseFloat(entries[8])]);
   lastId=parseInt(entries[1]);
  } 
 })
 list.copyright="This product includes GeoLite2 data created by MaxMind, available from http://www.maxmind.com";
 console.log(JSON.stringify(list));
});
