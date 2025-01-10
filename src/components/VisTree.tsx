'use client'
import { generateGraph } from "@/actions/open-fga.action";
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import Graph from "react-graph-vis";
import CursorIcon from "./icons/Curso";

import { useAppSelector } from "@/stores/store";
import { GraphDefinition } from "@openfga/frontend-utils/dist/utilities/graphs";

import { Assertion } from "@openfga/sdk";

const treeOption = {
  nodes: {
    shape: "box",
    shapeProperties: { borderRadius: 2 },
    margin: 10,
    widthConstraint: { minimum: 100 },
    font: {
      strokeWidth: 0,
      strokeColor: "none",
      size: 11,
      color: "#FFFFFF",
      face: "arial",
      multi: true
    },
    borderWidth: 1,
  },
  edges: {
    width: 0.5,
    color: {
      color: "#32CE78",
      highlight: "#32CE78",
    },
    arrows: {
      to: { enabled: false },
      from: { enabled: true },
    },
    font: {
      size: 11,
      color: "#FFFFFF",
      face: "arial",
      align: "horizontal",
      strokeWidth: 0,
      strokeColor: "none",
    },
    smooth: {
      enabled: true,
      type: "vertical",
      roundness: 0
    }
  },
  physics: {
    enabled: true,
    stabilization: false,
  },
  layout: {
    hierarchical: {
      enabled: true,
      sortMethod: "directed",
      nodeSpacing: 100,
      levelSeparation: 200
    }
  },
};
const transformAssertion = (assertion: Assertion) => {
  return `is  ${assertion.tuple_key.user} related to ${assertion.tuple_key.object} as ${assertion.tuple_key.relation}?`;
}
export default function VisTree() {
  const currentAssertion = useAppSelector(
    (state) => state.assertionFga.currentAssertion
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [graphId, setGraphId] = useState<string>(`graph-${Date.now()}`);
  const [graph, setGraph] = useState<GraphDefinition | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      if (!currentAssertion?.tuple_key) return;
      
      const newGraph = await generateGraph(
        currentAssertion.tuple_key.object,
        currentAssertion.tuple_key.user
      );

      if (!newGraph) return;

      const coloredGraph = {
        ...newGraph,
        nodes: newGraph.nodes.map(node => ({
          ...node,
          color: node.id === currentAssertion.tuple_key.object || node.id === currentAssertion.tuple_key.user
            ? {
              background: "#32CE78",
              border: "#32CE78",
              highlight: {
                background: "#32CE78",
                border: "#32CE78",
              }
            }
            : undefined
        }))
      };

      setGraph(coloredGraph);
    };

    fetchGraph();
  }, [currentAssertion?.tuple_key]);

  const getGraphOptions = {
    ...treeOption,
    nodes: {
      ...treeOption.nodes,
      color: {
        background: "#1E1E1E",
        border: "#1E1E1E",
        highlight: {
          background: "#1E1E1E",
          border: "#1E1E1E",
        }
      }
    }
  };

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setGraphId(`graph-${Date.now()}`);
    }
  };

  useEffect(() => {
    if (currentAssertion && inputRef.current) {
      const assertionTest = transformAssertion(currentAssertion)
      inputRef.current.value = assertionTest
    }

  }, [currentAssertion, inputRef])

  return (
    <div className="w-full h-full overflow-hidden flex-col flex">
      <div className='flex-1'>
        {graph && (
          <Graph
            key={graphId}
            identifier={graphId}
            graph={graph}
            options={getGraphOptions}
          />
        )}
      </div>
      <div className="w-full bg-background p-2 flex gap-2 items-center">
        <CursorIcon />
        <input
          ref={inputRef}
          className='w-full bg-transparent !outline-none placeholder:text-white/45 text-white text-sm'
          placeholder="e.g.: who is related to org:a2ed4857-e8d4-41af-8cf7-e41edb32ce78 as contract_remover?"
          onChange={(e) => {

          }}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
}
