#!/bin/bash

#DO TRACTOGRAPHY SCRIPT 

function help
{
        echo "Executes the tractography pipeline version 2.0"
        echo $0
        echo "Options: "
        echo "--subject <subject name>"
        echo "--dwi <dwi image filename>"
        echo "--t1 <t1 image filename>" 
        echo "--mask <mask image filename>"
        echo "--table <table.json filename>"
        echo "--surface <surface filename>"
        echo "--extra_surface <additional surface with labels name>"
        echo "--label_name <label name in surface>"
        echo "--ignoreLabel <ignore a label label number>"
        echo "--overlapping <overlapping surfaces name>"
        echo "--loopcheck <lookcheck true/false>"
        echo "--bedpostxParam <bedpostx extra params>"
        echo "--probtrackParam <probtrackx extra params>"
        
        exit
}

SUBJECT=""
DWI=""
T1=""
BRAINMASK=""
PARCELLATION_TABLE=""
SURFACE=""
EXTRA_SURFACE_COLOR=""
labelSetName=""
ignoreLabel=""
overlapping=""
loopcheck=""
bedpostxParam=""
probtrackParam=""

previous=""
for var in "$@"
do
        if [ "$previous" == "-subject" ] || [ "$previous" == "--subject" ];
        then
                SUBJECT=$var
        fi

        if [ "$previous" == "-dwi" ] || [ "$previous" == "--dwi" ];
        then
                DWI=$var
        fi

        if [ "$previous" == "-t1" ] || [ "$previous" == "--t1" ];
        then
                T1=$var
        fi

        if [ "$previous" == "-mask" ] || [ "$previous" == "--mask" ];
        then
                BRAINMASK=$var
        fi

        if [ "$previous" == "-table" ] || [ "$previous" == "--table" ];
        then
                PARCELLATION_TABLE=$var
        fi

        if [ "$previous" == "-surface" ] || [ "$previous" == "--surface" ];
        then
                SURFACE=$var
        fi

        if [ "$previous" == "-extra_surface" ] || [ "$previous" == "--extra_surface" ];
        then
                EXTRA_SURFACE_COLOR=$var
        fi

        if [ "$previous" == "-label_name" ] || [ "$previous" == "--label_name" ];
        then
                labelSetName=$var
        fi

        if [ "$previous" == "-ignore_label" ] || [ "$previous" == "--ignore_label" ];
        then
                ignoreLabel=$var
        fi

        if [ "$previous" == "-overlapping" ] || [ "$previous" == "--overlapping" ];
        then
                overlapping=$var
        fi

        if [ "$previous" == "-loopcheck" ] || [ "$previous" == "--loopcheck" ];
        then
                loopcheck=$var
        fi

        if [ "$previous" == "-bedpostxParam" ] || [ "$previous" == "--bedpostxParam" ];
        then
                bedpostxParam=$var
        fi

        if [ "$previous" == "-probtrackParam" ] || [ "$previous" == "--probtrackParam" ];
        then
                probtrackParam=$var
        fi

        if [ "$previous" == "-h" ] || [ "$previous" == "--help" ];
        then
                help
        fi

        previous=$var
done

#Parameters
########################################################################
# SUBJECT=$1  #ex : neo-0029-1-1year
# DWI=$2
# T1=$3
# BRAINMASK=$4
# PARCELLATION_TABLE=$5
# SURFACE=$6
# EXTRA_SURFACE_COLOR=$7
# labelSetName=$8
# ignoreLabel=$9
# ignoreLabelID=${10}
# overlapping=${11}
# loopcheck=${12}
# bedpostxParam=${13}
# probtrackParam=${14}
########################################################################

if [ "$EXTRA_SURFACE_COLOR" == "" ]; then
  EXTRA_SURFACE_COLOR=$SURFACE
fi

WRITESEEDLISTSCRIPT=$(which writeSeedList.py)
PLOTMATRIXSCRIPT=$(which plotMatrix.py)

var=$(pwd)
#### Variables ####
echo "Subject: $SUBJECT" 
echo "dwi: $DWI"
echo "t1: $T1"
echo "brain mask: $BRAINMASK"
echo "parcellation table: $PARCELLATION_TABLE"
echo "surface: $SURFACE"
echo "extra surface: $EXTRA_SURFACE_COLOR"
echo "labelSetName: $labelSetName"
echo "ignore lable: $ignoreLabel"
echo "ignore label id: $ignoreLabelID"
echo "overlapping $overlapping"
echo "loopcheck: $loopcheck"
echo "bedpostx params: $bedpostxParam"
echo "probtrack params: $probtrackParam"
echo "write seed lists script: $WRITESEEDLISTSCRIPT"
echo "plot matrix script: $PLOTMATRIXSCRIPT"

