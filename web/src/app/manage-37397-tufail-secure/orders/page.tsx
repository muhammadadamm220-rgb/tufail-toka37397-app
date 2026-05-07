"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  writeBatch, 
  arrayUnion, 
  serverTimestamp,
  increment 
} from "firebase/firestore";
import { 
  CheckCircle, 
  XCircle, 
  Truck, 
  ExternalLink, 
  Download, 
  Clock,
  Search,
  Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import { generateInvoice } from "@/lib/pdfService";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setOrders(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (order: any) => {
    const confirm = window.confirm(`Approve payment for ${order.customerName}? Loyalty points will be added.`);
    if (!confirm) return;

    const batch = writeBatch(db);
    const orderRef = doc(db, "orders", order.id);
    const userRef = doc(db, "users", order.userId);

    // 1. Update Order
    batch.update(orderRef, {
      orderStatus: "approved",
      paymentStatus: "verified",
      adminApprovedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status: "approved",
        timestamp: new Date().toISOString(),
        note: "Payment verified by admin"
      })
    });

    // 2. Add Loyalty Points (1 point per Rs. 100)
    const points = Math.floor(order.totalAmount / 100);
    batch.update(userRef, {
      loyaltyPoints: increment(points)
    });

    try {
      await batch.commit();
      toast.success(`Order approved! ${points} points added to user account.`);
    } catch (err) {
      toast.error("Failed to approve order.");
    }
  };

  const handleReject = async (order: any) => {
    const reason = window.prompt("Reason for rejection:");
    if (reason === null) return;

    await writeBatch(db).update(doc(db, "orders", order.id), {
      orderStatus: "rejected",
      paymentStatus: "failed",
      rejectionReason: reason,
      statusHistory: arrayUnion({
        status: "rejected",
        timestamp: new Date().toISOString(),
        note: reason
      })
    }).commit();
    
    toast.error("Order rejected.");
  };

  const filteredOrders = orders.filter(o => 
    (filter === "all" || o.orderStatus === filter) &&
    (o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 bg-[#1a1a2e] min-h-screen p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-400">Approve payments and track delivery status</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="w-full pl-10 pr-4 py-2 bg-[#16213e] border border-gray-700 rounded-lg outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-[#16213e] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-primary"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Orders</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-[#16213e] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all shadow-xl">
            <div className="p-6 flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">{order.orderId}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    order.orderStatus === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                    order.orderStatus === "approved" ? "bg-green-500/20 text-green-500" :
                    "bg-red-500/20 text-red-500"
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Customer</p>
                    <p className="font-bold">{order.customerName}</p>
                    <p className="text-sm text-gray-400">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Location</p>
                    <p className="font-bold">{order.customerCity}</p>
                    <p className="text-sm text-gray-400 line-clamp-1">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4">
                  <p className="text-gray-500 text-xs uppercase mb-2">Order Items</p>
                  <div className="space-y-2">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity || 1}</span>
                        <span className="font-mono">Rs. {(item.price * (item.quantity || 1)).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-lg font-bold text-primary border-t border-gray-800 pt-2">
                      <span>Grand Total</span>
                      <span>Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-72 space-y-4">
                <p className="text-gray-500 text-xs uppercase mb-2">Payment Proof</p>
                {order.paymentScreenshotURL ? (
                  <div className="relative group cursor-pointer" onClick={() => window.open(order.paymentScreenshotURL)}>
                    <img 
                      src={order.paymentScreenshotURL} 
                      className="w-full aspect-video object-cover rounded-xl border border-gray-700 group-hover:opacity-75 transition-all" 
                      alt="Payment proof"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ExternalLink className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center text-gray-600 italic text-sm">
                    No screenshot uploaded
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleApprove(order)}
                    disabled={order.orderStatus !== "pending"}
                    className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(order)}
                    disabled={order.orderStatus !== "pending"}
                    className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
                
                <button 
                  onClick={() => generateInvoice(order)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-bold transition-all"
                >
                  <Download size={18} /> Download Invoice
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Clock size={48} className="mx-auto text-gray-700" />
            <p className="text-gray-500">No {filter} orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
