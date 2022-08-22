import { Component } from 'react';
// import { DiagramMaker, DiagramMakerConfig, DiagramMakerData } from 'diagram-maker';
//
// interface MyNodeType {
//     // Based on use case or leave empty
// }
//
// interface MyEdgeType {
//     // Based on use case or leave empty
// }
//
// interface DiagramMakerContainerProps {
//     config: DiagramMakerConfig<MyNodeType, MyEdgeType>;
//     initialData: DiagramMakerData<MyNodeType, MyEdgeType>
// }
//
// export class DiagramMakerContainer extends Component<DiagramMakerContainerProps> {
//     private diagramMaker: DiagramMaker<MyNodeType, MyEdgeType>;
//     private container: HTMLElement;
//
//     componentDidMount() {
//         this.diagramMaker = new DiagramMaker(
//             this.container,
//             this.props.config,
//             // { initialData, eventListener, consumerRootReducer, consumerEnhancer }
//             {
//                 initialData: this.props.initialData
//             }
//         );
//     }
//
//     componentWillUnmount() {
//         this.diagramMaker.destroy();
//     }
//
//     render() {
//         return <div ref={(element) => this.container = element} />;
//     }
// }