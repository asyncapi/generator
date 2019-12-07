#/bin/bash
BASH_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CURRENT_DIR=$(pwd)
cd "$BASH_DIR/../../../../"
echo -e "\e[93mGenerating java-spring templates\x1b[0m"

generatejava-spring(){
  echo -e "\e[96mGenerating java-spring template with command: node ./cli.js $@ ./test/docs/streetlights.yml java-spring"
  output=$(node ./cli.js "$@" "./test/docs/streetlights.yml" java-spring 2>&1)
  status=$?
  if [ $status -ne 0 ]; then
    echo -e "\x1b[31mCould not generate java-spring template, output from generator was: \x1b[0m"
    echo "$output"
    exit 1
  fi
}

#Regular
generatejava-spring --output "./test/templates/java-spring/no-params"
cd "$CURRENT_DIR"

echo -e "\e[92mDone generating java-spring templates"

