import React, { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
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
  networkData?: any; // From result.network (POST /new-case)
}

export const MoneyFlowGraph: React.FC<MoneyFlowGraphProps> = ({
  caseData,
  transactions,
  networkData
}) => {
  const { setSelectedAccountId, setSelectedTransactionId } = useInvestigationStore();

  const nodeTypes = useMemo(() => ({ accountNode: AccountNode }), []);

  // Compute nodes dynamically if networkData exists, otherwise fallback to standard case layout
  const computedNodes: Node[] = useMemo(() => {
    // Dynamic network returned by backend POST /new-case
    if (networkData && networkData.accounts_by_hop) {
      const dynamicNodes: Node[] = [];
      const hops: Record<string, string[]> = networkData.accounts_by_hop;
      const hopKeys = Object.keys(hops).sort();

      hopKeys.forEach((hopKey, hopIdx) => {
        const accountsInHop = hops[hopKey] || [];
        const xPos = 60 + hopIdx * 320;
        const totalInHop = accountsInHop.length;
        const verticalSpacing = totalInHop > 3 ? 100 : 130;
        const startY = Math.max(40, 260 - ((totalInHop - 1) * verticalSpacing) / 2);

        accountsInHop.forEach((accId, accIdx) => {
          const isPrimary = hopIdx === 0;
          const isDeepHop = hopIdx >= 2;

          dynamicNodes.push({
            id: accId,
            type: 'accountNode',
            position: { x: xPos, y: startY + accIdx * verticalSpacing },
            data: {
              id: accId,
              label: isPrimary
                ? 'PRIMARY MULE HUB'
                : hopIdx === 1
                ? 'LAYER 1 MULE'
                : `LAYER ${hopIdx} MULE`,
              holder: `Account ${accId}`,
              bank: isPrimary ? 'Primary Receiving FI' : `Syndicate FI (${accId.slice(-4)})`,
              amount: isPrimary ? `${caseData.amount} (Intake)` : 'Traced Flow',
              nodeType: isPrimary ? 'primary-mule' : isDeepHop ? 'high-risk' : 'connected',
              isHistorical: isPrimary
            }
          });
        });
      });

      return dynamicNodes;
    }

    // Default Fallback Layout (for CASE_007001 or standard mock view)
    return [
      {
        id: 'VICTIM',
        type: 'accountNode',
        position: { x: 30, y: 280 },
        data: {
          id: caseData.victim?.account || 'VICTIM_001',
          label: 'COMPLAINANT VICTIM',
          holder: caseData.victim?.name || 'Complainant',
          bank: caseData.victim?.bank || 'Bank of India',
          amount: caseData.amount,
          nodeType: 'victim',
        },
      },
      {
        id: caseData.primaryMule || 'ACC_013041',
        type: 'accountNode',
        position: { x: 320, y: 280 },
        data: {
          id: caseData.primaryMule || 'ACC_013041',
          label: 'PRIMARY MULE HUB',
          holder: 'Naveen Kumar',
          bank: 'BANK05 · Axis Bank',
          amount: `${caseData.amount} (Incoming)`,
          nodeType: 'primary-mule',
          isHistorical: true,
        },
      },
      {
        id: 'ACC_008833',
        type: 'accountNode',
        position: { x: 650, y: 30 },
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
        position: { x: 650, y: 155 },
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
        position: { x: 650, y: 280 },
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
        position: { x: 650, y: 405 },
        data: {
          id: 'ACC_003639',
          label: 'LAYER 2 SPLIT',
          holder: 'Pravin Naik',
          bank: 'Canara Bank (Panaji)',
          amount: '₹3,704',
          nodeType: 'connected',
        },
      },
      {
        id: 'ACC_008564',
        type: 'accountNode',
        position: { x: 650, y: 530 },
        data: {
          id: 'ACC_008564',
          label: 'AGGREGATOR HUB 2',
          holder: 'Rohan Deshmukh',
          bank: 'SBI (Panaji)',
          amount: '₹98,000',
          nodeType: 'high-risk',
          isHistorical: true,
        },
      },
      {
        id: 'ACC_001276',
        type: 'accountNode',
        position: { x: 970, y: 530 },
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
        position: { x: 1280, y: 530 },
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
    ];
  }, [networkData, caseData]);

  // Compute edges dynamically from networkData.transactions or fallback
  const computedEdges: Edge[] = useMemo(() => {
    if (networkData && Array.isArray(networkData.transactions) && networkData.transactions.length > 0) {
      return networkData.transactions.map((tx: any, idx: number) => {
        const amt = Number(tx.amount || 0);
        return {
          id: `e-${tx.source_account}-${tx.destination_account}-${idx}`,
          source: tx.source_account,
          target: tx.destination_account,
          type: 'default',
          animated: true,
          label: `₹${amt.toLocaleString()} · ${tx.channel || 'IMPS'}`,
          style: {
            stroke: idx === 0 ? '#38BDF8' : '#EF4444',
            strokeWidth: 2.4,
            filter: idx === 0
              ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.75))'
              : 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.75))',
          },
          labelStyle: { fill: '#FFFFFF', fontWeight: 700, fontFamily: 'monospace', fontSize: 11 },
          labelBgStyle: { fill: '#081426', fillOpacity: 0.95 },
          labelBgPadding: [6, 4] as [number, number],
          labelBgBorderRadius: 4,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: idx === 0 ? '#38BDF8' : '#EF4444'
          },
        };
      });
    }

    // Default Case 7001 edges
    return [
      {
        id: 'e-victim-mule',
        source: 'VICTIM',
        target: caseData.primaryMule || 'ACC_013041',
        type: 'default',
        animated: true,
        label: `${caseData.amount} · IMPS`,
        style: {
          stroke: '#38BDF8',
          strokeWidth: 2.8,
          filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.75))',
        },
        labelStyle: { fill: '#FFFFFF', fontWeight: 700, fontFamily: 'monospace', fontSize: 11 },
        labelBgStyle: { fill: '#081426', fillOpacity: 0.95 },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8' },
      },
      {
        id: 'e-mule-split1',
        source: caseData.primaryMule || 'ACC_013041',
        target: 'ACC_008833',
        type: 'default',
        animated: true,
        label: '₹12,751 · UPI',
        style: { stroke: '#FF4552', strokeWidth: 2, filter: 'drop-shadow(0 0 5px rgba(255, 69, 82, 0.6))' },
        labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
        labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF4552' },
      },
      {
        id: 'e-mule-split2',
        source: caseData.primaryMule || 'ACC_013041',
        target: 'ACC_012691',
        type: 'default',
        animated: true,
        label: '₹3,427 · UPI',
        style: { stroke: '#FF4552', strokeWidth: 2, filter: 'drop-shadow(0 0 5px rgba(255, 69, 82, 0.6))' },
        labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
        labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF4552' },
      },
      {
        id: 'e-mule-split3',
        source: caseData.primaryMule || 'ACC_013041',
        target: 'ACC_001097',
        type: 'default',
        animated: true,
        label: '₹18,070 · IMPS',
        style: { stroke: '#EF4444', strokeWidth: 2.2, filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.7))' },
        labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
        labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      },
      {
        id: 'e-mule-split4',
        source: caseData.primaryMule || 'ACC_013041',
        target: 'ACC_003639',
        type: 'default',
        animated: true,
        label: '₹3,704 · IMPS',
        style: { stroke: '#FF4552', strokeWidth: 2, filter: 'drop-shadow(0 0 5px rgba(255, 69, 82, 0.6))' },
        labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10.5 },
        labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF4552' },
      },
      {
        id: 'e-mule-hub2',
        source: caseData.primaryMule || 'ACC_013041',
        target: 'ACC_008564',
        type: 'default',
        animated: true,
        label: '₹98,000 · NEFT',
        style: { stroke: '#EF4444', strokeWidth: 2.8, filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' },
        labelStyle: { fill: '#FFFFFF', fontWeight: 700, fontFamily: 'monospace', fontSize: 11 },
        labelBgStyle: { fill: '#1E060A', fillOpacity: 0.95 },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      },
      {
        id: 'e-hub2-split3',
        source: 'ACC_008564',
        target: 'ACC_001276',
        type: 'default',
        animated: true,
        label: '₹64,000 · RTGS',
        style: { stroke: '#F59E0B', strokeWidth: 2.4, filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.7))' },
        labelStyle: { fill: '#FCD34D', fontFamily: 'monospace', fontSize: 10.5 },
        labelBgStyle: { fill: '#160E04', fillOpacity: 0.95 },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
      },
      {
        id: 'e-split3-cashout',
        source: 'ACC_001276',
        target: 'ACC_006877',
        type: 'default',
        animated: true,
        label: '₹60,000 · IMPS',
        style: { stroke: '#EF4444', strokeWidth: 2.6, filter: 'drop-shadow(0 0 7px rgba(239, 68, 68, 0.85))' },
        labelStyle: { fill: '#FCA5A5', fontWeight: 700, fontFamily: 'monospace', fontSize: 10.5 },
        labelBgStyle: { fill: '#1E060A', fillOpacity: 0.95 },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      },
    ];
  }, [networkData, caseData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);

  // Synchronize ReactFlow state whenever computedNodes or computedEdges change!
  useEffect(() => {
    setNodes(computedNodes);
    setEdges(computedEdges);
  }, [computedNodes, computedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedAccountId(node.id);
    },
    [setSelectedAccountId]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedTransactionId(edge.id);
    },
    [setSelectedTransactionId]
  );

  // Compute summary values
  const incomingTxCount = networkData?.total_transactions_traced ?? transactions.filter((t) => t.amountRaw > 0).length;
  const outgoingTxCount = networkData?.total_transactions_traced ? Math.max(1, networkData.total_transactions_traced - 1) : 8;
  const uniqueReceiversCount = networkData?.total_accounts_traced ? Math.max(1, networkData.total_accounts_traced - 1) : 8;
  const downstreamAmt = networkData ? `₹${(caseData.amountRaw * 0.65).toLocaleString()}` : (caseData.downstreamAmount || '₹53,439');

  return (
    <div className="w-full bg-[#030812] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* 1. Header Metrics Summary Strip */}
      <MoneyFlowSummary
        incomingTx={incomingTxCount}
        outgoingTx={outgoingTxCount}
        uniqueReceivers={uniqueReceiversCount}
        downstreamAmount={downstreamAmt}
      />

      {/* 2. Interactive ReactFlow Canvas */}
      <div className="h-[460px] w-full relative bg-[#02060D]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#0F1E33" gap={20} size={1.2} />
          <Controls className="bg-[#071322] border-white/[0.1] text-cyan-400 fill-cyan-400 rounded-lg overflow-hidden shadow-lg" />
        </ReactFlow>

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 bg-[#040A14]/90 backdrop-blur-md border border-white/[0.08] rounded-md px-3 py-2 text-[10px] font-mono text-slate-300 flex items-center gap-4 pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/20" />
            <span>Complainant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
            <span>Primary Mule</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
            <span>Layer Mule</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-red-600/30" />
            <span>Cashout Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};
