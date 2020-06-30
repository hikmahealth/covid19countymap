# Overview

# COVID-19 Policy Dataset Files

The following CSV files contain the local policy data sourced by Hikma Health:

[all_community_policies.csv](https://github.com/hikmahealth/covid19countymap/blob/gh-pages/all_community_policies.csv): All policy data recorded from March - June 2020, with multiple timepoints of data for Indigenous communities.

[all_county_policies.csv](https://github.com/hikmahealth/covid19countymap/blob/gh-pages/all_county_policies.csv): All policy data recorded from March - June 2020, with multiple timepoints of data for US counties.

[community_policies.csv](https://github.com/hikmahealth/covid19countymap/blob/gh-pages/community_policies.csv): The latest policy data recorded for each unique Indigenous community.

[county_policies.csv](https://github.com/hikmahealth/covid19countymap/blob/gh-pages/county_policies.csv): The latest policy data recorded along with current case data for each unique US county.

Alternative JSON files containing identical policy data to the CSV files are provided for those building map visualizations.

# Explanation of Dataset Variables
‘fips’: County FIPS geographic code

‘testing’: Binary coding whether COVID testing is publicly available in the county to any resident

‘school’: Binary coding whether all schools are closed in the county

‘shelter’: Binary coding whether the county has an active shelter-in-place order

‘shelter_enforcement’: Binary coding whether the shelter-in-place order is being enforced

‘work’: Binary coding whether all “non-essential workplaces” are closed in the county

‘event’:  Binary coding whether public events and gatherings of a certain size are restricted

‘transport’: Binary coding whether any public transport system has been closed down

‘X_date’: For each policy binary, the date on which it was first implemented

‘X_URL’: For each policy binary, the source URL with evidence of the nature and date of the policy

‘updated’: The timestamp for when this data was entered

# Sample Data for Exemplar County X
‘testing’: True                   
County X has active public testing

‘testing_date’: 2020-03-21                                                        
Testing available since March 21, 2020

‘testing_URL’: https://voiceofoc.org/2020/03/1967086/                             
Evidence for testing availability

‘updated’: 2020-04-10 09:00:00                                                    
Data entered at 9AM on April 10, 2020

# Detailed Methods
Our data collection and validation process is as follows. Our 100 volunteer contributors are invited to join weekly training sessions to ensure uniformity of policy coding. The contributors then research their assigned counties. For the first 100 counties, we validated every policy and date by visiting a URL to source information. We repeated this process for the subsequent 1,000 counties, with additional spot- checked URLs for a randomly selected 10%. As time goes on, we will have the ability to validate all of them. We also have the capacity for the public to submit data, but have not yet solicited public input.

# Data Use Cases
We plan to use this dataset to create a binary map and analysis comparing incidence of COVID-19 cases and county level policy. We anticipate creating more visualizations as needed to help the public and policy makers. We are also encouraging other groups to create US map visualizations and integrate our dataset into their analyses.
