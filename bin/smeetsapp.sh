#!/bin/sh

LOGFILE=/var/log/smeetsapp.log
ERRFILE=/var/log/smeetsapp.err

while [ 1 ]; do
	echo "Restarting"
	sleep 2
    cd /opt/smeetsapp/server
	NODE_ENV="development" node app.js >>$LOGFILE 2>>$ERRFILE </dev/null &
	CHILD="$!"
	# avoid the node process to stay running after this script is terminated
	trap "kill $CHILD; exit" exit INT TERM
	wait
done

