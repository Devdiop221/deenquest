#!/bin/bash

# DeenQuest - Run All Tests Script
echo "🧪 Running all tests for DeenQuest..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2 passed${NC}"
    else
        echo -e "${RED}❌ $2 failed${NC}"
    fi
}

# Initialize counters
total_tests=0
passed_tests=0

echo "📱 Running Native App Tests..."
cd apps/native
npm test -- --ci --coverage --watchAll=false
native_result=$?
total_tests=$((total_tests + 1))
if [ $native_result -eq 0 ]; then
    passed_tests=$((passed_tests + 1))
fi
print_status $native_result "Native App Tests"
cd ../..

echo ""
echo "🖥️  Running Server Tests..."
cd apps/server
npm test -- --ci --coverage
server_result=$?
total_tests=$((total_tests + 1))
if [ $server_result -eq 0 ]; then
    passed_tests=$((passed_tests + 1))
fi
print_status $server_result "Server Tests"
cd ../..

echo ""
echo "=" $(printf '%.0s=' {1..50})
echo "📊 Test Summary:"
echo "Total test suites: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    echo "📈 Coverage reports generated:"
    echo "- Native: apps/native/coverage/"
    echo "- Server: apps/server/coverage/"
    echo ""
    echo "🚀 Ready for deployment!"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please fix the issues before deploying.${NC}"
    exit 1
fi