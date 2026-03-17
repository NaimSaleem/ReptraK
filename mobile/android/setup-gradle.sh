#!/bin/bash
set -e

GRADLE_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
GRADLE_VERSION="8.3"

if ! command -v gradle &> /dev/null; then
    echo "Gradle not found. Installing..."
    mkdir -p gradle
    cd gradle
    wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip
    unzip gradle-${GRADLE_VERSION}-bin.zip
    export PATH="${PATH}:$(pwd)/gradle-${GRADLE_VERSION}/bin"
fi

echo "Gradle ready at: $(which gradle)"
