#!/bin/bash
# assumes that any accomanying data file has already been acquired, and that topojson v1.6.27 is installed

mkdir ./shapefiles
cd ./shapefiles
mkdir ./archives
cd ./archives
# download country wide shapefile of counties
curl -o counties.zip http://www2.census.gov/geo/tiger/GENZ2015/shp/cb_2015_us_county_5m.zip
codes=(00 AL AK 00 AZ AR CA 00 CO CT DE DC FL GA 00 HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA 00 RI SC SD TN TX UT VT VA 00 WA WV WI WY)
for x in {01..02} {04..06} {08..13} {15..42} {44..51} {53..56} # other FIPS codes available: 43,60,66,69,72,78
do
	# download each state's tract level shapefile
	curl -o $x_${codes[$(echo $x | sed 's/^0*//')]}_tracts.zip http://www2.census.gov/geo/tiger/GENZ2015/shp/cb_2015_$x\_tract_500k.zip
done
return
# extract each .zip file to its own directory
for z in *.zip; do unzip $z -d ../${z%.*}; done
cd ..
cd ..
mkdir ./topojson
cd ./topojson
# population.csv can be whatever other data is being included, with the property list modified accordingly. Here it is assumed to exist in the starting directory
topojson -e ../population.csv --id-property GEOID,GEOid2 -p population=HD01_VD01,area=ALAND,state=STATEFP -o usa.json -- $(ls ../shapefiles/*/*.shp)
# optionally project the spherical coordinates in advance for somewhat faster load times
topojson -e ../population.csv --id-property GEOID,GEOid2 -p population=HD01_VD01,area=ALAND,state=STATEFP --projection 'd3.geo.albersUsa()' --width 960 -o albersUsa.json -- $(ls ../shapefiles/*/*.shp)
# optionally use the -s argument for significantly faster load times, at a potential cost of some quality
topojson -e ../population.csv --id-property GEOID,GEOid2 -p population=HD01_VD01,area=ALAND,state=STATEFP --projection 'd3.geo.albersUsa()' --width 960 -s 1 -o simplifiedAlbersUsa.json -- $(ls ../shapefiles/*/*.shp)
