import { Layout, Menu, Dropdown } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  SettingOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/layout.scss";

const { Sider, Header, Content } = Layout;

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of your clinic" },
  "/doctors": { title: "Doctors", subtitle: "Manage your medical staff" },
  "/patients": { title: "Patients", subtitle: "Manage patient records" },
  "/appointments": {
    title: "Appointments",
    subtitle: "Manage bookings & schedules",
  },
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const email = useAuthStore((s) => s.email);
  const roles = useAuthStore((s) => s.roles);

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/doctors", icon: <UserOutlined />, label: "Doctors" },
    { key: "/patients", icon: <TeamOutlined />, label: "Patients" },
    { key: "/appointments", icon: <CalendarOutlined />, label: "Appointments" },
    { type: "divider" as const },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  const handleMenu = ({ key }: { key: string }) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  const initials = email ? email.slice(0, 2).toUpperCase() : "U";
  const userMenuItems = [
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { type: "divider" as const },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  const onUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    }
  };


  return (
    <Layout className="app-shell">
      <Sider collapsible className="app-sider" width={230}>
        <div className="sider-brand">
          <div className="sider-brand__icon">
            <MedicineBoxOutlined style={{ color: "#fff", fontSize: 16 }} />
          </div>
          <span className="sider-brand__text">ClinicApp</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenu}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <div className="app-header__left" />
          <div className="app-header__right">
            {" "}
            <div className="app-header__icon-btn">
              <BellOutlined />
            </div>
            <Dropdown
              menu={{ items: userMenuItems, onClick: onUserMenuClick }}
              trigger={["click"]}
            >
              <div className="app-header__user">
                <div className="app-header__avatar">{initials}</div>
                <div className="app-header__user-info">
                  <span className="app-header__user-name">
                    {email?.split("@")[0]}
                  </span>
                  <span className="app-header__user-role">
                    {roles?.[0] ?? "User"}
                  </span>
                </div>
                <DownOutlined style={{ fontSize: 10, color: "#999" }} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
