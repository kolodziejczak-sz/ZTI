import dask.dataframe as dd
import re
import os

fname = "phone_dataset _new.csv"
fpath = os.path.join(".",fname)

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


def get_os_family(os):
    def has_os(string):
        if os in str(string):
            return 'Yes'
        else:
            return ""
    return has_os

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


dataframe = dd.read_csv(fpath, dtype={'4G_bands': 'object', 'GPRS':'object'})
dataframe = dataframe.drop(['weight_oz','2G_bands','3G_bands','4G_bands','status','colors', 'loud_speaker', 'WLAN', 'USB', 'sensors'],axis=1)

dataframe = dataframe.compute()

dataframe['GSM'] = dataframe['network_technology'].apply(has_gsm)
dataframe['LTE'] = dataframe['network_technology'].apply(has_lte)
dataframe['GPRS'] = dataframe['GPRS'].apply(parse_GPRS)
dataframe['EDGE'] = dataframe['EDGE'].apply(parse_EDGE)
dataframe['announced'] = dataframe['announced'].apply(parse_announced)
dataframe['DualSim'] = dataframe['SIM'].apply(has_dualsim)
dataframe['NumberOfCores'] = dataframe['CPU'].apply(get_core_num)
dataframe['bluetooth'] = dataframe['bluetooth'].apply(isnt_no)
dataframe['bluetooth'] = dataframe['bluetooth'].apply(isnt_no)
dataframe['GPS'] = dataframe['GPS'].apply(isnt_no)

battery_type_list = ['li-ion', 'li-po']
for b in battery_type_list:
    dataframe[b] = dataframe['battery'].apply(get_battery_type(b))

displays_list =['AMOLED',
	r'([^\w]|\b)OLED',
	'TFT',
	'LCD']

for d in displays_list:
    dataframe[d] = dataframe['display_type'].apply(has_display(d))

os_list = ['Android', 'Windows', 'iOS']
for os in os_list:
    dataframe[os] = dataframe['OS'].apply(get_os_family(os))

dataframe = dataframe.drop(['network_technology'],axis=1)

print(list(dataframe))
print(dataframe)

dataframe.to_csv('output.csv')