#/bin/bash
BASH_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

#generate html templates
bash "$BASH_DIR/templates/html.bash"

#generate java-spring templates
bash "$BASH_DIR/templates/java-spring.bash"
