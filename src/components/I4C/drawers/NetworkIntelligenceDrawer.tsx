import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Network, ExternalLink, ShieldAlert, GitBranch, ArrowRight } from 'lucide-react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import { useI4CStore } from '../../../store/useI4CStore';
import { useNavigate } from 'react-router-dom';

// Custom Node for React Flow Network Drawer
const CustomNetworkNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div
      className={`px-3 py-2 rounded-lg border shadow-xl backdrop-blur-md cursor-pointer transition-all select-none min-w-[130px] ${
        data.type === 'hub'
          ? 'bg-[#180509] border-red-500/80 shadow-red-950/50'
          : data.type === 'account'
          ? 'bg-[#091526] border-cyan-500/60 shadow-cyan-950/40'
          : data.type === 'case'
          ? 'bg-[#1A1104] border-amber-500/70 shadow-amber-950/40'
          : 'bg-[#0E061E] border-purple-500/70 shadow-purple-950/40'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/40 !w-2 !h-2" />
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
            data.type === 'hub'
              ? 'bg-red-500/20 text-red-400'
              : data.type === 'account'
              ? 'bg-cyan-500/20 text-cyan-400'
              : data.type === 'case'
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-purple-500/20 text-purple-400'
          }`}
        >
          {data.tag || data.type}
        </span>
        {data.amount && <span className="text-[10px] font-mono font-semibold text-white">{data.amount}</span>}
      </div>
      <div className="text-xs font-mono font-bold text-white mt-1">{data.label}</div>
      {data.subLabel && <div className="text-[10px] text-slate-400 font-sans mt-0.5">{data.subLabel}</div>}
      <Handle type="source" position={Position.Bottom} className="!bg-white/40 !w-2 !h-2" />
    </div>
  );
};

