from __future__ import print_function
import argparse
import operator
import json
import os 
import sys 
import shutil
import subprocess



#Parameters

# python tractographyScriptApp.py neo-0188-1-4years neo-0188-1-4year_42_DWI_QCed_VC_up1mm.nrrd 
# neo-0188-1-4year-T1_SkullStripped_scaled_DWISpace_up1mm.nrrd DWI_Space_Mask_up1mm.nrrd 
# TABLE_AAL.json stx_neo-0188-1-4year-T1_CombinedSurface_white_AAL.vtk stx_neo-0188-1-4year-T1_CombinedSurface_white_AAL.vtk 
# colour false "set labelID" true true "-n 2" "-P 3000 --steplength=0.75 --sampvox=0.5"

# print("kyle's test run")
# print("SUBJECT = neo-0188-1-4years")
# print("DWI = neo-0188-1-4year_42_DWI_QCed_VC_up1mm.nrrd ")
# print("T1 = neo-0188-1-4year-T1_SkullStripped_scaled_DWISpace_up1mm.nrrd ") 
# print("BRAINMASK = DWI_Space_Mask_up1mm.nrrd") 
# print("PARCELLATION_TABLE = TABLE_AAL.json")
# print("SURFACE = stx_neo-0188-1-4year-T1_CombinedSurface_white_AAL.vtk")
# print("EXTRA_SURFACE_COLOR = stx_neo-0188-1-4year-T1_CombinedSurface_white_AAL.vtk ")
# print("labelSetName = colour")
# print("ignoreLabel = false") 
# print("ignoreLabelID = set labelID") 
# print("overlapping = true")
# print("loopcheck = true") 
# print("bedpostxParam = -n 2")
# print("probtrackParam = -P 3000 --steplength=0.75 --sampvox=0.5")
# print("DWIConvert = ")

parser = argparse.ArgumentParser(description='HERE PUT DESCRIPTION AND LINK GITHUB')

parser.add_argument("--SUBJECT", help = "subject data. ex: neo-0029-1-1year", type = str) # SUBJECT=$1  #ex : neo-0029-1-1year
parser.add_argument("--DWI", help = "DWI data", type = str)# DWI=$2
parser.add_argument("--T1", help = "T1 weighted image", type = str)# T1=$3
parser.add_argument("--BRAINMASK", help = "brain mask", type = str)# BRAINMASK=$4
parser.add_argument("--PARCELLATION_TABLE", type = str)# PARCELLATION_TABLE=$5
parser.add_argument("--SURFACE", help = "surface", type = str)# SURFACE=$6
parser.add_argument("--EXTRA_SURFACE_COLOR", help = "extra surface color", type = str)# EXTRA_SURFACE_COLOR=$7
parser.add_argument("--labelSetName", help = "label set name",type = str)# labelSetName=$8
parser.add_argument("--ignoreLabel", help = "ignore label?", type = bool)# ignoreLabel=$9
parser.add_argument("--ignoreLabelID", help = "ignore label ID?", type = str) # ignoreLabelID=${10}
parser.add_argument("--overlapping", help = "overlapping", type = bool)# overlapping=${11}
parser.add_argument("--loopcheck", help = "loop check", type = bool)# loopcheck=${12}
parser.add_argument("--bedpostxParam", help = "bedpostxParam", type = str)# bedpostxParam=${13}
parser.add_argument("--probtrackParam", help = 'probtrackParam', type = str)# probtrackParam=${14}
parser.add_argument("--DWIConvert", help = "DWI Convert", default = None, type = str)#DWIConvert=/Applications/Slicer.app/Contents/lib/Slicer-4.8/cli-modules/DWIConvert#??? what is this pathway???
args = parser.parse_args()

# print(args.accumulate(args.integers))


def which(name):
    for path in os.getenv("PATH").split(os.path.pathsep):# getenv are a whole bunch of path parameters; os.path.pathstep is a universal way of saying path separater like a colon
        full_path = os.path.join(path,name)
        if os.path.exists(full_path):
            return full_path
    return None

