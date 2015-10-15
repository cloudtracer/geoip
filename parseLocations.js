// Utility to convert GeoLite2-City-Locations-XX.csv to JSON
//
// Author: Jan van der Meiden
// Copyright (c) 2015 Jan van der Meiden
// Copying and distribution of this file, with or without modification,
// are permitted in any medium without royalty provided the copyright
// notice and this notice are preserved. 
//
// Fields in the 'location' csv:
//  0 geoname_id
//  1 locale_code
//  2 continent_code
//  3 continent_name
//  4 country_iso_code
//  5 country_name
//  6 subdivision_1_iso_code
//  7 subdivision_1_name
//  8 subdivision_2_iso_code
//  9 subdivision_2_name
// 10 city_name
// 11 metro_code
// 11 time_zone
//
// Keep continent_code, country_iso_code, country_name, city_name 
 
var    path = require('path'),
    fs = require('fs');
 
var filename = path.join(process.cwd(), process.argv[2]);
 
fs.readFile( filename, 'utf8', function (err,data) {
    var list = new Object();
    list.copyright="This product includes GeoLite2 data created by MaxMind, available from http://www.maxmind.com";
    if (err) {
        return console.log(err);
    }
    lines=data.split('\n')
    lines.forEach(function (val, index, array) {
        attr=lines[index].split(',');
        list[attr[0]]=[attr[2],attr[4],attr[5],attr[10]];
    })
    console.log(JSON.stringify(list));
});
