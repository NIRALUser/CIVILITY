#CIVILITY

CIVILITY (cloud based Interractive Visualization of Tractography Brain Connectome) is a HAPI plugins used to visualized easily brain connectomes within an interactive web interface. This plugin configured with the HAPI plugin execution-server launches tractography scripts on a computing grid and uses a database to store data. The brain connectome is computed with a probabilistic tractography method (FSL tools) using surfaces as seeds.


##USAGE for TRACTOGRAPHY 

### 1. Inputs file 

 - DWI image (in diffusion space, nrrd format)
 - T1 image (in diffusion space, nrrd format)
 - Brain mask (in diffusion space, nrrd format)
 - Parcellation table, json file which describe the brain atlas in brain surfaces (format json)
 - Brain Surface. This is a VTK file which represent the white matter surface. This surface must be in the diffusion space. 
		If white matter surface doesn't contain labels informations, upload another surface (same mesh, in diffusion space, vtk format) containning labels informations.


### 2. Output connectivity matrix  

(example : 5 seeds )

0  0  713804  0  22 <br/>
6  0  12  628238  0<br/>
564497  10  0  47  148119<br/>
0  693669  289  0  8<br/>
27  0  194885  2  0<br/>


##USAGE for VISUALISATION 

### 1. Inputs file 

#### - Connectivity matrix

(example : 5 seeds )

0  0  713804  0  22 
6  0  12  628238  0
564497  10  0  47  148119
0  693669  289  0  8
27  0  194885  2  0


#### - Parcellation table 

(example : 5 ROIs)

[
  {
    "VisuOrder": 78, 
    "MatrixRow": 1, 
    "name": "Precentral_L", 
    "VisuHierarchy": "seed.left.frontal.", 
    "coord": [
      -38.649999999999999, 
      -5.6799999999999997, 
      50.939999999999998
    ], 
    "labelValue": "131 44 78", 
    "AAL_ID": 1
  }, 
  {
    "VisuOrder": 1, 
    "MatrixRow": 2, 
    "name": "Precentral_R", 
    "VisuHierarchy": "seed.right.frontal.", 
    "coord": [
      41.369999999999997, 
      -8.2100000000000009, 
      52.090000000000003
    ], 
    "labelValue": "241 43 17", 
    "AAL_ID": 2
  }, 
  {
    "VisuOrder": 77, 
    "MatrixRow": 3, 
    "name": "Frontal_Sup_L", 
    "VisuHierarchy": "seed.left.frontal.", 
    "coord": [
      -18.449999999999999, 
      34.810000000000002, 
      42.200000000000003
    ], 
    "labelValue": "126 31 21", 
    "AAL_ID": 3
  }, 
  {
    "VisuOrder": 2, 
    "MatrixRow": 4, 
    "name": "Frontal_Sup_R", 
    "VisuHierarchy": "seed.right.frontal.", 
    "coord": [
      21.899999999999999, 
      31.120000000000001, 
      43.82
    ], 
    "labelValue": "70 93 250", 
    "AAL_ID": 4
  }, 
  {
    "VisuOrder": 76, 
    "MatrixRow": 5, 
    "name": "Frontal_Sup_Orb_L", 
    "VisuHierarchy": "seed.left.frontal.", 
    "coord": [
      -16.559999999999999, 
      47.32, 
      -13.31
    ], 
    "labelValue": "19 164 195", 
    "AAL_ID": 5
  }
 ]

### 2. Output visualisation 

![Connectivity matrix visualization](https://www.google.fr/images/srpr/logo11w.png "google logo")