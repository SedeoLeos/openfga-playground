declare module 'react-graph-vis' {
  import { Network,  Options, Node, Edge, DataSet } from 'vis-network';
  import { Component } from 'react';

  export interface GraphEvents {
    [event: string]: (params?: any) => void;
  }

  export interface NetworkGraphProps {
    graph: {
      nodes: Node[];
      edges: Edge[];
    };
    options?: Options;
    events?: GraphEvents;
    getNetwork?: (network: Network) => void;
    identifier?: string;
    style?: React.CSSProperties;
    getNodes?: (nodes: DataSet<Node>) => void;
    getEdges?: (edges: DataSet<Edge>) => void;
  }

  export default class NetworkGraph extends Component<NetworkGraphProps> {}
}
