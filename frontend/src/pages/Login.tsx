import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import '../styles/auth.scss';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await api.post('/Auth/login', values);
      if (res.data.success) {
        const { accessToken, email, roles } = res.data.data;
        setAuth(accessToken, email, roles);
        message.success('Welcome back!');
        navigate('/dashboard');
      } else {
        message.error(res.data.message);
      }
    } catch {
      message.error('Invalid email or password');
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
              Manage appointments<br />without the chaos
            </p>
            <p className="auth-brand__subtext">
              Doctors, patients and bookings — all in one clean dashboard.
            </p>
          </div>

          <div className="auth-brand__dots">
            <span className="active" />
            <span />
            <span />
          </div>
        </div>

        <div className="auth-form-panel">
          <h2>Welcome back</h2>
          <p className="auth-form-panel__subtitle">Sign in to continue to your dashboard</p>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Enter your email' }]}>
              <Input prefix={<MailOutlined style={{ color: '#aaa' }} />} placeholder="you@clinic.com" size="large" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password' }]}>
              <Input.Password prefix={<LockOutlined style={{ color: '#aaa' }} />} placeholder="••••••••" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="auth-form-panel__submit">
              Sign in
            </Button>
          </Form>

          <p className="auth-form-panel__footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;