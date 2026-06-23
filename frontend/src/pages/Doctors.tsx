import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../api/axios";
import '../styles/pages.scss';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [form] = Form.useForm();

  const fetchDoctors = async () => {
    setLoading(true);
    const res = await api.get("/Doctors");
    setDoctors(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const onSave = async (values: any) => {
    await api.post("/Doctors", values);
    message.success("Doctor added");
    setModal(false);
    form.resetFields();
    fetchDoctors();
  };

  const columns = [
    { title: "Name", dataIndex: "fullName", key: "fullName" },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Fee", dataIndex: "consultationFee", key: "consultationFee" },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Doctors</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModal(true)}
          className="page-add-btn"
        >
          Add Doctor
        </Button>
      </div>
      <div className="styled-table">
        <Table
          columns={columns}
          dataSource={doctors}
          loading={loading}
          rowKey="id"
        />
      </div>
      <Modal
        title="Add Doctor"
        open={modal}
        onCancel={() => setModal(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="consultationFee"
            label="Consultation Fee"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Doctors;
