import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/axios';
import dayjs from 'dayjs';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [form] = Form.useForm();

  const fetchPatients = async () => {
    setLoading(true);
    const res = await api.get('/Patients');
    setPatients(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const onSave = async (values: any) => {
    await api.post('/Patients', {
      ...values,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
    });
    message.success('Patient added');
    setModal(false);
    form.resetFields();
    fetchPatients();
  };

  const columns = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (v: string) => dayjs(v).format('DD-MM-YYYY'),
    },
  ];

  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Patients</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal(true)}>
          Add Patient
        </Button>
      </div>
      <Table columns={columns} dataSource={patients} loading={loading} rowKey="id" /> */}

            <div className="page-header">
        <h2>Patients</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModal(true)}
          className="page-add-btn"
        >
          Add Patient
        </Button>
      </div>
      <div className="styled-table">
        <Table
          columns={columns}
          dataSource={patients}
          loading={loading}
          rowKey="id"
        />
      </div>

      <Modal title="Add Patient" open={modal} onCancel={() => setModal(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Patients;