export const NetworkIntelligenceDrawer: React.FC = () => {
  const {
    selectedNetwork,
    activeDrawer,
    closeDrawer,
    openAccountDrawer,
    openStateById
  } = useI4CStore();
  const navigate = useNavigate();

  const nodeTypes = useMemo(() => ({ networkNode: CustomNetworkNode }), []);

  // Construct structured hierarchy nodes for the selected network
  const { nodes, edges } = useMemo(() => {
    if (!selectedNetwork) return { nodes: [], edges: [] };

    const initialNodes: Node[] = [
      // Top Level: Primary Mule Hub
      {
        id: selectedNetwork.primaryMuleAccount,
        type: 'networkNode',
        position: { x: 260, y: 30 },
        data: {
          label: selectedNetwork.primaryMuleAccount,
          subLabel: 'Primary Hub (Axis Bank)',
          tag: 'MULE HUB',
          type: 'hub',
          amount: '₹42.7L'
        }
      },
      // Layer 2: Intermediate Mules
      {
        id: 'ACC_008833',
        type: 'networkNode',
        position: { x: 70, y: 150 },
        data: {
          label: 'ACC_008833',
          subLabel: 'Axis Bank (Goa)',
          tag: 'L2 SPLIT',
          type: 'account',
          amount: '₹12.7K'
        }
      },
      {
        id: 'ACC_012691',
        type: 'networkNode',
        position: { x: 260, y: 150 },
        data: {
          label: 'ACC_012691',
          subLabel: 'HDFC (Porvorim)',
          tag: 'L2 SPLIT',
          type: 'account',
          amount: '₹3.4K'
        }
      },
      {
        id: 'ACC_001097',
        type: 'networkNode',
        position: { x: 450, y: 150 },
        data: {
          label: 'ACC_001097',
          subLabel: 'ICICI (Ponda)',
          tag: 'L2 FUNNEL',
          type: 'account',
          amount: '₹18.0K'
        }
      },
      // Layer 3: Cases
      {
        id: 'CASE_007001',
        type: 'networkNode',
        position: { x: 70, y: 280 },
        data: {
          label: 'CASE_007001',
          subLabel: 'Investment Scam',
          tag: 'CASE',
          type: 'case',
          amount: '₹1,00,250'
        }
      },
      {
        id: 'CASE_007113',
        type: 'networkNode',
        position: { x: 450, y: 280 },
        data: {
          label: 'CASE_007113',
          subLabel: 'UPI Fraud',
          tag: 'CASE',
          type: 'case',
          amount: '₹45,600'
        }
      },
      // Layer 4: States
      {
        id: 'STATE_GOA',
        type: 'networkNode',
        position: { x: 70, y: 400 },
        data: {
          label: 'GOA CYBER CELL',
          subLabel: 'Jurisdiction Origin',
          tag: 'STATE',
          type: 'state'
        }
      },
      {
        id: 'STATE_MAHARASHTRA',
        type: 'networkNode',
        position: { x: 450, y: 400 },
        data: {
          label: 'MAHARASHTRA POLICE',
          subLabel: 'Destination Cash-out',
          tag: 'STATE',
          type: 'state'
        }
      }
    ];

    const initialEdges: Edge[] = [
      {
        id: 'e1',
        source: selectedNetwork.primaryMuleAccount,
        target: 'ACC_008833',
        animated: true,
        style: { stroke: '#EF4444', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
      },
      {
        id: 'e2',
        source: selectedNetwork.primaryMuleAccount,
        target: 'ACC_012691',
        animated: true,
        style: { stroke: '#EF4444', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
      },
      {
        id: 'e3',
        source: selectedNetwork.primaryMuleAccount,
        target: 'ACC_001097',
        animated: true,
        style: { stroke: '#EF4444', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
      },
      {
        id: 'e4',
        source: 'ACC_008833',
        target: 'CASE_007001',
        style: { stroke: '#F59E0B', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' }
      },
      {
        id: 'e5',
        source: 'ACC_001097',
        target: 'CASE_007113',
        style: { stroke: '#F59E0B', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' }
      },
      {
        id: 'e6',
        source: 'CASE_007001',
        target: 'STATE_GOA',
        style: { stroke: '#A855F7', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#A855F7' }
      },
      {
        id: 'e7',
        source: 'CASE_007113',
        target: 'STATE_MAHARASHTRA',
        style: { stroke: '#A855F7', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#A855F7' }
      }
    ];

    return { nodes: initialNodes, edges: initialEdges };
  }, [selectedNetwork]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.id.startsWith('CASE_')) {
        navigate(`/investigation/${node.id}`);
      } else if (node.id.startsWith('STATE_')) {
        const stateCode = node.id === 'STATE_GOA' ? 'GA' : 'MH';
        openStateById(stateCode);
      } else if (node.id.startsWith('ACC_')) {
        openAccountDrawer(node.id);
      }
    },
    [navigate, openStateById, openAccountDrawer]
  );

  if (activeDrawer !== 'network' || !selectedNetwork) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        {/* Backdrop */}
        <div
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/65 backdrop-blur-sm pointer-events-auto"
        />

        {/* Slide-out Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-[720px] bg-[#050B16] border-l border-white/[0.12] shadow-2xl flex flex-col pointer-events-auto"
        >
          {/* Header */}
          <div className="p-4 bg-[#081222] border-b border-white/[0.1] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  {selectedNetwork.name} ({selectedNetwork.id})
                </h3>
                <span className="text-[10px] font-mono text-amber-400 tracking-wider">
                  MULTI-STATE LAUNDERING TOPOLOGY · {selectedNetwork.totalAccounts} ACCOUNTS MONITORED
                </span>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Network Summary Bar */}
          <div className="px-5 py-3 bg-[#070E1A] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400">TRACED AMOUNT: </span>
              <span className="text-red-400 font-bold">{selectedNetwork.amountTraced}</span>
            </div>
            <div>
              <span className="text-slate-400">JURISDICTIONS: </span>
              <span className="text-purple-300 font-bold">{selectedNetwork.statesCount} States</span>
            </div>
            <div>
              <span className="text-slate-400">LINKED CASES: </span>
              <span className="text-cyan-300 font-bold">{selectedNetwork.associatedCasesCount}</span>
            </div>
          </div>

          {/* Interactive React Flow Diagram */}
          <div className="flex-1 w-full relative bg-[#02050B]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#101F34" gap={20} size={1.2} />
              <Controls showInteractive={false} className="!bottom-3 !left-3" />
            </ReactFlow>
          </div>

          {/* Footer Guide & Action */}
          <div className="p-4 bg-[#081222] border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              Click any node: Account &rarr; Details | Case &rarr; LEA Investigation | State &rarr; Dossier
            </span>
            <button
              onClick={() => {
                if (selectedNetwork.associatedCaseIds[0]) {
                  navigate(`/investigation/${selectedNetwork.associatedCaseIds[0]}`);
                }
              }}
              className="py-2 px-3.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>INSPECT IN LEA WORKSPACE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
