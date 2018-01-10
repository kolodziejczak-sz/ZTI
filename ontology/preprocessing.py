import pandas as pd
import numpy as np
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


def process(size=0):
  df = pd.read_csv(fpath, usecols=['brand', 'model', 'network_technology', 'GPRS', 'EDGE', 'announced', 'dimentions',
                                   'weight_g', 'SIM', 'display_type', 'display_resolution', 'display_size', 'OS', 'CPU',
                                   'Chipset', 'GPU', 'memory_card', 'internal_memory', 'RAM', 'primary_camera',
                                   'secondary_camera', 'loud_speaker', 'audio_jack', 'WLAN', 'bluetooth', 'GPS', 'NFC',
                                   'radio', 'battery', 'approx_price_EUR', 'img_url'])

  df['GSM'] = df['network_technology'].apply(has_gsm)
  df['LTE'] = df['network_technology'].apply(has_lte)
  df['GPRS'] = df['GPRS'].apply(parse_GPRS)
  df['EDGE'] = df['EDGE'].apply(parse_EDGE)
  df['announced'] = df['announced'].apply(parse_announced)
  df['DualSim'] = df['SIM'].apply(has_dualsim)
  df['radio'] = df['radio'].apply(isnt_no)
  df['audio_jack'] = df['audio_jack'].apply(isnt_no)
  df['memory_card'] = df['memory_card'].apply(isnt_no)
  df['secondary_camera'] = df['secondary_camera'].apply(remove_no)
  df['NumberOfCores'] = df['CPU'].apply(get_core_num)
  df['bluetooth'] = df['bluetooth'].apply(isnt_no)
  df['GPS'] = df['GPS'].apply(isnt_no)
  df['OS-family'] = df['OS'].apply(get_os_family)

  df = df.drop(['network_technology', 'SIM'], axis=1)
  df.sort_values(['brand', 'model'], inplace=True)

  output_name = 'output.csv'

  if size > 0:
    df = df.take(np.random.permutation(len(df))[:size])
    output_name = 'mini' + output_name
  df.to_csv(output_name, index=False, encoding='utf-8')

process()
