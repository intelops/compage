import {ConnectorPlacement, Shape, ShapeType, VisibleConnectorTypes} from "diagram-maker";

export const getNodeTypeConfig = (connectorPlacement, shape: ShapeType.CIRCLE) => {
    return {
        'node-type-circle': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: ConnectorPlacement.CENTERED,
        },
        'node-type-dead': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
            visibleConnectorTypes: VisibleConnectorTypes.NONE,
        },
        'node-type-dropdown': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
        },
        'node-type-end': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
            visibleConnectorTypes: VisibleConnectorTypes.INPUT_ONLY,
        },
        'node-type-input': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
        },
        'node-type-rectangle': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
            shape: shape || Shape.RECTANGLE,
        },
        'node-type-normal-with-size': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
            shape: shape || Shape.RECTANGLE,
        },
        'node-type-start': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
            visibleConnectorTypes: VisibleConnectorTypes.OUTPUT_ONLY,
        },
        'node-type-rectangle-top-bottom': {
            size: {width: 65, height: 65},
            connectorPlacementOverride: ConnectorPlacement.TOP_BOTTOM,
        },
        'node-type-start-top-bottom': {
            size: {width: 65, height: 65},
            visibleConnectorTypes: VisibleConnectorTypes.OUTPUT_ONLY,
            connectorPlacementOverride: ConnectorPlacement.TOP_BOTTOM,
        },
        'node-type-end-top-bottom': {
            size: {width: 65, height: 65},
            visibleConnectorTypes: VisibleConnectorTypes.INPUT_ONLY,
            connectorPlacementOverride: ConnectorPlacement.TOP_BOTTOM,
        },
    };
};


