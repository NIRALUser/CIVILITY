#!/bin/sh 


npm link src/civility-static/ 
npm link civility-static
npm install

cd src/civility-static/civility
bower install
