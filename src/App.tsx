import ReactDOM from 'react-dom';
import './global.less';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from '@/layout';
import Dashboard from '@/views/Dashboard';
import HistoryList from '@/views/HistoryList';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.min.css';

ConfigProvider.config({
  theme: {
    primaryColor: '#2bb24c',
  },
});
const App: React.FC = () => {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<HistoryList />} />
        </Routes>
      </Layout>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
