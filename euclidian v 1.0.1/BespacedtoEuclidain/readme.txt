Author: Argyll McGhie
No Lic do as you will


To run the program,
have the program in the same folder as the data file and run 
and then enter data file name for example (thisdata.txt)



For Bespaced data to xyz and hex.
This formats the data and places it into a javascript array file format.
Removes all bloat, including zero and infinity.
Removes the UV
Reduces the decimal format from .^15 to .^3

After running you will have

1. original file
2. rgb file
3. hex file
4 xyz data file
5. xyz data file with partial distance reomved.

After you run the program you must check the back of the file for any error checking. Somtimes the last
xyz has only 2 for example [0,0]
it needs to be [0,0,0]] (and the final square bracket)

also for some unknow reson the remove floor does not always work, but its only needed in some cases.




