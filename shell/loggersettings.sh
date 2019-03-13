#--------------------------------------------------------------------------------
#	loggersettings.sh
#
#	Mar 2019  	Initial
#--------------------------------------------------------------------------------
VERSION="loggersettings.sh v 1.03, "

DEBUG=0;
INFORMATIONAL=1;
WARNING=2;
ERROR=3;
FATAL=4;
export LOGMODE=$DEBUG
export LOGFILE='/tmp/nodejs-logfile.log'