#Maximum number of ROIS in parcellation table
number_ROIS=150
#name define by probtrackx2 tool
matrix=fdt_network_matrix

#Overlapping
if [ "$overlapping" == "true" ]; then 
  overlapFlag="--overlapping"
  overlapName="_overlapping"  
else
  overlapFlag=""
  overlapName=""  
fi
#Loopchech
if [ "$loopcheck" == "true" ]; then 
  loopcheckFlag="--loopcheck"
  loopcheckName="_loopcheck"
else 
  loopcheckFlag=""
  loopcheckName=""
fi

#Create subject DIR 
command="mkdir $SUBJECT"
echo $command
eval $command

#Copy JSON table in subject DIR 
TABLE_name=$(basename ${PARCELLATION_TABLE})
NEWPARCELLATION_TABLE=$var/$SUBJECT/${TABLE_name}
cp ${PARCELLATION_TABLE} ${NEWPARCELLATION_TABLE}

#Create Diffusion data for bedpostx 
echo "Create Diffusion data ..."

DiffusionData=$SUBJECT/Diffusion/data.nii.gz
DiffusionBrainMask=$SUBJECT/Diffusion/nodif_brain_mask.nii.gz

if [ ! -d "$SUBJECT/Diffusion" ];
  then
  command="mkdir $SUBJECT/Diffusion"
  echo $command
  eval $command
fi

echo 
command="DWIConvert --inputVolume ${BRAINMASK} --conversionMode NrrdToFSL --outputVolume ${DiffusionBrainMask} --outputBVectors ${SUBJECT}/Diffusion/bvecs.nodif --outputBValues ${SUBJECT}/Diffusion/bvals.temp"
echo $command
eval $command

echo
command="DWIConvert --inputVolume ${DWI} --conversionMode NrrdToFSL --outputVolume ${DiffusionData} --outputBVectors ${SUBJECT}/Diffusion/bvecs --outputBValues ${SUBJECT}/Diffusion/bvals"
echo $command
eval $command

#Bedpostx
echo
command="bedpostx ${SUBJECT}/Diffusion ${bedpostxParam}"
echo $command
eval $command

#Create labelSurfaces 
if [ ! -d "${SUBJECT}/OutputSurfaces${overlapName}" ]; then
  mkdir -p "${SUBJECT}/OutputSurfaces${overlapName}"
fi

SURFACES=${SUBJECT}/OutputSurfaces${overlapName}/labelSurfaces

if [ -d "$SURFACES" ]; then
  rm -rf $SURFACES
fi

if [ "${ignoreLabel}" != "" ]; then 
  ignoreFlag="--ignoreLabel"
  labelID="${ignoreLabel}"
  echo
  command="ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile $var/${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile $var/${SURFACE} ${overlapFlag} ${ignoreFlag} \"${labelID}\""
  echo $command
  eval $command
else
  echo
  command="ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo ${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  ${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile $var/${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile $var/${SURFACE} ${overlapFlag}"
  echo $command
  eval $command
fi

command="mv $var/labelSurfaces $SURFACES" 
echo $command
eval $command

#Write seed list 
if [ -f "${SUBJECT}/seeds.txt" ]; then
  rm ${SUBJECT}/seeds.txt
fi

echo
command="python $WRITESEEDLISTSCRIPT ${SUBJECT} ${overlapName} ${NEWPARCELLATION_TABLE} ${number_ROIS}"
echo $command
eval $command

#Do tractography with probtrackx2
NETWORK_DIR=${SUBJECT}/Network${overlapName}${loopcheckName}
replace="nii.gz"
t1=$T1 
T1_nifti=${t1//nrrd/$replace}
matrixFile=${NETWORK_DIR}/${matrix} 

echo "Convert T1 image to nifti format "
command="DWIConvert --inputVolume ${T1} --conversionMode NrrdToFSL --outputVolume ${T1_nifti} --outputBValues ${SUBJECT}/bvals.temp --outputBVectors ${SUBJECT}/bvecs.temp"
echo $command
eval $command
echo "T1 image conversion done ! "

echo
echo "Start probtrackx "
command="probtrackx2 --samples=${SUBJECT}/Diffusion.bedpostX/merged --mask=${SUBJECT}/Diffusion.bedpostX/nodif_brain_mask --seed=${SUBJECT}/seeds.txt --seedref=${T1_nifti} --forcedir --network --omatrix1 -V 0 --dir=${NETWORK_DIR} --stop=${SUBJECT}/seeds.txt ${probtrackParam} ${loopcheckFlag}"
echo $command
eval $command

#Normalize the matrix and save plot as PDF file 
#erase old matrix saved
echo 
command="python $PLOTMATRIXSCRIPT ${SUBJECT} ${matrixFile} ${overlapName} ${loopcheckName}"
echo $command
eval $command
