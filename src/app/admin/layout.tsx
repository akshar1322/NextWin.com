   // app/admin/layout.tsx
    "use client";

   import React from "react";


   export default function AdminLayout({ children }: { children: React.ReactNode }) {
     return (
      <>

         <div className="flex bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white">



           {/* Main content */}
           <div className="flex-1 flex flex-col overflow-hidden">
             <main className="flex-1 overflow-y-auto p-6">
               {children}
             </main>
           </div>
         </div>
 </>
     );
   }
