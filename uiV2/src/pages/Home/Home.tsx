import Sidebar from "@/components/Sidebar/Sidebar.tsx";
import Flow from "./ui/blocks/flow/Flow.tsx";
import { useState } from "react";

function Home() {
  const [collapsed, setSidebarCollapsed] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarWidth = 400; // The width you've set for your sidebar when it's expanded.
  
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden", // To ensure nothing overflows outside the viewport.
      }}
    >
      <div
        style={{
          flex: 1,
          width: collapsed ? "calc(100% - 16px)" : `calc(100% - ${sidebarWidth}px)`, // Subtracting the width of the sidebar when it's expanded.
          transition: "width 0.3s", // Smooth transition for the width change.
        }}
      >
        <Flow />
      </div>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setSidebarCollapsed}
        shown={showSidebar}
        position="right"
        width={sidebarWidth}
      />
    </div>
  );
}

export default Home;

