import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType
} from '@xyflow/react';
import { AccountNode } from './AccountNode';
import { MoneyFlowSummary } from './MoneyFlowSummary';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { Case } from '../../types/case';
import { Transaction } from '../../types/transaction';

interface MoneyFlowGraphProps {
  caseData: Case;
  transactions: Transaction[];
}

export const MoneyFlowGraph: React.FC<MoneyFlowGraphProps> = ({ caseData, transactions }) => {
  const { setSelectedAccountId, setSelectedTransactionId } = useInvestigationStore();

  const nodeTypes = useMemo(() => ({ accountNode: AccountNode }), []);

  // Construct nodes layout for CASE_007001
  const initialNodes: Node[] = useMemo(() => [
    // Column 0: Victim
    {
      id: 'VICTIM',
      type: 'accountNode',
      position: { x: 30, y: 160 },
      data: {
        id: caseData.victim.account,
        label: 'COMPLAINANT VICTIM',
        holder: caseData.victim.name,
        bank: caseData.victim.bank,
        amount: caseData.amount,
        nodeType: 'victim',
      },
    },
    // Column 1: Primary Mule
    {
      id: 'ACC_013041',
      type: 'accountNode',
      position: { x: 320, y: 160 },
      data: {
        id: 'ACC_013041',
        label: 'PRIMARY MULE HUB',
        holder: 'Naveen Kumar',
        bank: 'BANK05 · Axis Bank',
        amount: '₹1,00,250 (Incoming)',
        nodeType: 'primary-mule',
        isHistorical: true,
      },
    },
    // Column 2: Connected Split Accounts & Layer 2 Hub
    {
      id: 'ACC_008833',
      type: 'accountNode',
      position: { x: 640, y: 20 },
      data: {
        id: 'ACC_008833',
        label: 'LAYER 2 SPLIT',
        holder: 'Sunil G.',
        bank: 'Axis Bank (Mapusa)',
        amount: '₹12,751',
        nodeType: 'connected',
      },
    },
    {
      id: 'ACC_012691',
      type: 'accountNode',
      position: { x: 640, y: 140 },
      data: {
        id: 'ACC_012691',
        label: 'LAYER 2 SPLIT',
        holder: 'Kavita M.',
        bank: 'HDFC Bank (Porvorim)',
        amount: '₹3,427',
        nodeType: 'connected',
      },
    },
    {
      id: 'ACC_001097',
      type: 'accountNode',
      position: { x: 640, y: 260 },
      data: {
        id: 'ACC_001097',
        label: 'LAYER 2 FAST FUNNEL',
        holder: 'Deepak Sawant',
        bank: 'ICICI Bank (Ponda)',
        amount: '₹18,070',
        nodeType: 'high-risk',
      },
    },
    {
      id: 'ACC_003639',
      type: 'accountNode',
      position: { x: 640, y: 380 },
      data: {
        id: 'ACC_003639',
        label: 'LAYER 2 MICRO SPLIT',
        holder: 'Manish Naik',
        bank: 'Kotak Bank (Margao)',
        amount: '₹3,704',
        nodeType: 'connected',
      },
    },
    {
      id: 'ACC_008564',
      type: 'accountNode',
      position: { x: 640, y: 500 },
      data: {
        id: 'ACC_008564',
        label: 'LAYER 2 MULE HUB',
        holder: 'Suresh Patil',
        bank: 'HDFC Bank (Margao)',
        amount: '₹98,000',
        nodeType: 'high-risk',
        isHistorical: true,
      },
    },
    // Column 3: Downstream accounts
    {
      id: 'ACC_001276',
      type: 'accountNode',
      position: { x: 960, y: 440 },
      data: {
        id: 'ACC_001276',
        label: 'LAYER 3 SPLIT MULE',
        holder: 'Pooja Varma',
        bank: 'ICICI Bank (Vasco)',
        amount: '₹64,000',
        nodeType: 'connected',
      },
    },
    {
      id: 'ACC_006877',
      type: 'accountNode',
      position: { x: 1260, y: 440 },
      data: {
        id: 'ACC_006877',
        label: 'CASH-OUT MULE',
        holder: 'Vikram Salgaonkar',
        bank: 'Canara Bank (Mapusa)',
        amount: '₹60,000',
        nodeType: 'high-risk',
        isHistorical: true,
      },
    },
  ], [caseData]);

  // Construct edges layout
  const initialEdges: Edge[] = useMemo(() => [
    {
      id: 'e-victim-mule',
      source: 'VICTIM',
      target: 'ACC_013041',
      animated: true,
      label: '₹1,00,250 · IMPS',
      style: { stroke: '#38BDF8', strokeWidth: 2.5 },
      labelStyle: { fill: '#FFFFFF', fontWeight: 700, fontFamily: 'monospace', fontSize: 11 },
      labelBgStyle: { fill: '#081426', fillOpacity: 0.95 },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8' },
    },
    {
      id: 'e-mule-split1',
      source: 'ACC_013041',
      target: 'ACC_008833',
      animated: true,
      label: '₹12,751 · UPI',
      style: { stroke: '#EF4444', strokeWidth: 1.8 },
      labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      labelBgPadding: [5, 3],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    },
    {
      id: 'e-mule-split2',
      source: 'ACC_013041',
      target: 'ACC_012691',
      animated: true,
      label: '₹3,427 · UPI',
      style: { stroke: '#EF4444', strokeWidth: 1.8 },
      labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      labelBgPadding: [5, 3],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    },
    {
      id: 'e-mule-split3',
      source: 'ACC_013041',
      target: 'ACC_001097',
      animated: true,
      label: '₹18,070 · IMPS',
      style: { stroke: '#EF4444', strokeWidth: 2 },
      labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      labelBgPadding: [5, 3],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    },
    {
      id: 'e-mule-split4',
      source: 'ACC_013041',
      target: 'ACC_003639',
      animated: true,
      label: '₹3,704 · UPI',
      style: { stroke: '#EF4444', strokeWidth: 1.8 },
      labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      labelBgPadding: [5, 3],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    },
    {
      id: 'e-mule-hub2',
      source: 'ACC_013041',
      target: 'ACC_008564',
      animated: true,
      label: '₹98,000 · NEFT',
      style: { stroke: '#EF4444', strokeWidth: 2.5 },
      labelStyle: { fill: '#FFFFFF', fontWeight: 700, fontFamily: 'monospace', fontSize: 11 },
      labelBgStyle: { fill: '#1E060A', fillOpacity: 0.95 },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    },
    {
      id: 'e-hub2-split3',
      source: 'ACC_008564',
      target: 'ACC_001276',
      animated: true,
      label: '₹64,000 · RTGS',
      style: { stroke: '#F59E0B', strokeWidth: 2 },
      labelStyle: { fill: '#FCD34D', fontFamily: 'monospace', fontSize: 10.5 },
      labelBgStyle: { fill: '#160E04', fillOpacity: 0.95 },
      labelBgPadding: [5, 3],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
    },
    {
      id: 'e-split3-cashout',
      source: 'ACC_001276',
      target: 'ACC_006877',
      animated: true,
      label: '₹60,000 · IMPS',
      style: { stroke: '#EF4444', strokeWidth: 2.2 },
      labelStyle: { fill: '#FCA5A5', fontWeight: 700, fontFamily: 'monospace', fontSize: 10.5 },
      labelBgStyle: { fill: '#1E060A', fillOpacity: 0.95 },
      labelBgPadding: [5, 3],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    },
  ], []);

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  // Click on account node -> opens Account Drawer
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedAccountId(node.id);
    },
    [setSelectedAccountId]
  );

  // Click on edge -> opens Transaction Drawer
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedTransactionId(edge.id);
    },
    [setSelectedTransactionId]
  );

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Forensic Summary Bar */}
      <MoneyFlowSummary
        incomingTx={1}
        outgoingTx={8}
        uniqueReceivers={8}
        downstreamAmount={caseData.downstreamAmount || '₹53,439'}
      />

      {/* React Flow Interactive Graph */}
      <div className="w-full h-[320px] relative bg-[#02050B]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.3}
          maxZoom={1.8}
        >
          <Background color="#101F34" gap={20} size={1.2} />
          <Controls showInteractive={false} className="!bottom-3 !left-3" />
          <MiniMap
            className="!bottom-3 !right-3 !h-20 !w-32"
            nodeColor={(n) => {
              if (n.id === 'ACC_013041') return '#EF4444';
              if (n.id === 'VICTIM') return '#38BDF8';
              return '#1E293B';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};
