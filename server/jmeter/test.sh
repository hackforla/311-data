# choose a test plan and give the test a name
# results will appear in the out folder


PLAN_NAME=Main
TEST_NAME=Main-06-27-2020

mkdir -p out

jmeter -n \
  -t plans/${PLAN_NAME}.jmx \
  -l out/${TEST_NAME}/results.jtl \
  -e -o out/${TEST_NAME}/report \
  -j out/${TEST_NAME}/jmeter.log

open out/${TEST_NAME}/report/index.html
