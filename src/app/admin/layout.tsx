   // app/admin/layout.tsx
    "use client";
    import { Toaster } from "@/components/Ui/toaster";
    import { ToastProvider } from "@/components/Ui/use-toast";
    import React from "react";


   export default function AdminLayout({ children }: { children: React.ReactNode }) {
     return (
      <>
         <div className="flex bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white"suppressHydrationWarning={true} >



           {/* Main content */}
           <div className="flex-1 flex flex-col overflow-hidden">
             <main className="flex-1 overflow-y-auto p-6">
             <ToastProvider>
               {children}
              <Toaster />
            </ToastProvider>
             </main>
           </div>
         </div>
 </>
     );
   }
