import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

interface Stats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}



const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/Dashboard/stats").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  const email = useAuthStore((s) => s.email);
const firstName = email ? email.split("@")[0] : "there";

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Doctors",
      value: stats?.totalDoctors,
      icon: <UserOutlined />,
      color: "#1677ff",
    },
    {
      title: "Total Patients",
      value: stats?.totalPatients,
      icon: <TeamOutlined />,
      color: "#52c41a",
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments,
      icon: <CalendarOutlined />,
      color: "#722ed1",
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments,
      icon: <FieldTimeOutlined />,
      color: "#fa8c16",
    },
    {
      title: "Pending",
      value: stats?.pendingAppointments,
      icon: <ClockCircleOutlined />,
      color: "#faad14",
    },
    {
      title: "Completed",
      value: stats?.completedAppointments,
      icon: <CheckCircleOutlined />,
      color: "#13c2c2",
    },
  ];

  return (
    <div>
      {/* <h2 style={{ marginBottom: 24 }}>Dashboard</h2> */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
          Welcome back, {firstName} 👋
        </h2>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
          Here's what's happening at your clinic today
        </p>
      </div>
      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col xs={24} sm={12} lg={8} key={c.title}>
            <Card
              variant="borderless"
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: `${c.color}15`,
                    color: c.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {c.icon}
                </div>
                <Statistic
                  title={c.title}
                  value={c.value ?? 0}
                  valueStyle={{ fontSize: 28, fontWeight: 600 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
