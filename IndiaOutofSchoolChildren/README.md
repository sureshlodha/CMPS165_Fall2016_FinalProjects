# Out-of-School-Children-In-India
Freshly released Census 2011 data has revealed that more than 110 million children don't go to school at all.
Visualization can be found at https://amylavara.github.io/Out-of-School-Children-In-India/

# Data Design:
The Shape files are taken from “DataMeet” repository on GitHub. DataMeet is a user-generated community primarily focused around Open Data & Data Science in India. (https://github.com/datameet/maps)
The data is taken from the 2011 census of Indian government. (http://www.censusindia.gov.in/2011census/C-series/C12A.html)
The Data binding is going to be done on the population values for the total children on the geo map and the children per age on the bar chart. 

# Visualization Design:
	The visualization layout will be geo mapping with a bar chart. The bar chart would show statistics per age of the children. The geo map will have Indian map divided into states. 
The main Idea of the visualization will be shown on the top of the visualization element as a paragraph. The regions will be colored with shades of same color from light to dark to indicate population from low to high with appropriate legend. Shades of orange will be used to show the out-of-school population.

# Interaction Design:
	The initial visualization will have Indian map divided as states with a bar chart showing the statistics with respect to age of the children for the country. Clicking on a state will zoom in to the state and show districts of that state along with the bar chart showing the statistics with respect to age of the children for that state. Based on the selection button, hovering over a state will show the tooltip with total out of school children population for that particular state and hovering over a district will show the tooltip with total out of school children population for that district.  Clicking on a district will highlight the district and modify the bar chart to show the statistics with respect to age of the children for that district. Clicking on the same district will zoom out and show the initial Indian map with states.
  
# Visualization Sources:

https://bl.ocks.org/mbostock/5562380

http://www.tnoda.com/blog/2013-12-07

http://visual.ly/us-map-choropleth-bar-chart?view=true

http://adilmoujahid.com/posts/2015/01/interactive-data-visualization-d3-dc-python-mongodb/

