#--------------------------------------------------------------------------------
#	stopmongo.sh
#
#	Feb 062019  	Initial
#--------------------------------------------------------------------------------
VERSION="stopmongo.sh v 1.00, "
VERSIONDATE="Feb 062019 "
LOG="/tmp/camsnode.log"
SOMETIME=20
#--------------------------------------------------------------------------------
# Logger
#--------------------------------------------------------------------------------
log()
{
        echo "`date '+%Y-%m-%d %H:%M:%S'` : $VERSION $1" >> $LOG
        echo "`date '+%Y-%m-%d %H:%M:%S'` : $1"
}
#---------------------------------------------------------------------------------------
#   Node processes stop
#---------------------------------------------------------------------------------------
MongoStop()
{
  echo
  echo
  log 'Stopping mongodb'
  echo
  ps -edf | grep -v grep | grep -i -e 'mongod' > processlist

  while read line
  do  
    pid=`echo "$line" | awk '/ / { print $2 }';`
    log "[!!!] $pid killed"
    kill $pid
  done < processlist
  rm -f processlist
  echo
  echo
}
#---------------------------------------------------------------------------------------
#   Start here
#---------------------------------------------------------------------------------------
clear
echo
echo $VERSION
echo
MongoStop
exit 0

