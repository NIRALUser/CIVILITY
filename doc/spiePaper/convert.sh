dir=$1
for files in $(ls ./images/temp/*.png)
do
	outname=$(basename ${files%%.png}Out.eps)
	convert $files ./images/$outname
done