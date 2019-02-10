#--------------------------------------------------------------------------------
#	nodeadmin.sh
#
#	Jan 26 2019  	Initial
#	Jan 28 2019  	Add code to the three utility routines
#	Jan 29 2019  	Startup procedure
#               Minor details, date format...
#	Jan 30 2019  	Shorten log message
#               Capability to strat only one component
#	Jan 31 2019  	No tail -f
#	Feb 06 2019  	Manage mongo DB
#	Feb 08 2019  	Manage mongo DB, but separate from node...
#	Feb 10 2019  	No wait after start stop actions
#--------------------------------------------------------------------------------
VERSION="nodeadmin.sh v 1.34, "
VERSIONDATE="Feb 10 2019 "
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
#   usage
#---------------------------------------------------------------------------------------
Usage()
{
  echo
  echo
  echo "./nodeadmin.sh start|stop|status [procselector]"
  echo 
  echo "With start, can optionnaly specify a procselector."
  echo "Possible values are : all|web|api|mongo"
  echo
  echo
}
#---------------------------------------------------------------------------------------
#   Node processes startup
#---------------------------------------------------------------------------------------
NodeStart()
{
  NodeStop    # In case processes are already there
  curdir=`pwd`
  cd $CAMS
  echo
  echo

  case $proclist in 
    ALL)  log "Start all processes"
            log "#1 Web app"
            npm run dev&
            log "#2 the API server"
            # Cannot use an alias or a shell variable so use the full path
            $CAMS/node_modules/forever/bin/forever --no-colors start server.js
            ;;
    WEB)  log "Start WEB process"
            log "#1 Web app"
            npm run dev&
            ;;
    API)  log "Start API processes"
            log "#2 the API server"
            # Cannot use an alias or a shell variable so use the full path
            $CAMS/node_modules/forever/bin/forever --no-colors start server.js
            ;;
    MONGO)  log "Start mongodb"
            log "#3 the DB server: log in mongo account"
            su - mongo startmongo.sh
            ;;
  esac

  echo
  cd $curdir
  tput sgr0
  echo
}
#---------------------------------------------------------------------------------------
#   Node processes stop
#---------------------------------------------------------------------------------------
NodeStop()
{
  echo
  echo
  echo

  case $proclist in 
    ALL)    log "Stop all node processes"
            ps -edf | grep -v grep | grep -i -e 'webpack-dev-server
nodemon
/TOOLS/node/bin/node' > processlist
            while read line
            do  
              pid=`echo "$line" | awk '/ / { print $2 }';`
              log "[!!!] $pid killed"
              kill $pid
            done < processlist
            rm -f processlist
            ;;
    WEB)    log "Stop the WEBpack node process"
            ps -edf | grep -v grep | grep -i -e 'webpack-dev-server' > processlist
            while read line
            do  
              pid=`echo "$line" | awk '/ / { print $2 }';`
              log "[!!!] $pid killed"
              kill $pid
            done < processlist
            rm -f processlist
            ;;
    API)    log "Stop the API node process"
            ps -edf | grep -v grep | grep -i -e 'nodemon
/TOOLS/node/bin/node' > processlist
            while read line
            do  
              pid=`echo "$line" | awk '/ / { print $2 }';`
              log "[!!!] $pid killed"
              kill $pid
            done < processlist
            rm -f processlist
            ;;
    MONGO)  log "Stop mongodb"
            log "#3 the DB server: log in mongo account"
            su - mongo stopmongo.sh
            ;;
  esac
  echo
  echo
}
#---------------------------------------------------------------------------------------
#   Node processes status
#---------------------------------------------------------------------------------------
NodeStatus()
{
  echo
  echo 'Node processes status'
  echo
  ps -edf | grep -v grep | grep -i -e 'webpack-dev-server
nodemon
/TOOLS/node/bin/node
mongod' > processlist

  while read line
  do  
    pid=`echo "$line" | awk '/ / { print $2 }';`
    ppid=`echo "$line" | awk '/ / { print $3 }';`
    processname=`echo $line | cut -d ' ' -f 8-`
    log "[] $pid $ppid $processname"
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
echo $VERSION $VERSIONDATE
echo
if [ -z $1 ]
then
  Usage
  echo
  exit 1
fi
if [ -z $2 ]
then
  proclist="ALL"
else
  procselector=`echo $2 | tr a-z A-Z`
  case $procselector in 
    'ALL')  
            proclist="ALL"
            ;;
    'WEB')  
            proclist="WEB"
            ;;
    'API')  
            proclist="API"
            ;;
    'MONGO')  
            proclist="MONGO"
            ;;
    *)      log "Invalid selector : $procselector"
            Usage
            exit 1
            ;;
  esac
fi

case $1 in 
  'start')  NodeStart
            ;;
  'stop')   NodeStop
            ;;
  'status') NodeStatus
            ;;
  *)        NodeStatus
            ;;
esac

exit 0