#tractography

def tractscript(args):
    
    current_directory = os.getcwd() # $var=pwd
    
    #DO TRACTOGRAPHY SCRIPT 
    
    DWIConvert= args.DWIConvert
    if DWIConvert is None: #what is the difference between and empty string and None 
        DWIConvert = which("DWIConvert")
    if DWIConvert is None:
        print("Error: DWIConvert Not Found", file=sys.stderr)
        sys.exit(1)
        
    #### Variables ####
    print("Parameters:", args.SUBJECT, args.DWI, args.T1 , args.BRAINMASK, args.PARCELLATION_TABLE, args.SURFACE, args.EXTRA_SURFACE_COLOR, args.labelSetName, args.ignoreLabel, args.ignoreLabelID, args.overlapping, args.loopcheck, args.bedpostxParam, args.probtrackParam) #echo Parameters : $1 $2 $3 $4 $5 $6 $7 $8 $9 ${10} ${11} ${12} ${13} ${14}"
    #Maximum number of ROIS in parcellation table
    number_ROIS = 150
    #name define by probtrackx2 tool
    matrix = "fdt_network_matrix" #not sure if this is supposed to be a variable or a name?
    
    if args.overlapping == "true": #if [ "${11}" = "true" ]; then 
        overlapFlag = "--overlapping" #overlapFlag="--overlapping"
        overlapName = "_overlapping" #overlapName="_overlapping"
    else:
        overlapFlag = ""
        overlapName = ""
    #Loopchech
    if args.loopcheck == "true": #if [ "${12}" = "true" ]; then 
        loopcheckFlag = "--loopcheck"
        loopcheckName = "_loopcheck"
    else: 
        loopcheckFlag = ""
        loopcheckName = ""

    ##### TRACTOGRAPHY PIPELINE #####
    print("Tool is running .. ")#echo "Tool is running .. "
    
    #Create subject DIR 
    if not os.path.exists(args.SUBJECT):
        os.mkdir(args.SUBJECT + "test")
        print("Subject directory already created")#mkdir $SUBJECT
    #Copy JSON table in subject DIR 
    TABLE_name = os.path.basename(args.PARCELLATION_TABLE) #TABLE_name=$(basename ${PARCELLATION_TABLE})
    NEWPARCELLATION_TABLE = os.path.join(current_directory, args.SUBJECT + "test" ,TABLE_name)#NEWPARCELLATION_TABLE=$var/$SUBJECT/${TABLE_name}
    shutil.copyfile(args.PARCELLATION_TABLE, NEWPARCELLATION_TABLE) #cp ${PARCELLATION_TABLE} ${NEWPARCELLATION_TABLE}
    
    #Create Diffusion data for bedpostx 
    print("Create Diffusion data ...")

    DiffusionData = os.path.join(args.SUBJECT, "Diffusion", "data.nii.gz") #DiffusionData=$SUBJECT/Diffusion/data.nii.gz
    DiffusionBrainMask = os.path.join(args.SUBJECT, "Diffusion"," nodif_brain_mask.nii.gz")
    
    if os.path.exists(DiffusionData) and os.path.exists(DiffusionBrainMask): #if [ -e $DiffusionData ] && [ -e $DiffusionBrainMask ]; then 
        #Check if already process   
        print("Diffusion Data already created ")
    else:
        if not os.path.exists(os.path.join(args.SUBJECT,"Diffusion")):
            os.mkdir(os.path.join(args.SUBJECT,"Diffusion"))
        print("DWIConvert : nodif_brain_mask.nii.gz")
        arguments = [DWIConvert,"--inputVolume", args.BRAINMASK, "--conversionMode", "NrrdToFSL", "--outputVolume", DiffusionBrainMask, "--outputBVectors", os.path.join(args.SUBJECT, "Diffusion", "bvecs.nodif"), "--outputBValues", os.path.join(args.SUBJECT, "Diffusion", "bvals.temp")]
        #DWIConvert --inputVolume ${BRAINMASK} --conversionMode NrrdToFSL --outputVolume ${DiffusionBrainMask} --outputBVectors ${SUBJECT}/Diffusion/bvecs.nodif --outputBValues ${SUBJECT}/Diffusion/bvals.temp
        DWIConvertBRAINMASK = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = DWIConvertBRAINMASK.communicate()
        print("DWIConvertBRAINMASK out: ", out) #is this correct
        print("DWIConvertBRAINMASK err: ", err)

        print("DWIConvert : data.nii.gz")
        arguments = [DWIConvert, "--inputVolume", args.DWI, "--conversionMode", "NrrdToFSL", "--outputVolume", DiffusionData, "--outputBVectors", os.path.join(args.SUBJECT, "Diffusion", "bvecs"), "--outputBValues", os.path.join(args.SUBJECT, "Diffusion", "bvals")]  
        DWIConvertData = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = DWIConvertData.communicate()
        print("DWIConvertData out: ", out) #is this correct
        print("DWIConvertData err: ", err)
        print("Create Diffusion data done !")

        if not os.path.exists(DiffusionData) or not os.path.exists(DiffusionBrainMask) or not os.path.exists(os.path.join(args.SUBJECT, "Diffusion", "bvecs")) or not os.path.exists(os.path.join(args.SUBJECT, "Diffusion", "bvals")):#if [ ! -e $DiffusionData ] || [ ! -e $DiffusionBrainMask ] || [ ! -e ${SUBJECT}/Diffusion/bvecs ] || [ ! -e ${SUBJECT}/Diffusion/bvals ]; then
            print("ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY")#is this supposed to be a string or what????#echo ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY
        else:
            print("Create diffusion data done !")#echo "Create diffusion data done !"
    
    bedpostx = args.bedpostxParam
    if bedpostx is None: #what is the difference between and empty string and None 
        bedpostx = which("bedpostx")
    if bedpostx is None:
        print("Error: bedpostx Not Found", file=sys.stderr)
        sys.exit(1)
        
    
    #Bedpostx 
    print("Run bedpostx ...{SUBJECT}/Diffusion ${bedpostxParam}")#echo "Run bedpostx ...{SUBJECT}/Diffusion ${bedpostxParam}"
    arguments = [bedpostx, os.path.join(args.SUBJECT, "Diffusion"), args.bedpostxParam]#bedpostx ${SUBJECT}/Diffusion ${bedpostxParam}
    bedpostxRun = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = bedpostxRun.communicate()
    print("bedpostxRun out: ", out) #is this correct
    print("bedpostxRun err: ", err)
    print("Bedpostx done !")
    
    #Create labelSurfaces 
    os.mkdir(os.path.join(args.SUBJECT, ("OutputSurfaces" + overlapName)))#mkdir ${SUBJECT}/OutputSurfaces${overlapName}
    SURFACES = os.path.join(args.SUBJECT, ("OutputSurfaces" + overlapName), "labelSurfaces")#SURFACES=${SUBJECT}/OutputSurfaces${overlapName}/labelSurfaces
    
    ExtractLabelSurfaces = args.SURFACE#is Surface the right argparse variable passed in 
    if ExtractLabelSurfaces is None:
        ExtractLabelSurfaces = which("SURFACE")
    if ExtractLabelSurfaces is None:
        print("Error: SURFACE Not Found", file=sys.stderr)
        sys.exit(1)
        
    
    if os.path.exists(SURFACES): #can we use os.path.exists() here #if [ -d ${SURFACES} ]; then
        print("Label already created")#echo "Label already created"
    else:
        if args.ignoreLabel == "true": #if [ "${ignoreLabel}" = "true" ]; then 
            ignoreFlag="--ignoreLabel"
            labelID = args.ignoreLabelID
            print("ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile ${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile ${SURFACE} ${overlapFlag} ${ignoreFlag} \"${labelID}\"")
            arguments = [ExtractLabelSurfaces," --extractPointData"," --translateToLabelNumber"," --labelNameInfo", os.path.join(current_directory, args.SUBJECT, ("OutputSurfaces" + overlapName), "labelListName.txt"), "--labelNumberInfo", os.path.join(current_directory, args.SUBJECT, ("OutputSurfaces" + overlapName), "labelListNumber.txt"), "--useTranslationTable", "--labelTranslationTable", NEWPARCELLATION_TABLE, "-a", args.labelSetName, "--vtkLabelFile", os.path.join(current_directory, args.EXTRA_SURFACE_COLOR), "--createSurfaceLabelFiles", "--vtkFile", os.path.join(current_directory, args.SURFACE), overlapFlag, ignoreFlag, labelID]
            ExtractLabelSurfacesRun = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = ExtractLabelSurfacesRun.communicate()
            print("ExtractLabelSurfacesRun out: ", out) #is this correct
            print("ExtractLabelSurfacesRun err: ", err)
        else:
            print("ExtractLabelSurfaces --extractPointData --translateToLabelNumber --labelNameInfo $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListName.txt --labelNumberInfo  $var/${SUBJECT}/OutputSurfaces${overlapName}/labelListNumber.txt --useTranslationTable --labelTranslationTable ${NEWPARCELLATION_TABLE} -a ${labelSetName} --vtkLabelFile ${EXTRA_SURFACE_COLOR} --createSurfaceLabelFiles --vtkFile ${SURFACE} ${overlapFlag}")
            arguments = ["ExtractLabelSurfaces", "--extractPointData", "--translateToLabelNumber", "--labelNameInfo", os.path.join(args.SUBJECT, ("OutputSurfaces" + overlapName), "labelListName.txt"), "--labelNumberInfo",  os.path.join(args.SUBJECT, ("OutputSurfaces" + overlapName), "labelListNumber.txt"), "--useTranslationTable", "--labelTranslationTable", NEWPARCELLATION_TABLE, "-a", args.labelSetName, "--vtkLabelFile", os.path.join(current_directory, args.EXTRA_SURFACE_COLOR), "--createSurfaceLabelFiles", "--vtkFile", os.path.join(current_directory, args.SURFACE), overlapFlag]
            ExtractLabelSurfacesRun = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = ExtractLabelSurfacesRun.communicate()
            print("ExtractLabelSurfacesRun out: ", out) #is this correct
            print("ExtractLabelSurfacesRun err: ", err)
        if os.path.exists(SURFACES):
            print("ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY",file=sys.stderr )
        else:
            print("Surfaces extraction done!") 
 
        shutil.move(os.path.join(current_directory,"labelSurfaces"), SURFACES) ## necessary because ExtractLabelSurfaces outputs to the current directory #mv $var/labelSurfaces $SURFACES
    
    os.chdir(current_directory)#cd $var 
    #Write seed list 
    os.remove(os.path.join(args.SUBJECT, "seeds.txt"))#rm ${SUBJECT}/seeds.txt
    arguments = ["python", os.path.join("nas02","home","j","p", "jprieto", "tools", "writeSeedList.py"), args.SUBJECT, overlapName, NEWPARCELLATION_TABLE, number_ROIS]
    #python /nas02/home/j/p/jprieto/tools/writeSeedList.py ${SUBJECT} ${overlapName} ${NEWPARCELLATION_TABLE} ${number_ROIS}
    WriteSeedList = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = WriteSeedList.communicate()
    print("WriteSeedList out: ", out) #is this correct
    print("WriteSeedList err: ", err)

    if os.path.exists(os.path.join(args.SUBJECT, "seeds.txt")):#if [ ! -e  ${SUBJECT}/seeds.txt ]; then
        print("ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY", file=sys.stderr)
    else:
        print("Creation of seed list done ! ")
    
    #Do tractography with probtrackx2
    NETWORK_DIR = os.path.join(args.SUBJECT, ("Network" + overlapName + loopcheckName))
    replace = "nii.gz"
    t1 = args.T1 #t1=$T1
    T1_nifti = os.path.join(t1,"/","nrrd",replace)#T1_nifti=${t1//nrrd/$replace}
    matrixFile = os.path.join(NETWORK_DIR, matrix)
    
    probtrackx2 = args.probtrackParam#is Surface the right argparse variable passed in 
    if probtrackx2 is None:
        probtrackx2 = which("probtrackx2")
    if probtrackx2 is None:
        print("Error: probtrackx2 Not Found", file=sys.stderr)
        sys.exit(1)
    
    if os.path.exists(matrixFile):#if [ -e $matrixFile ]; then
        print("probtrackx already proceed")
    else:
        print("Convert T1 image to nifti format ")
        arguments = [DWIConvert, "--inputVolume", args.T1, "--conversionMode", "NrrdToFSL", "--outputVolume", T1_nifti, "--outputBValues", os.path.join(args.SUBJECT, "bvals.temp"), "--outputBVectors", os.path.join(args.SUBJECT, "bvecs.temp")]
        #DWIConvert --inputVolume ${T1} --conversionMode NrrdToFSL --outputVolume ${T1_nifti} --outputBValues ${SUBJECT}/bvals.temp --outputBVectors ${SUBJECT}/bvecs.temp
        DWIConvert = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = DWIConvert.communicate()
        print("DWIConvert out: ", out) #is this correct
        print("DWIConvert err: ", err)
        print("T1 image conversion done ! ")
    
        print("Start Probtrackx ")
        print("probtrackx2 --samples=${SUBJECT}/Diffusion.bedpostX/merged --mask=${SUBJECT}/Diffusion.bedpostX/nodif_brain_mask --seed=${SUBJECT}/seeds.txt --seedref=${T1_nifti} --forcedir --network --omatrix1 -V 1 --dir=${NETWORK_DIR} --stop=${SUBJECT}/seeds.txt ${probtrackParam} ${loopcheckFlag} ")
    
        
        arguments = [probtrackx2, ("--samples=" + os.path.join(args.SUBJECT,"Diffusion.bedpostX", "merged")), ("--mask=" + os.path.join(args.SUBJECT, "Diffusion.bedpostX", "nodif_brain_mask")), ("--seed=" + os.path.join(args.SUBJECT, "seeds.txt")), ("--seedref=" + T1_nifti), "--forcedir", "--network", "--omatrix1", "-V", 0,("--dir=" + NETWORK_DIR), ("--stop=" + (os.path.join(args.SUBJECT, "seeds.txt"))), args.probtrackParam, loopcheckFlag]
        probtrackxRun = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = probtrackxRun.communicate()
        print("probtrackxRun out: ", out) #is this correct
        print("probtrackxRun err: ", err)
      

        if os.path.exists(matrixFile):
            print("ERROR_PIPELINE_PROBTRACKBRAINCONNECTIVITY",file=sys.stderr)
        else:    
            print("Probtrackx done !")

    #Normalize the matrix and save plot as PDF file 
    #erase old matrix saved
    os.remove(matrixFile + "_normalized.pdf")
    if os.path.exists(matrixFile):
        print("Normalize and plot connectivity matrix...")
        arguments = ["python", os.path.join("nas02","home","d","a","danaele","tools","bin","plotMatrix.py"), args.SUBJECT, matrixFile, overlapName,loopcheckName]
        #python /nas02/home/d/a/danaele/tools/bin/plotMatrix.py ${SUBJECT} ${matrixFile} ${overlapName} ${loopcheckName}
        PlotConnectivityMatrix = subprocess.Popen(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = PlotConnectivityMatrix.communicate()
        print("PlotConnectivityMatrix out: ", out) #is this correct
        print("PlotConnectivityMatrix err: ", err)

        print("End, matrix save.")
    else:
        print("Output of probtrackx2 not here - error during the pipeline")
    print("Pipeline done!")
    

    
    
if __name__ == '__main__':
    tractscript(args)

