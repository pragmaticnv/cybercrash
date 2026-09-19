import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import { Network, Layers, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useBankStore } from '../../store/useBankStore';
import { getBankNetworkByDepth } from '../../data/bank/bankNetworks';

// Custom Account Node Component for Bank Network
const BankAccountNode: React.FC<{ data: any }> = ({ data }) => {
  const isPrimary = data.isPrimary;
  const isExtreme = data.networkRiskScore > 0.7;

  return (
    <div
      className={`px-3 py-2 rounded-lg border shadow-xl backdrop-blur-md cursor-pointer transition-all select-none min-w-[150px] ${
        isPrimary
          ? 'bg-[#180509] border-red-500/90 shadow-red-950/60 ring-1 ring-red-500/50'
          : isExtreme
          ? 'bg-[#14080B] border-red-500/60 shadow-red-950/40'
          : 'bg-[#071120] border-cyan-500/50 shadow-cyan-950/30'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-white/40 !w-2 !h-2" />

      <div className="flex items-center justify-between gap-2 mb-1">
        <span
          className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
            isPrimary
              ? 'bg-red-500/25 text-red-400'
              : 'bg-white/[0.06] text-slate-300'
          }`}
        >
          {isPrimary ? 'PRIMARY TARGET' : `TIER ${data.depth}`}
        </span>
        <span
          className={`text-[9px] font-mono font-bold ${
            isExtreme ? 'text-red-400' : 'text-amber-300'
          }`}
        >
          Risk: {data.networkRiskScore?.toFixed(2)}
        </span>
      </div>

      <div className="text-xs font-mono font-bold text-white tracking-wide">{data.label}</div>
      <div className="text-[10px] text-slate-300 font-sans mt-0.5 truncate">{data.holder}</div>
      <div className="text-[9px] font-mono text-slate-400 truncate">{data.bankId}</div>

      <Handle type="source" position={Position.Right} className="!bg-white/40 !w-2 !h-2" />
    </div>
  );
};

export const AccountNetworkGraph: React.FC<{ accountId: string }> = ({ accountId }) => {
  const { networkDepth, setNetworkDepth, setSelectedConnectedAccountId, openDrawer } = useBankStore();

  const nodeTypes = useMemo(() => ({ accountNode: BankAccountNode }), []);

  const { nodes, edges } = useMemo(() => {
    return getBankNetworkByDepth(accountId, networkDepth);
  }, [accountId, networkDepth]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.id !== accountId) {
        setSelectedConnectedAccountId(node.id);
        openDrawer('connected_account');
      }
    },
    [accountId, setSelectedConnectedAccountId, openDrawer]
  );

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header & Progressive Depth Controls */}
      <div className="p-3.5 bg-[#060D1A] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-amber-400" />
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              DISPERSION GRAPH &amp; CONNECTIVITY TOPOLOGY
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Directed transaction fan-out graph across recipient banking nodes
            </div>
          </div>
        </div>

        {/* Progressive Depth Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-mono text-slate-400 uppercase">NETWORK DEPTH:</span>
          <div className="flex items-center bg-[#070F1E] p-0.5 rounded border border-white/[0.08]">
            {[1, 2, 3].map((depth) => (
              <button
                key={depth}
                onClick={() => setNetworkDepth(depth)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  networkDepth === depth
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Level {depth} {depth === 1 ? '(Direct)' : depth === 2 ? '(Secondary)' : '(Terminal)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="w-full h-[360px] relative bg-[#02050B]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Background color="#0E182A" gap={18} size={1.2} />
          <Controls showInteractive={false} className="!bottom-3 !left-3" />
        </ReactFlow>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-[#040914] border-t border-white/[0.06] flex items-center justify-between text-[10.5px] font-mono text-slate-400">
        <span>Click any connected account node to inspect inter-bank relationship</span>
        <span className="text-amber-400">Progressive multi-tier relay trace</span>
      </div>
    </div>
  );
};
