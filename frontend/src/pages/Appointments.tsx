import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker, Input, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/axios';
import dayjs from 'dayjs';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const [a, d, p] = await Promise.all([
      api.get('/Appointments'),
      api.get('/Doctors'),
      api.get('/Patients'),
    ]);
    setAppointments(a.data);
    setDoctors(d.data);
    setPatients(p.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const onSave = async (values: any) => {
    try {
      await api.post('/Appointments', {
        ...values,
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        appointmentTime: values.appointmentTime.format('HH:mm:ss'),
      });
      message.success('Appointment booked');
      setModal(false);
      form.resetFields();
      fetchData();
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      message.error(errors?.[0] || 'Failed to book appointment');
    }
  };

  const statusColor: Record<string, string> = {
    Pending: 'orange',
    Confirmed: 'blue',
    Completed: 'green',
    Cancelled: 'red',
  };

  const columns = [
    { title: 'Patient', dataIndex: 'patientName', key: 'patientName' },
    { title: 'Doctor', dataIndex: 'doctorName', key: 'doctorName' },
    {
      title: 'Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (v: string) => dayjs(v).format('DD-MM-YYYY'),
    },
    { title: 'Time', dataIndex: 'appointmentTime', key: 'appointmentTime' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={statusColor[v] || 'default'}>{v}</Tag>,
    },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
  ];

  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Appointments</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal(true)}>
          Book Appointment
        </Button>
      </div>
      <Table columns={columns} dataSource={appointments} loading={loading} rowKey="id" /> */}

            <div className="page-header">
        <h2>Appointments</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModal(true)}
          className="page-add-btn"
        >
          Add Appointment
        </Button>
      </div>
      <div className="styled-table">
        <Table
          columns={columns}
          dataSource={appointments}
          loading={loading}
          rowKey="id"
        />
      </div>

      <Modal title="Book Appointment" open={modal} onCancel={() => setModal(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item name="patientId" label="Patient" rules={[{ required: true }]}>
            <Select options={patients.map((p: any) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))} />
          </Form.Item>
          <Form.Item name="doctorId" label="Doctor" rules={[{ required: true }]}>
            <Select options={doctors.map((d: any) => ({ value: d.id, label: `${d.fullName} (${d.specialization})` }))} />
          </Form.Item>
          <Form.Item name="appointmentDate" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} disabledDate={(d) => d.isBefore(dayjs(), 'day')} />
          </Form.Item>
          <Form.Item name="appointmentTime" label="Time" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={30} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;