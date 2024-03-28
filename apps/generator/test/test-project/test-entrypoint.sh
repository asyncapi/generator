#!/bin/bash

# Goal of this script is to copy mounted drive into a separate folder
# It is to assure the test run is isolated from the host
# apptemp is mounted from host and we do not want to mess in there


# Copy the contents of /apptemp to /app
cp -r /apptemp /app

# Execute the bash script
bash /app/test/test-project/test.sh test-project