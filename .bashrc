#----------------------------------------------------------------------------------------
# .bashrc
#
#	Jan 29 2019		Alias for nodeadmin.sh
#	Feb 01 2019		Change alias for nodeadmin.sh
#	Mar 20 2019		Set working directory after login
#----------------------------------------------------------------------------------------

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

export JAVA_HOME=/app/oracle/products/jdk1.8.0_60
export JH=/app/oracle/products/jdk1.8.0_60
export PATH=$JAVA_HOME/bin:/var/opt/Python-2.7.11:$PATH
export AH=/etc/httpd
export WEB=/var/www/html
export W1=/var/www/html/packt-chap2/express_app
export W2=/var/www/html/packt-chap5
export W3=/var/www/html/packt-chap6
export W4=/var/www/html/vuex-tutorial
export W5=/var/www/html/cams
export CAMS=/var/www/html/cams
export HOST=vboxweb

export PHP=/var/www/php
export PHPHOME=/app/php/php-5.5.31
export OH=/app/oracle/products
export OCIH=/usr/lib/oracle/12.1/client64
export TNS_ADMIN=/app/oracle/products/oci
export ORACLE_HOME=/usr/lib/oracle/12.1/client64
export LD_LIBRARY_PATH=/usr/lib/oracle/12.1/client64/lib

export NODE=/TOOLS/node
export PATH=$NODE/bin:$PATH
export MONGO=/TOOLS/mongo/mongodb-linux-x86_64-rhel62-3.4.10/
export PATH=$MONGO/bin:$PATH
export NODE_DISABLE_COLORS=1

# Used to switch node programs from DEV to PROD
export NODEDEVMODE=true
export NODEURLPREFIX=http://vboxweb:8081
export NODESECRET=thisisthesecretkey
# Vuex tutorial and CAMS tests
export CAMUSER=yves
export CAMPASS=dumb
export CAMURL="https://jsonplaceholder.typicode.com/users/2"

# User specific aliases and functions
alias shsys='ps -edf | grep -i '
alias hh='history | grep -i '
alias lrtl='ls -rtl'
alias lal='ls -al'
alias motd='cat /etc/motd'
alias sshagent='eval "$(ssh-agent -s)"'
alias mongo='mongo --port 4100 --quiet'
alias nodemon='nodemon --no-colors'
alias renv='. ~/.bashrc'
alias forever='$CAMS/node_modules/forever/bin/forever --no-colors'
alias nod='$CAMS/shell/nodeadmin.sh'

cd $CAMS
