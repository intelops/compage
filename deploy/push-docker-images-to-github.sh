#!/bin/bash

source build-docker-images.sh

# push docker images for core, app and ui
docker push $CORE_IMAGE
docker push $APP_IMAGE
docker push $UI_IMAGE
docker push $LLM_BACKEND_IMAGE