import { Form, Input, Button, Select, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/auth.scss';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await api.post('/Auth/register', values);
      if (res.data.success) {
        message.success('Account created! Please sign in.');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      message.error(errors?.[0] || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__logo">
            <div className="icon-box">
              <MedicineBoxOutlined style={{ fontSize: 18 }} />
            </div>
            <span>ClinicApp</span>
          </div>

          <div>
            <p className="auth-brand__heading">
              Join and start<br />booking smarter
            </p>
            <p className="auth-brand__subtext">
              Create an account to manage doctors, patients and appointments.
            </p>
          </div>

          <div className="auth-brand__dots">
            <span />
            <span className="active" />
            <span />
          </div>
        </div>

        <div className="auth-form-panel">
          <h2>Create account</h2>
          <p className="auth-form-panel__subtitle">Get started with ClinicApp in seconds</p>

          <Form layout="vertical" onFinish={onFinish} initialValues={{ role: 'Patient' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item
                name="firstName"
                label="First name"
                rules={[{ required: true, message: 'Required' }]}
                style={{ flex: 1 }}
              >
                <Input prefix={<UserOutlined style={{ color: '#aaa' }} />} placeholder="John" size="large" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last name"
                rules={[{ required: true, message: 'Required' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Smith" size="large" />
              </Form.Item>
            </div>

            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
              <Input prefix={<MailOutlined style={{ color: '#aaa' }} />} placeholder="you@clinic.com" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Enter a password' },
                { min: 8, message: 'At least 8 characters' },
              ]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#aaa' }} />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select
                size="large"
                options={[
                  { value: 'Patient', label: 'Patient' },
                  { value: 'Doctor', label: 'Doctor' },
                  { value: 'Admin', label: 'Admin' },
                ]}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block size="large" className="auth-form-panel__submit">
              Create account
            </Button>
          </Form>

          <p className="auth-form-panel__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;