#/bin/bash
BASH_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CURRENT_DIR=$(pwd)
cd "$BASH_DIR/../../../../"
echo -e "\e[93mGenerating html templates\x1b[0m"

generateHtml(){
  echo -e "\e[96mGenerating html template with command: node ./cli.js $@ ./test/docs/streetlights.yml html"
  output=$(node ./cli.js "$@" "./test/docs/streetlights.yml" html 2>&1)
  status=$?
  if [ $status -ne 0 ]; then
    echo -e "\x1b[31mCould not generate html template, output from generator was: \x1b[0m"
    echo "$output"
    exit 1
  fi
}

#Regular
generateHtml --output "./test/templates/html/no-params"
cd "$CURRENT_DIR"

echo -e "\e[92mDone generating html templates"

