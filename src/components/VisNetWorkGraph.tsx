'use client';

import { useAppSelector } from '@/stores/store';
import { graphBuilder } from '@openfga/frontend-utils';
import { SchemaVersion } from '@openfga/frontend-utils/dist/constants/schema-version';
import { GraphDefinition } from '@openfga/frontend-utils/dist/utilities/graphs';
import { AuthorizationModel } from '@openfga/sdk';
import { useEffect, useState } from 'react';
import Graph from 'react-graph-vis';

export default function VisNetWorkGraph() {
  const [graphId, setGraphId] = useState<string | null>(null);
  const [currentGraph, setCurrentGraph] = useState<GraphDefinition | null>(null);


  const authorizationModel = useAppSelector(
    (state) => state.authorizationModel.authorizationModel
  );
  const currentStore = useAppSelector(
    (state) => state.storeFga.currentStore
  );

  // First effect to clear existing graph
  useEffect(() => {
    if (authorizationModel || currentStore) {
      // Clear existing graph
      setGraphId(null);
      setCurrentGraph(null);
    }
  }, [authorizationModel, currentStore]);

  // Second effect to create new graph after cleanup
  useEffect(() => {
    if (authorizationModel && currentStore && !graphId && !currentGraph) {
      const defaultModel: AuthorizationModel = {
        id: 'test',
        schema_version: SchemaVersion.OneDotOne,
        type_definitions: [],
        conditions: {},
      };

      const _authModel = authorizationModel ?? defaultModel;
      const authorizationModelGraph = new graphBuilder.AuthorizationModelGraphBuilder(
        _authModel, {
          name: currentStore?.name,
          id: currentStore?.id,
        }
      );

      const newGraphId = `graph-${Date.now()}`;
      setGraphId(newGraphId);
      setCurrentGraph(authorizationModelGraph.graph);
    }
  }, [authorizationModel, currentStore, graphId, currentGraph]);

  const options = {
    nodes: {
      shape: 'dot',
      size: 16,
      font: {
        size: 14,
        color: '#FFFFFF',
      },
      borderWidth: 2,
    },
    edges: {
      width: 1,
      color: '#4A4A4A',
      smooth: {
        enabled: true,
        type: 'curvedCW',
        roundness: 0.2
      },
      arrows: {
        to: {
          enabled: false,
          scaleFactor: 0.5,
          type: 'arrow'
        }
      }
    },
    physics: {
      enabled: false
    },
    layout: {
      improvedLayout: true,
    },
    groups: {
      check: {
        color: {
          background: '#32CEA8',
        },
      },
      default: {
        color: {
          background: '#32CEA8',
          border: 'transparent',
        },
      },
      type: {
        color: {
          background: '#908BFF',
          border: 'transparent',
        },
      },
      "nonassignable-relation": {
        color: {
          background: '#32CEA8',
          border: 'transparent',
        },
      },
      'store-name': {
        color: {
          background: '#626466',
          border: 'transparent',
        },
        font: { color: '#FFFFFF' },
      },
    },
    // autoResize: true,
  };
  if (!graphId || !currentGraph) return null;
  return (
    <div
      className="w-full h-full bg-white"
      style={{
        backgroundImage:
          "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+R3JvdXA8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR3JvdXAiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUiIGZpbGw9IiMxNDE1MTciIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PC9yZWN0PgogICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBmaWxsPSIjMkYyRjJGIiB4PSI3IiB5PSI3IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIj48L3JlY3Q+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)",
        backgroundRepeat: 'repeat',
      }}
    >
      <Graph
        identifier={graphId}
        graph={currentGraph}
        options={options}
      />
    </div>
  );
}