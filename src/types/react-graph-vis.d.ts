declare module 'react-graph-vis' {
  import { Component } from 'react';
  import { DataSet, Edge, Network, Node, Options } from 'vis-network';

  export interface GraphEvents {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
