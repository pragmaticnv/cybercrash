import { Node, Edge, MarkerType } from '@xyflow/react';

export interface BankNetworkData {
  nodes: Node[];
  edges: Edge[];
}

export const getBankNetworkByDepth = (primaryAccountId: string, depth: number): BankNetworkData => {
  // Base Level 1 Nodes
  const nodes: Node[] = [
    {
      id: primaryAccountId,
      type: 'accountNode',
      position: { x: 50, y: 180 },
      data: {
        id: primaryAccountId,
        label: primaryAccountId,
        holder: 'Naveen Kumar',
        bankId: 'BANK05 · Axis Bank',
        accountType: 'Savings',
        networkRiskScore: 0.285964,
        isPrimary: true,
        depth: 0,
        status: 'FLAGGED'
      }
    },
    // Level 1 Connected Accounts
    {
      id: 'ACC_008564',
      type: 'accountNode',
      position: { x: 380, y: 40 },
      data: {
        id: 'ACC_008564',
        label: 'ACC_008564',
        holder: 'Suresh Patil',
        bankId: 'BANK05 · HDFC (Margao)',
        accountType: 'Salary',
        networkRiskScore: 0.8124,
        isPrimary: false,
        depth: 1,
        status: 'FLAGGED'
      }
    },
    {
      id: 'ACC_008833',
      type: 'accountNode',
      position: { x: 380, y: 130 },
      data: {
        id: 'ACC_008833',
        label: 'ACC_008833',
        holder: 'Sunil G.',
        bankId: 'Axis Bank (Mapusa)',
        accountType: 'Savings',
        networkRiskScore: 0.512,
        isPrimary: false,
        depth: 1,
        status: 'FLAGGED'
      }
    },
    {
      id: 'ACC_012691',
      type: 'accountNode',
      position: { x: 380, y: 220 },
      data: {
        id: 'ACC_012691',
        label: 'ACC_012691',
        holder: 'Kavita M.',
        bankId: 'HDFC (Porvorim)',
        accountType: 'Savings',
        networkRiskScore: 0.342,
        isPrimary: false,
        depth: 1,
        status: 'ACTIVE'
      }
    },
    {
      id: 'ACC_001097',
      type: 'accountNode',
      position: { x: 380, y: 310 },
      data: {
        id: 'ACC_001097',
        label: 'ACC_001097',
        holder: 'Deepak Sawant',
        bankId: 'ICICI Bank (Ponda)',
        accountType: 'Savings',
        networkRiskScore: 0.628,
        isPrimary: false,
        depth: 1,
        status: 'FLAGGED'
      }
    },
    {
      id: 'ACC_003639',
      type: 'accountNode',
      position: { x: 380, y: 400 },
      data: {
        id: 'ACC_003639',
        label: 'ACC_003639',
        holder: 'Manish Naik',
        bankId: 'Kotak (Margao)',
        accountType: 'Savings',
        networkRiskScore: 0.435,
        isPrimary: false,
        depth: 1,
        status: 'ACTIVE'
      }
    }
  ];

  const edges: Edge[] = [
    {
      id: 'e-main-8564',
      source: primaryAccountId,
      target: 'ACC_008564',
      animated: true,
      label: '₹9,819 · UPI',
      style: { stroke: '#EF4444', strokeWidth: 2 },
      labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
    },
    {
      id: 'e-main-8833',
      source: primaryAccountId,
      target: 'ACC_008833',
      animated: true,
      label: '₹12,751 · WALLET',
      style: { stroke: '#F59E0B', strokeWidth: 2 },
      labelStyle: { fill: '#FDE68A', fontFamily: 'monospace', fontSize: 10 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' }
    },
    {
      id: 'e-main-12691',
      source: primaryAccountId,
      target: 'ACC_012691',
      animated: true,
      label: '₹3,427 · RTGS',
      style: { stroke: '#38BDF8', strokeWidth: 1.5 },
      labelStyle: { fill: '#BAE6FD', fontFamily: 'monospace', fontSize: 10 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8' }
    },
    {
      id: 'e-main-1097',
      source: primaryAccountId,
      target: 'ACC_001097',
      animated: true,
      label: '₹18,070 · IMPS',
      style: { stroke: '#EF4444', strokeWidth: 2 },
      labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
    },
    {
      id: 'e-main-3639',
      source: primaryAccountId,
      target: 'ACC_003639',
      animated: true,
      label: '₹3,704 · IMPS',
      style: { stroke: '#A855F7', strokeWidth: 1.5 },
      labelStyle: { fill: '#E9D5FF', fontFamily: 'monospace', fontSize: 10 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#A855F7' }
    }
  ];

  // Progressive Expansion: Level 2
  if (depth >= 2) {
    nodes.push({
      id: 'ACC_001276',
      type: 'accountNode',
      position: { x: 700, y: 100 },
      data: {
        id: 'ACC_001276',
        label: 'ACC_001276',
        holder: 'Pooja Varma',
        bankId: 'ICICI Bank (Vasco)',
        accountType: 'Savings',
        networkRiskScore: 0.689,
        isPrimary: false,
        depth: 2,
        status: 'FLAGGED'
      }
    });

    edges.push({
      id: 'e-8564-1276',
      source: 'ACC_008564',
      target: 'ACC_001276',
      animated: true,
      label: '₹64,000 · RTGS',
      style: { stroke: '#EF4444', strokeWidth: 2.2 },
      labelStyle: { fill: '#FCA5A5', fontFamily: 'monospace', fontSize: 10 },
      labelBgStyle: { fill: '#140608', fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
    });
  }

  // Progressive Expansion: Level 3
  if (depth >= 3) {
    nodes.push({
      id: 'ACC_006877',
      type: 'accountNode',
      position: { x: 1020, y: 100 },
      data: {
        id: 'ACC_006877',
        label: 'ACC_006877',
        holder: 'Vikram Salgaonkar',
        bankId: 'Canara Bank (Mapusa)',
        accountType: 'Savings',
        networkRiskScore: 0.9412,
        isPrimary: false,
        depth: 3,
        status: 'FROZEN'
      }
    });

    edges.push({
      id: 'e-1276-6877',
      source: 'ACC_001276',
      target: 'ACC_006877',
      animated: true,
      label: '₹60,000 · IMPS (ATM Stage)',
      style: { stroke: '#EF4444', strokeWidth: 2.8, strokeDasharray: '4 4' },
      labelStyle: { fill: '#FFFFFF', fontWeight: 700, fontFamily: 'monospace', fontSize: 10 },
      labelBgStyle: { fill: '#1E060A', fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
    });
  }

  return { nodes, edges };
};
