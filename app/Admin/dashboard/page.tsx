// "use client";

// import React, { useEffect, useState } from "react";
// import { client } from "@/sanity/lib/client";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import Swal from "sweetalert2";
// import ProtectedRoute from "@/app/components/ProtectedRoute";

// interface Order {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   total: number;
//   discount: number;
//   orderDate: string;
//   status: string | null;
//   cartitems: {
//     productName: string; image?: string 
// }[];
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           firstName,
//           lastName,
//           phone,
//           email,
//           address,
//           city,
//           zipCode,
//           total,
//           discount,
//           orderDate,
//           status,
//           cartitems[]->{
//             productName,
         
//             image
//           }
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error fetching orders:", error));
//   }, []);

//   const filteredOrders =
//     filter === "All" ? orders : orders.filter((order) => order.status === filter);

//   const toggleOrderDetails = (orderId: string) => {
//     setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   const handleDelete = async (orderId: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await client.delete(orderId);
//       setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
//       Swal.fire("Deleted!", "Your order has been deleted.", "success");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       Swal.fire("Error!", "Something went wrong while deleting.", "error");
//     }
//   };

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await client.patch(orderId).set({ status: newStatus }).commit();
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//       Swal.fire("Success", `Order status updated to ${newStatus}.`, "success");
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       Swal.fire("Error!", "Something went wrong while updating the status.", "error");
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col h-screen bg-gray-100">
//         <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
//           <h2 className="text-2xl font-bold">Admin Dashboard</h2>
//           <div className="flex space-x-4">
//             {["All", "pending", "dispatch", "success"].map((status) => (
//               <button
//                 key={status}
//                 className={`px-4 py-2 rounded-lg transition-all ${
//                   filter === status ? "bg-white text-red-600 font-bold" : "text-white"
//                 }`}
//                 onClick={() => setFilter(status)}
//               >
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </button>
//             ))}
//           </div>
//         </nav>

//         <div className="flex-1 p-6 overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-4 text-center">Orders</h2>
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
//               <thead className="bg-gray-50 text-red-600">
//                 <tr>
//                   <th>ID</th>
//                   <th>Customer</th>
//                   <th>Address</th>
//                   <th>Date</th>
//                   <th>Total</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredOrders.map((order) => (
//                   <React.Fragment key={order._id}>
//                     <tr
//                       className="cursor-pointer hover:bg-red-100 transition-all"
//                       onClick={() => toggleOrderDetails(order._id)}
//                     >
//                       <td>{order._id}</td>
//                       <td>{order.firstName} {order.lastName}</td>
//                       <td>{order.address}</td>
//                       <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                       <td>${order.total}</td>
//                       <td>
//                         <select
//                           value={order.status || ""}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="bg-gray-100 p-1 rounded"
//                         >
//                           <option value="all">All</option>
//                           <option value="pending">Pending</option>
//                           <option value="dispatch">Dispatch</option>
//                           <option value="success">Completed</option>
//                         </select>
//                       </td>
//                       <td>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDelete(order._id);
//                           }}
//                           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                     {selectedOrderId === order._id && (
//                       <tr>
//                         <td colSpan={7} className="bg-gray-50 p-4 transition-all animate-fadeIn">
//                           <h3 className="font-bold">Order Details</h3>
//                           <p><strong>Phone:</strong> {order.phone}</p>
//                           <p><strong>Email:</strong> {order.email}</p>
//                           <p><strong>City:</strong> {order.city}</p>
//                           <ul>
//                             {order.cartitems.map((item , index) => (
//                               <li key={`${order._id}-${index}`} className="flex items-center gap-2">
//                                 {item.productName}
                              
//                                 {item.image && (
//                                   <Image src={urlFor(item.image).url()} width={60} height={60} alt={item.productName} />
//                                 )}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

'use client'
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import logo from "../../../public/logo.png";

import { urlFor } from "@/sanity/lib/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartitems: {
    productName: string;
    image?: string;
  }[];
}

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
}

const StatusCard = ({ icon, title, count, color }: StatusCardProps) => (
  <Card className="flex-1">
    <CardContent className="flex items-center p-6">
      <div className={`p-2 rounded-lg ${color} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{count}</h3>
      </div>
    </CardContent>
  </Card>
);

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "dispatch":
      return "text-blue-600 bg-blue-100";
    case "success":
      return "text-green-600 bg-green-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zipCode,
          total,
          discount,
          orderDate,
          status,
          cartitems[]->{
            productName,
            image
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDelete = async (orderId: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;
    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const statusCounts = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    dispatch: orders.filter((order) => order.status === "dispatch").length,
    success: orders.filter((order) => order.status === "success").length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col">
          <div className="border-b bg-gray-700 text-white shadow-md ">
            <div className="flex h-16 items-center px-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Image src={logo} height={50} width={50} alt="logo" className="mr-2 hidden sm:block text-black" />
                Admin Dashboard
              </h2>
              <div className="ml-auto flex items-center shadow-md space-x-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    <SelectItem value="All">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="dispatch">Dispatched</SelectItem>
                    <SelectItem value="success">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <main className="flex-1 p-6 space-y-6 bg-gray-50">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatusCard
                icon={<Package className="h-6 w-6 text-blue-600" />}
                title="Total Orders"
                count={statusCounts.total}
                color="bg-blue-50"
              />
              <StatusCard
                icon={<Clock className="h-6 w-6 text-yellow-600" />}
                title="Pending"
                count={statusCounts.pending}
                color="bg-yellow-50"
              />
              <StatusCard
                icon={<Truck className="h-6 w-6 text-purple-600" />}
                title="Dispatched"
                count={statusCounts.dispatch}
                color="bg-purple-50"
              />
              <StatusCard
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                title="Completed"
                count={statusCounts.success}
                color="bg-green-50"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order._id.slice(0, 8)}...</TableCell>
                        <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>₹{order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="shadow-md border-2 "
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="shadow-md border-2 " 
                              onClick={() => handleDelete(order._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
<div>
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[425px] bg-gray-700">
            <DialogHeader>
              <DialogTitle className="text-md font-extrabold text-black" >Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-md font-extrabold text-black">Customer</p>
                    <p className="text-sm text-white">
                      {selectedOrder.firstName} {selectedOrder.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-extrabold text-black">Contact</p>
                    <p className="text-sm text-white">{selectedOrder.phone}</p>
                    <p className="text-sm text-white">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-md text-black font-extrabold">Shipping Address</p>
                    <p className="text-sm text-white">
                      {selectedOrder.address}, {selectedOrder.city} {selectedOrder.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-md  text-black font-extrabold">Status</p>
                    <Select

                      value={selectedOrder.status || ""}
                      onValueChange={(value) => handleStatusChange(selectedOrder._id, value)}
                    >
                      <SelectTrigger className="text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-white bg-slate-700 font-extrabold">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="dispatch">Dispatched</SelectItem>
                        <SelectItem value="success">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p className="text-md mb-2 text-black font-extrabold">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.cartitems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-300 rounded">
                        {item.image && (
                          <Image
                            src={urlFor(item.image).url()}
                            width={50}
                            height={50}
                            alt={item.productName}
                            className="rounded"
                          />
                        )}
                        <span className="text-sm">{item.productName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}

