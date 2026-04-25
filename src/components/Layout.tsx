import { Outlet, useNavigation } from "react-router-dom";
import Sidebar from "./Sidebar";
import PageLoader from "./common/Loader";

export default function Layout() {
  const navigation = useNavigation();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "40px",
          marginLeft: "260px",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        {/* 🔥 GLOBAL LOADER */}
        {navigation.state === "loading" && <PageLoader />}

        <Outlet />
      </main>
    </div>
  );
}