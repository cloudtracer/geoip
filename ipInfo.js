//Author: Jan van der Meiden
//jvdmeiden@gmail.com
//Version: 20150928.00
//
// Copyright (c) 2015 Jan van der Meiden.
//
// Copying and distribution of this file, with or without modification,
// are permitted in any medium without royalty provided the copyright
// notice and this notice are preserved.  This file is offered as-is,
// without any warranty.
//
// This is a service giving geoip information  as described in:
// http://janvandermeiden.blogspot.nl/2015/08/using-maxmind-geoip-csv-data-in.html
var http = require('http'),
    url = require('url'),
    async = require('async'),
    dns = require('dns'),
    blocks = require('./blocks'),
    location = require('./location'),
    alfa2num= require('./alfa2num'),
    port= process.env.PORT || 8081,
    addr = "",
    address = [],
    ipnum = 0,
    low = 0,
    high = 0,
    i = 0,
    domain = "";
    resp={};
// set DNS to Google
dns.setServers(["8.8.8.8","8.8.4.4"]);
http.createServer(function(request, response) {
  addr = url.parse(request.url).path.replace("/geoip?=","");
  address=addr.split(".");
  ipnum=16777216*parseInt(address[0])+65536*parseInt(address[1])+256*parseInt(address[2])+parseInt(address[3]);
  low=0;
  high=blocks.blocks.length;
  i=Math.round((high+low)/2);
  resp={};
  if (isNaN(ipnum)){
    resp.code="error";
  }else{
    while ((high - low) > 1) {
      i=Math.round((high+low)/2);
      if (blocks.blocks[i][0] < ipnum) {
        low=i;
      } else if (blocks.blocks[i][0] > ipnum) {
         high=i;
      }
    }
    resp.code="OK";
    resp.address=addr;
    resp.lon=blocks.blocks[low][4];
    resp.lat=blocks.blocks[low][5];
    resp.countryAlfa=location[blocks.blocks[low][1]][1].replace(/\W/g, '');
    resp.countryNum=alfa2num[location[blocks.blocks[low][1]][1].replace(/\W/g, '')];
    resp.countryName=location[blocks.blocks[low][1]][2].replace(/\W/g, '');
    resp.city=location[blocks.blocks[low][1]][3].replace(/\W/g, '');
    resp.copyright="This product includes GeoLite2 data created by MaxMind, available from http://www.maxmind.com";
  }
  dns.reverse(addr, function (erno, domains) {
    if (erno) resp.domain='REVERSE LOOKUP FAILED'; else {
      resp.domain=domains;
    }
    response.writeHeader(200, {'Content-Type': 'text/plain','Content-Length': JSON.stringify(resp).length });
    response.end(JSON.stringify(resp));
  })
}).listen(port);
