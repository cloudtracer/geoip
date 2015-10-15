## Synopsis

This repository contains some code to convert https://dev.maxmind.com/geoip/geoip2/geolite2/ csv information into JSON. 
The resulting objects are an alternative for MaxMind binary database.

## Code Example

Converting csv files to JSON, run something like:
node parseLocations.js GeoLite2-City-Locations-en.csv > locations.json
etc.

Sample test application is provided in 'test.js' which can be run as a node application.
'node test 123.1.17.1' for instance

The ipInfo.js provides a 'micro service' running in this case at port 8081 which returns geo ip information in json format
Run as:
--**nohup node ipInfo &**
--**curl 127.0.0.1:8081/geoip?=106.120.78.169**
--`{"code":"OK","address":"106.120.78.169","lon":39.9289,"lat":116.3883,"countryAlfa":"CN","countryNum":156,"countryName":"China","city":"Beijing","copyright":"This product includes GeoLite2 data created by MaxMind, available from http://www.maxmind.com","domain":"169.78.120.106.static.bjtelecom.net"}`

## Motivation

Enriching IP address information with location information is useful and interesting. 
A website can customize response based on location: if you are from Germany you get a response in German for instance.
Or: 'I am a Swiss masseur, and request from Australia are not interesting at all..'.

When gathering usage or other statistics it also is also interesting to know location.


## Tests

A test application is provided.

## License

Author: Jan van der Meiden
Copyright (c) 2015 Jan van der Meiden
Copying and distribution of this file, with or without modification,
are permitted in any medium without royalty provided the copyright
notice and this notice are preserved. 
