# CIVILITY-TRACTOGRAPHY

This directory contains scripts which must be executable in the computing grid. 

The main scripts : 

- tractographyScriptApp.sh
 	
is calling two python scripts : 

- writeSeedList.py
- plotMatrix.py

Others addtionnal tools must be installed in the computing grid : 

  - ExtractLabelSurfaces : https://github.com/NiRALUser/ExtractLabelSurfaces
  - DWIConvert : https://github.com/BRAINSia/BRAINSTools/tree/master/DWIConvert
  - FSL : http://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FslInstallation
  
The CMakeLists.txt file is building both tools : ExtractLabelSurfaces and DWIConvert
FSL tool must be install separately.  
