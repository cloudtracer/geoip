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

function checkIsIPV4(entry) {
  var blocks = entry.split(".");
  if(blocks.length === 4) {
    return blocks.every(function(block) {
      return parseInt(block,10) >=0 && parseInt(block,10) <= 255;
    });
  }
  return false;
}

http.createServer(function(request, response) {
  addr = url.parse(request.url).path.replace("/geoip?","");
  if (checkIsIPV4(addr)){
    address=addr.split(".");
    ipnum=16777216*parseInt(address[0])+65536*parseInt(address[1])+256*parseInt(address[2])+parseInt(address[3]);
    low=0;
    high=blocks.blocks.length;
    i=Math.round((high+low)/2);
    resp="";
    if (isNaN(ipnum)){
      resp="error";
    }else{
      while ((high - low) > 1) {
        i=Math.round((high+low)/2);
        if (blocks.blocks[i][0] <= ipnum) {
          low=i;
        } else if (blocks.blocks[i][0] > ipnum) {
          high=i;
        }
      }
      resp=blocks.blocks[low][4]+","+blocks.blocks[low][5]+",";
      if (location[blocks.blocks[low][1]]!=null){
        resp=resp+location[blocks.blocks[low][1]][1].replace(/\W/g, '')+",";
        resp=resp+alfa2num[location[blocks.blocks[low][1]][1].replace(/\W/g, '')]+",";
        resp=resp+location[blocks.blocks[low][1]][2].replace(/\W/g, '')+",";
        resp=resp+location[blocks.blocks[low][1]][3].replace(/\W/g, '')+",";
      } else {
        resp=resp+',,,,';
      }
    }
    response.writeHeader(200, {'Content-Type': 'text/plain','Content-Length': resp.length });
    response.end(resp);
  } else { 
    resp="error";
    response.writeHeader(200, {'Content-Type': 'text/plain','Content-Length': resp.length });
    response.end(resp);
  }
}).listen(port);
