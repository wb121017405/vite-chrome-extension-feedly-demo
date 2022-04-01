import ReactDOM from 'react-dom';
import './global.less';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from '@/layout';
import Dashboard from '@/views/Dashboard';
import HistoryList from '@/views/HistoryList';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.min.css';
import { useEffect } from 'react';
import { getMarkersCounts } from '@/api';

ConfigProvider.config({
  theme: {
    primaryColor: '#2bb24c',
  },
});
const App: React.FC = () => {
  // 获取未读数量并标记
  const HandleGetMarkersCounts = async () => {
    const res = await getMarkersCounts();
    console.log(res);
    if (res.status === 200) {
      let unreadCount = 0;
      res.data?.unreadcounts?.map((item: any) => {
        unreadCount += item.count;
      });
      if (unreadCount >= 9999) {
        unreadCount = 9999;
      }
      console.log(unreadCount);
      chrome.action.setBadgeText({ text: String(unreadCount) });
      chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
      // chrome.storage.local.set({ unreadCounts: res.data?.unreadcounts }, () => {
      //   console.log('set unreadCount success');
      // });
    }
  };
  useEffect(() => {
    HandleGetMarkersCounts();
  }, []);

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
