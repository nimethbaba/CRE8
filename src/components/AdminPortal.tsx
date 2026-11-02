import React, { useState } from 'react';
import { CustomOrder, InventoryItem, Subscriber, OrderStatus } from '../types';
import {
  Lock,
  LogOut,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Eye,
  X,
  FileDown,
  Layers,
  Wrench,
  ShieldAlert,
  Sliders,
} from 'lucide-react';

interface AdminPortalProps {
  orders: CustomOrder[];
  inventory: InventoryItem[];
  subscribers: Subscriber[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateStock: (itemId: string, newQty: number) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
  onClose: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  inventory,
  subscribers,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateStock,
  onAddInventoryItem,
  onClose,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  // Auth state
  const [email, setEmail] = useState('admin@cre8.studio');
  const [password, setPassword] = useState('cre8cnc2025');
  const [authError, setAuthError] = useState('');

  // Dashboard view
  const [currentTab, setCurrentTab] = useState<'orders' | 'inventory' | 'leads'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<CustomOrder | null>(null);

  // New inventory modal state
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Sheets & Slabs');
  const [newItemMaterial, setNewItemMaterial] = useState('');
  const [newItemSpecs, setNewItemSpecs] = useState('');
  const [newItemQty, setNewItemQty] = useState(10);
  const [newItemUnit, setNewItemUnit] = useState('units');
  const [newItemCost, setNewItemCost] = useState(150);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      setIsLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError('Please provide valid admin credentials.');
    }
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      name: newItemName,
      category: newItemCategory,
      material: newItemMaterial || 'CNC Raw Stock',
      specifications: newItemSpecs || 'Standard CNC Spec',
      stockQuantity: Number(newItemQty),
      unit: newItemUnit,
      minThreshold: 4,
      costPerUnit: Number(newItemCost),
      status: Number(newItemQty) <= 3 ? 'Low Stock' : 'In Stock',
    };

    onAddInventoryItem(newItem);
    setShowAddStockModal(false);
    // Reset form
    setNewItemName('');
    setNewItemSpecs('');
  };

  // Status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'In Review':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'CAD/CAM Ready':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Machining':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Quality Check':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Dispatched':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const statusOptions: OrderStatus[] = [
    'New',
    'In Review',
    'CAD/CAM Ready',
    'Machining',
    'Quality Check',
    'Dispatched',
  ];

  // Filter orders
  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.config.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter inventory
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export CSV helper
  const exportSubscribersCSV = () => {
    const headers = 'ID,Email,Subscribed At,Source\n';
    const rows = subscribers.map((s) => `"${s.id}","${s.email}","${s.subscribedAt}","${s.source}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CRE8_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // If not logged in, render Admin Login Modal
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-white/20 p-8 space-y-6 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-sans uppercase text-white">
              CRE8 Studio Backend
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Admin Portal: Custom Orders & Raw Material Inventory
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                Admin User / Email:
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                Password:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition-all"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <span className="text-[10px] font-mono text-zinc-500">
              Demo credentials pre-filled. Click "Sign In" to access orders & inventory.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard interface once logged in
  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col overflow-hidden animate-in fade-in duration-150">
      {/* Top Navbar */}
      <header className="h-16 px-6 bg-zinc-950 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="font-extrabold text-base font-mono tracking-wider uppercase">
              CRE8 Studio Admin
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/10">
              LEAD CAM: NIMETH SIIR
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden sm:flex items-center gap-1 ml-6 p-1 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setCurrentTab('orders')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                currentTab === 'orders'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setCurrentTab('inventory')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                currentTab === 'inventory'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory ({inventory.length})</span>
            </button>
            <button
              onClick={() => setCurrentTab('leads')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                currentTab === 'leads'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Newsletter Leads ({subscribers.length})</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="p-2 rounded text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 text-xs font-mono flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Log Out</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/15"
            title="Exit to Site"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="sm:hidden grid grid-cols-3 gap-1 p-2 bg-zinc-950 border-b border-white/10 text-xs font-mono shrink-0">
        <button
          onClick={() => setCurrentTab('orders')}
          className={`py-1.5 text-center rounded ${currentTab === 'orders' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'}`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setCurrentTab('inventory')}
          className={`py-1.5 text-center rounded ${currentTab === 'inventory' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'}`}
        >
          Inventory
        </button>
        <button
          onClick={() => setCurrentTab('leads')}
          className={`py-1.5 text-center rounded ${currentTab === 'leads' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'}`}
        >
          Leads
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Search & Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by ID, client, material..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            {currentTab === 'inventory' && (
              <button
                onClick={() => setShowAddStockModal(true)}
                className="px-4 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono uppercase flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Material Stock</span>
              </button>
            )}

            {currentTab === 'leads' && (
              <button
                onClick={exportSubscribersCSV}
                className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-200 text-xs font-mono uppercase flex items-center gap-1.5"
              >
                <FileDown className="w-4 h-4 text-amber-400" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {currentTab === 'orders' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900/80 text-zinc-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Custom Text / Specs</th>
                      <th className="py-3 px-4">Dimensions</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Quote</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">
                            {order.id}
                            <span className="block text-[10px] text-zinc-500 font-normal">
                              {order.createdAt}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-zinc-200 font-semibold block">{order.customerName}</span>
                            <span className="text-zinc-500 text-[11px] block">{order.email}</span>
                            <span className="text-zinc-500 text-[10px] block">{order.phone}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-amber-400 font-bold uppercase block">
                              "{order.config.text}"
                            </span>
                            <span className="text-zinc-400 text-[11px] block">
                              Shape: {order.config.shape} • {order.config.reliefType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300">
                            {order.config.widthMm} x {order.config.heightMm} x {order.config.thicknessMm} mm
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono border focus:outline-none ${getStatusBadge(order.status)}`}
                            >
                              {statusOptions.map((st) => (
                                <option key={st} value={st} className="bg-zinc-900 text-white">
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">
                            ${order.estimatedPrice}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10"
                              title="View Full Spec"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteOrder(order.id)}
                              className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-500">
                          No matching orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY TRACKING */}
        {currentTab === 'inventory' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-zinc-950 border border-white/10 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white font-sans line-clamp-2">
                      {item.name}
                    </h4>

                    <div className="text-[11px] font-mono text-zinc-400">
                      {item.specifications}
                    </div>
                  </div>

                  {/* Stock Quantity Controls */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Current Stock:</span>
                      <span className="text-lg font-bold font-mono text-white">
                        {item.stockQuantity} <span className="text-xs font-normal text-zinc-400">{item.unit}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateStock(item.id, Math.max(0, item.stockQuantity - 1))}
                        className="w-7 h-7 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/15 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => onUpdateStock(item.id, item.stockQuantity + 1)}
                        className="w-7 h-7 rounded bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEADS / SUBSCRIBERS */}
        {currentTab === 'leads' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/80 text-zinc-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Lead ID</th>
                    <th className="py-3 px-4">Subscriber Email</th>
                    <th className="py-3 px-4">Subscribed At</th>
                    <th className="py-3 px-4">Acquisition Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-zinc-900/40">
                      <td className="py-3 px-4 text-zinc-500">{sub.id}</td>
                      <td className="py-3 px-4 text-white font-semibold">{sub.email}</td>
                      <td className="py-3 px-4 text-zinc-400">{sub.subscribedAt}</td>
                      <td className="py-3 px-4 text-amber-400">{sub.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/20 p-6 space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-amber-400 uppercase">
                Order Specs // {selectedOrderDetails.id}
              </span>
              <h3 className="text-xl font-bold font-sans uppercase text-white">
                "{selectedOrderDetails.config.text}"
              </h3>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-zinc-900/80 border border-white/10 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">Client:</span>
                <span className="text-white">{selectedOrderDetails.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">Email:</span>
                <span className="text-white">{selectedOrderDetails.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">Phone:</span>
                <span className="text-white">{selectedOrderDetails.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">Material Stock:</span>
                <span className="text-amber-400">{selectedOrderDetails.config.materialId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">Dimensions:</span>
                <span className="text-white">
                  {selectedOrderDetails.config.widthMm} x {selectedOrderDetails.config.heightMm} x {selectedOrderDetails.config.thicknessMm} mm
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">Edge & Hardware:</span>
                <span className="text-white">
                  {selectedOrderDetails.config.edgeFinish} • {selectedOrderDetails.config.standoff}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Halo Backlight:</span>
                <span className="text-white">{selectedOrderDetails.config.backlight}</span>
              </div>
              {selectedOrderDetails.notes && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-zinc-500 block mb-1">Client Special Instructions:</span>
                  <p className="text-zinc-300 font-sans italic">{selectedOrderDetails.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 rounded bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-white/20 p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setShowAddStockModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-sans uppercase text-white">
              Add New Material / Tooling Stock
            </h3>

            <form onSubmit={handleAddStockSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-zinc-400 uppercase block mb-1">Item Name:</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. American Black Walnut FAS Slabs"
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase block mb-1">Category:</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-white"
                  >
                    <option value="Sheets & Slabs">Sheets & Slabs</option>
                    <option value="Billets & Rods">Billets & Rods</option>
                    <option value="Endmills & Tooling">Endmills & Tooling</option>
                    <option value="Hardware & Fasteners">Hardware & Fasteners</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 uppercase block mb-1">Material Alloy / Spec:</label>
                  <input
                    type="text"
                    value={newItemMaterial}
                    onChange={(e) => setNewItemMaterial(e.target.value)}
                    placeholder="e.g. 6061-T6 Al"
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 uppercase block mb-1">Dimensions / Spec:</label>
                <input
                  type="text"
                  value={newItemSpecs}
                  onChange={(e) => setNewItemSpecs(e.target.value)}
                  placeholder="e.g. 2400 x 300 x 25 mm"
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase block mb-1">Quantity & Unit:</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      required
                      min="1"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                      className="w-20 px-3 py-2 rounded bg-zinc-900 border border-white/15 text-white"
                    />
                    <input
                      type="text"
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      placeholder="slabs/pcs"
                      className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-white/15 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 uppercase block mb-1">Cost Per Unit ($):</label>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase mt-2"
              >
                Save to Shop Inventory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
