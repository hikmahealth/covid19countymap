#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Mar 29 21:37:43 2020

@author: Dani Kiyasseh, DPhil Student, University of Oxford
Covid 19 - Hikma Response - 
Encoding Google Sheet Table For csv Export
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials

import pandas as pd
from sklearn.preprocessing import LabelEncoder
encoder = LabelEncoder()

#%%
""" Column Entry Encoders """
school_encoder = encoder.fit(['Yes, required to close','Yes, recommended to close','No','Do not know'])
work_encoder = encoder.fit(['Yes, required to close','Yes, recommended to close','No','Do not know'])
event_encoder = encoder.fit(['Yes, required to close','Yes, recommended to close','No','Do not know'])
transport_encoder = encoder.fit(['Yes, required to close','Yes, recommended to close','No','Do not know'])
info_encoder = encoder.fit(['Yes, I know of public campaigns','No public campaigns','Do not know'])
travel_encoder = encoder.fit(['Yes, required restrictions','Yes, recommended restrictions','No restrictions','Do not know'])
encoders = [school_encoder,work_encoder,event_encoder,transport_encoder,info_encoder,info_encoder,travel_encoder]
encoders_name = ['school','work','event','transport','info','travel']
""" Access Encoders Via this Dictionary """
encoders_dict = dict(zip(encoders_name,encoders))

#%%
""" Load Google Sheets Locally """
#df = pd.read_csv('COVID-19 US Policy Survey (Responses) - Form Responses 1.csv')

""" Load Google Sheets via API """
scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('COVID-19 Hikma Response-dec9720b1b90.json', scope)
client = gspread.authorize(creds)
sheet = client.open('COVID-19 US Policy Survey (Responses)').sheet1
df = pd.DataFrame(sheet.get_all_records())

""" Convert Column to Timestamp """
df['Timestamp'] = pd.to_datetime(df['Timestamp'])

def retrieve_encoded_column(column_name,column_entries,encoders_dict):
    """ Encode Column Based on Categories Availabile
    Args: 
        column_name (str): name of column in df
        column_entries (pandas Series): column of data entries
        encoders_dict (dict): mapping between column name and encoder
    Outputs:
        encoded_column (pandas Series): column with encoded entries
    """
        
    if 'school' in column_name:
        encoder = encoders_dict['school']
    elif 'work' in column_name:
        encoder = encoders_dict['work']
    elif 'event' in column_name:
        encoder = encoders_dict['event']
    elif 'transport' in column_name:
        encoder = encoders_dict['transport']
    elif 'info' in column_name:
        encoder = encoders_dict['info']
    elif 'travel' in column_name:
        encoder = encoders_dict['travel']
    
    encoded_column = encoder.fit_transform(column_entries)
    return encoded_column

def encode_df_columns(df):
    """ Encoder All Categorical Columns in df
    Args:
        df (pandas DataFrame): df containing entries
    Outputs:
        df (pandas DataFrame): df with encoded columns
    """
    for column_name,column_entries in df.iteritems():
        if column_entries.dtype == 'object':
            encoded_column = retrieve_encoded_column(column_name,column_entries,encoders_dict)
            df[column_name] = encoded_column
    
    return df

def export_df_to_csv(df,export):
    if export == True:
        df.to_csv('COVID-19 Hikma Response.csv')

def export_df_to_json(df,export):
    if export == True:
        df.to_json('COVID-19 Hikma Response.json')

#%%
export = True #options 'False' | 'True'
if __name__ == '__main__':
    df = encode_df_columns(df)
    export_df_to_csv(df,export)
    
    
    
    
    
    
    
    
    
    
    