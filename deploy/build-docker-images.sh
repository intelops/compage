#######################################################################
# create and push docker images                                       #
#######################################################################
TAG_NAME="0.0.2"
CORE_IMAGE="ghcr.io/mahendraintelops/compage/core:$TAG_NAME"
APP_IMAGE="ghcr.io/mahendraintelops/compage/app:$TAG_NAME"
UI_IMAGE="ghcr.io/mahendraintelops/compage/ui:$TAG_NAME"

# create docker images for core, app and ui
docker build -t $CORE_IMAGE  --network host ../core/
docker build -t $APP_IMAGE  --network host ../app/
docker build -t $UI_IMAGE  --network host ../ui/
