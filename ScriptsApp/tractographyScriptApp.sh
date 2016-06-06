#!/bin/sh 

#DO TRACTOGRAPHY SCRIPT 

#Parameters
########################################################################
SUBJECT=$1  #ex : neo-0029-1-1year
DWI=$2
T1=$3
BRAINMASK=$4
PARCELLATION_TABLE=$5
SURFACE=$6
EXTRA_SURFACE_COLOR=$7
labelSetName=$8
ignoreLabel=$9
ignoreLabelID=${10}
overlapping=${11}
loopcheck=${12}
bedpostxParam=${13}
probtrackParam=${14}
########################################################################
var=$(pwd)
#### Variables ####
echo "Parameters : $1 $2 $3 $4 $5 $6 $7 $8 $9 ${10} ${11} ${12} ${13} ${14}"
#Maximum number of ROIS in parcellation table
number_ROIS=150
#name define by probtrackx2 tool
matrix=fdt_network_matrix

#Overlapping
if [ "${11}" = "true" ]; then 
  overlapFlag="--overlapping"
  overlapName="_overlapping"  
else
  overlapFlag=""
  overlapName=""  
fi
#Loopchech
if [ "${12}" = "true" ]; then 
  loopcheckFlag="--loopcheck"
  loopcheckName="_loopcheck"
else 
  loopcheckFlag=""
  loopcheckName=""
fi


##### TRACTOGRAPHY PIPELINE #####
echo "Tool is running .. "

#Create subject DIR 
mkdir $SUBJECT
#Copy JSON table in subject DIR 
TABLE_name=$(basename ${PARCELLATION_TABLE})
NEWPARCELLATION_TABLE=$var/$SUBJECT/${TABLE_name}
cp ${PARCELLATION_TABLE} ${NEWPARCELLATION_TABLE}

#Create Diffusion data for bedpostx 
echo "Wait 2m ..."
sleep 1m
echo "End wait 2m" 
echo "Create Diffusion data ..."
DiffusionData=$SUBJECT/Diffusion/data.nii.gz
DiffusionBrainMask=$SUBJECT/Diffusion/nodif_brain_mask.nii.gz
if [ -e $DiffusionData ] && [ -e $DiffusionBrainMask ]; then 
  #Check if already process
  echo "Diffusion Data already created "
else
  mkdir $SUBJECT/Diffusion
  echo "DWIConvert : nodif_brain_mask.nii.gz"
  DWIConvert --inputVolume ${BRAINMASK} --conversionMode NrrdToFSL --outputVolume ${DiffusionBrainMask} --outputBVectors ${SUBJECT}/Diffusion/bvecs.nodif --outputBValues ${SUBJECT}/Diffusion/bvals.temp

  echo "DWIConvert : data.nii.gz"
  DWIConvert --inputVolume ${DWI} --conversionMode NrrdToFSL --outputVolume ${DiffusionData} --outputBVectors ${SUBJECT}/Diffusion/bvecs --outputBValues ${SUBJECT}/Diffusion/bvals  
  echo "Create Diffusion data done !"
  if [ ! -e $DiffusionData ] || [ ! -e $DiffusionBrainMask ] || [ ! -e ${SUBJECT}/Diffusion/bvecs ] || [ ! -e ${SUBJECT}/Diffusion/bvals ]; then
    echo ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY
  else 
    echo "Create diffusion data done !" 
  fi
fi
 

#Bedpostx 
echo "Run bedpostx ...{SUBJECT}/Diffusion ${bedpostxParam}"
bedpostx ${SUBJECT}/Diffusion ${bedpostxParam}
echo "Bedpostx done !"

#Create labelSurfaces 
mkdir ${SUBJECT}/OutputSurfaces${overlapName}
SURFACES=${SUBJECT}/OutputSurfaces${overlapName}/labelSurfaces

if [ -d ${SURFACES} ]; then
  echo "Label already created"
else
  cd ${SUBJECT}/OutputSurfaces${overlapName}
  if [ "${ignoreLabel}" = "true" ]; then 
    ignoreFlag="--ignoreLabel"
    labelID="${10}"
    echo "ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile ${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile ${SURFACE} ${overlapFlag} ${ignoreFlag} \"${labelID}\" "
     ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile $var/${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile $var/${SURFACE} ${overlapFlag} ${ignoreFlag} "${labelID}"
  else
    echo "ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile ${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile ${SURFACE} ${overlapFlag}"
    ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo ${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  ${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile $var/${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile $var/${SURFACE} ${overlapFlag}
  fi
  if [ ! -d ${SURFACES} ]; then
    echo ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY
  else
    echo "Surfaces extraction done!"	
  fi
 
fi

cd $var 
#Write seed list 
rm ${SUBJECT}/seeds.txt
python /nas02/home/d/a/danaele/tools/bin/writeSeedList.py ${SUBJECT} ${overlapName} ${NEWPARCELLATION_TABLE} ${number_ROIS}
if [ ! -e  ${SUBJECT}/seeds.txt ]; then
 echo ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY
else
 echo "Creation of seed list done ! "
fi


#Do tractography with probtrackx2
NETWORK_DIR=${SUBJECT}/Network${overlapName}${loopcheckName}
replace="nii.gz"
t1=$T1 
T1_nifti=${t1//nrrd/$replace}
matrixFile=${NETWORK_DIR}/${matrix} 
if [ -e $matrixFile ]; then
  echo "probtrackx already proceed"
else
  echo "Convert T1 image to nifti format "
  DWIConvert --inputVolume ${T1} --conversionMode NrrdToFSL --outputVolume ${T1_nifti} --outputBValues ${SUBJECT}/bvals.temp --outputBVectors ${SUBJECT}/bvecs.temp
  echo "T1 image conversion done ! "

  echo "Start probtrackx " 
  echo "probtrackx2 --samples=${SUBJECT}/Diffusion.bedpostX/merged --mask=${SUBJECT}/Diffusion.bedpostX/nodif_brain_mask --seed=${SUBJECT}/seeds.txt --seedref=${T1_nifti} --forcedir --network --omatrix1 -V 1 --dir=${NETWORK_DIR} --stop=${SUBJECT}/seeds.txt ${probtrackParam} ${loopcheckFlag} "

  probtrackx2 --samples=${SUBJECT}/Diffusion.bedpostX/merged --mask=${SUBJECT}/Diffusion.bedpostX/nodif_brain_mask --seed=${SUBJECT}/seeds.txt --seedref=${T1_nifti} --forcedir --network --omatrix1 -V 0 --dir=${NETWORK_DIR} --stop=${SUBJECT}/seeds.txt ${probtrackParam} ${loopcheckFlag}
  if [ ! -e $matrixFile ]; then
   echo ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY
  else 	
   echo "Probtrackx done !"
  fi
fi

#Normalize the matrix and save plot as PDF file 
#erase old matrix saved
rm ${matrixFile}_normalized.pdf
if [ -e $matrixFile ]; then
  echo "Normalize and plot connectivity matrix..."
  python /nas02/home/d/a/danaele/tools/bin/plotMatrix.py ${SUBJECT} ${matrixFile} ${overlapName} ${loopcheckName}
  echo "End, matrix save."
else
  echo "Output of probtrackx2 not here - error during the pipeline"
fi
echo "Pipeline done!"
