import os
import json
import numpy as np
from pprint import pprint
from sys import argv

#args : SUBJECT_DIR, ${overlapFlag}, JSONTABLE filename, number_ROIS
subject_dir = argv[1] 
overlapName = argv[2] 
jsonFile = argv[3] 
nb_ROIS = argv[4]

DIR_Surfaces = os.path.join(subject_dir, 'OutputSurfaces' + overlapName, 'labelSurfaces')

#Open Json file and parse 
with open(jsonFile) as data_file:    
    data = json.load(data_file)

#Create file for seedList
seedPath = subject_dir + '/seeds.txt'
seedList = open(seedPath, 'w')

#Put all MatrixRow to -1 
for seed in data:
  seed['MatrixRow']=-1

seedID = 0 
#For each file in DIR
# for i in range(int(nb_ROIS)):
#     numberStr = str(i+1)
#     file = DIR_Surfaces + numberStr + ".asc"
#     val = os.path.isfile(file)
#     if (val == True):
#       #Write in seedList Path 
#       seedList.write(file + "\n")
#       seedID = seedID + 1
      #Update JSON file : 'MatrixRow'
for j in data:
  filename = os.path.join(DIR_Surfaces, str(j["AAL_ID"]) + ".asc")
  if(os.path.isfile(file)):
    j['MatrixRow'] = seedID
    seedID = seedID + 1
  	seedList.write(filename + "\n")
     
seedList.close()

#Update JSON file 
with open(jsonFile, 'w') as txtfile:
    json.dump(data, txtfile, indent = 2)
