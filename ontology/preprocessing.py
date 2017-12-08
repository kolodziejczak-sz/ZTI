import pandas as pd
import re
import os

fname = "phone_dataset_new.csv"
fpath = os.path.join(".", fname)


def has_gsm(string):
    if "GSM" in string:
        return "GSM"
    else:
        return ""


def has_lte(string):
    if "LTE" in string:
        return "LTE"
    else:
        return ""


def parse_GPRS(string):
    if "No" in str(string):
        return ""
    else:
        return "Yes"


def parse_EDGE(string):
    if "No" in str(string):
        return ""
    else:
        return "Yes"


regex = re.compile(r'\d{4}')


def parse_announced(string):
    matches = regex.search(str(string))
    if matches is not None:
        return matches.group(0)
    else:
        return 0


def has_dualsim(string):
    if "dual" in str.lower(str(string)):
        return "Yes"
    else:
        return ""


def has_display(regex):
    regex = re.compile(regex)

    def f(string):
        matches = regex.search(str(string))
        if matches is not None:
            return matches.group(0)
        else:
            return ""

    return f


def get_os_family(string):
    os_list = ['Android', 'Windows', 'iOS']
    input_str = str(string)
    for os in os_list:
        if os in input_str:
            return os
    return ""


def get_core_num(string):
    input_str = str.lower(str(string))
    if "dual" in input_str:
        return 2
    if "quad" in input_str:
        return 4
    if "octa" in input_str:
        return 8
    return 1


def get_battery_type(type):
    def has_battery(string):
        input_str = str.lower(str(string))
        if type in input_str:
            return 'Yes'
        else:
            return ""

    return has_battery


def isnt_no(string):
    if 'no' not in str.lower(str(string)):
        return "Yes"
    else:
        return ""


def remove_no(string):
    if str(string).lower() != 'no':
        return string
    else:
        return ''

dataframe = pd.read_csv(fpath, dtype={'4G_bands': 'object', 'GPRS': 'object'})
dataframe = dataframe.drop(
    ['weight_oz', '2G_bands', '3G_bands', '4G_bands', 'status', 'colors', 'loud_speaker', 'WLAN', 'USB', 'sensors'],
    axis=1)

dataframe['GSM'] = dataframe['network_technology'].apply(has_gsm)
dataframe['LTE'] = dataframe['network_technology'].apply(has_lte)
dataframe['GPRS'] = dataframe['GPRS'].apply(parse_GPRS)
dataframe['EDGE'] = dataframe['EDGE'].apply(parse_EDGE)
dataframe['announced'] = dataframe['announced'].apply(parse_announced)
dataframe['DualSim'] = dataframe['SIM'].apply(has_dualsim)
dataframe['radio'] = dataframe['radio'].apply(isnt_no)
dataframe['audio_jack'] = dataframe['audio_jack'].apply(isnt_no)
dataframe['memory_card'] = dataframe['memory_card'].apply(isnt_no)
dataframe['secondary_camera'] = dataframe['secondary_camera'].apply(remove_no)
dataframe['NumberOfCores'] = dataframe['CPU'].apply(get_core_num)
dataframe['bluetooth'] = dataframe['bluetooth'].apply(isnt_no)
dataframe['GPS'] = dataframe['GPS'].apply(isnt_no)
dataframe['OS-family'] = dataframe['OS'].apply(get_os_family)

dataframe = dataframe.drop(['network_technology', 'SIM'], axis=1)
dataframe.sort_values(['brand', 'model'], inplace=True)

dataframe.to_csv('output.csv', index=False, encoding='utf-8')
