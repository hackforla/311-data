<div style = "text-align: justify"> 
  
# **Updated population density of the LA city neighborhood councils (NCs).**
  
### Have calculated the population of LA city neighborhood councils using the updated NC shape file, Census tracts data-2020 and 2020-ACS (5 year estimate) demographics data. The notebook- NC_pop_recent.ipynb outlines the detailed steps involved to evaluate the populataion, area (in square miles) and population density of the 99 NCs. 

### The movtivation behind this analysis stems from the fact that the latest available population data for the NCs have been estimated using older census  population/demographics data approximated from block groups to LA NCs (97 NCs). The boundary of NC has been modified around 2018- adding 2 more NCs- Arts District Little Tokyo NC (also known as Historic Cultural) and Westwood NC. 

### How to use this repo:
- #### NC_pop_recent_no_filter.ipynb- This notebook computes the population of the 99 NCs without any filter. Therefore the total population of the LA city NCs is inflated. 
- #### NC_pop_recent.ipynb- This notebook is an updated version of NC_pop_recent_no_filter.ipynb, where in, area and population filter have been introduced to address the inflated LA city NCs value in comparison to the one reported in the Census Bureau [website](https://www.census.gov/quickfacts/losangelescitycalifornia?).
  #### The following files have been used in this notebook:
   * #### tl_2020_06037_tract20.shp from tl_2020_06037_tract20 folder - Census Tracts 2020 Tigershape file. 
   * #### ACS_census_tract_LA.csv - ACS 2020 demographics data for the LA county. Note: Save the ACS 2020 demographics data from this link: https://api.census.gov/data/2020/acs/acs5/profile?get=group(DP05)&for=tract:*&in=state:06&in=county:037&key=cb51343974c4b01dc140a03af63a82c6424272ee as a csv file and clean it (removing the empty space, closed bracket and quotes).
   * #### Neighborhood_Councils_(Certified).shp in Neighborhood_Councils_(Certified) folder- LA city Neighborhood Councils shape file. 
- #### NC_updated_pop_comparison.ipynb - In this notebook, the evaluated NC population using the methodology detailed in NC_pop_recent.ipynb have been compared with the population value obtained from geospatial analysis using arcGIS software. 
- #### NC_updated_pop_comparison_old.ipynb - This is an older version of  NC_updated_pop_comparison.ipynb.

### Resources pertaining to this research:

- #### Census tracts data 2020 - https://www2.census.gov/geo/tiger/TIGER2020PL/STATE/06_CALIFORNIA/06037/
- #### Updated NC shape file - https://geohub.lacity.org/datasets/9c8639737e3a457a8c0f6a93f9c36974_18/about
- #### More information about the updated NC boundary - https://geohub.lacity.org/datasets/lahub::neighborhood-council-boundaries-2018/about
- #### This resource - https://api.census.gov/data/2020/acs/acs5/profile/variables is helpful to understand the variables in the ACS files.
- #### Follow this video - https://www.census.gov/library/video/2020/using-api-all-results-for-acs-table.html for processing the ACS table. 
- #### Census Data by Neighborhood Council using census 2010 demographics data- https://data.lacity.org/Community-Economic-Development/Census-Data-by-Neighborhood-Council/nwj3-ufba
- #### Demographics of Neighborhood Councils using census 2010 demographics data - https://geohub.lacity.org/datasets/lahub::demographics-of-neighborhood-councils/about
- #### Demographics data sheet compiled by Empower LA (https://empowerla.org/data/) using the ACS Data 2018 (5-Year estimates) and the analysis done through ArcGIS Online- https://drive.google.com/drive/folders/1uupIXEGEC8UlFOCQiyIPH9q7JmETn_Cx
- #### Other similar studies:
  * #### http://www.laalmanac.com/population/po24la.php; The LA city boundary used in this analysis- https://geohub.lacity.org/datasets/lahub::la-times-neighborhood-boundaries/about. It should be noted that the cities reported here is different from LA NCs. 
  * #### https://usc.data.socrata.com/Los-Angeles/Census-Tract-Locations-LA-/atat-mmad
