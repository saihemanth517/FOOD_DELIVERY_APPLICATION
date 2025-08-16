import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
   return (
      <div className="min-h-screen bg-gray-50 p-8">
         <h1 className="text-3xl font-bold mb-8 text-indigo-700">Admin Dashboard</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Dummy Stat Cards */}
            <div className="bg-white rounded-lg shadow-md p-6">
               <h2 className="text-lg font-semibold mb-2">Total Users</h2>
               <p className="text-3xl font-bold text-indigo-600">8</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
               <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
               <p className="text-3xl font-bold text-indigo-600">567</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
               <h2 className="text-lg font-semibold mb-2">Total Restaurants</h2>
               <p className="text-3xl font-bold text-indigo-600">42</p>
            </div>
         </div>
         {/* Dummy Graphs */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
               <h2 className="text-lg font-semibold mb-4">Orders Over Time</h2>
               <img src="https://dummyimage.com/400x200/ddd/888&text=Graph+1" alt="Orders Graph" className="w-full rounded" />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
               <h2 className="text-lg font-semibold mb-4">User Growth</h2>
               <img src="https://dummyimage.com/400x200/eee/888&text=Graph+2" alt="Users Graph" className="w-full rounded" />
            </div>
         </div>
         {/* Dummy Table */}
         <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <table className="min-w-full divide-y divide-gray-200">
               <thead>
                  <tr>
                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                     <td className="px-4 py-2">1001</td>
                     <td className="px-4 py-2">John Doe</td>
                     <td className="px-4 py-2">₹350</td>
                     <td className="px-4 py-2 text-green-600 font-semibold">Delivered</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-2">1002</td>
                     <td className="px-4 py-2">Jane Smith</td>
                     <td className="px-4 py-2">₹120</td>
                     <td className="px-4 py-2 text-yellow-600 font-semibold">Pending</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-2">1003</td>
                     <td className="px-4 py-2">Alice Brown</td>
                     <td className="px-4 py-2">₹280</td>
                     <td className="px-4 py-2 text-red-600 font-semibold">Cancelled</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default AdminDashboard;