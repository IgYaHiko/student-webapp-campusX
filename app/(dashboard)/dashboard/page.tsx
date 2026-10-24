"use client";

import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-slate-500">{user?.email} • {user?.role}</p>
        </div>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>
      
      <div className="p-8 border-2 border-dashed rounded-lg text-center mt-10">
        <h2 className="text-xl font-semibold mb-2">Dashboard Coming Soon</h2>
        <p className="text-slate-500 mb-4">We are building the analytics and quick actions here.</p>
        <Button onClick={() => window.location.href = "/complaints"}>
          Go to My Complaints (Temporary)
        </Button>
      </div>
    </div>
  );
}