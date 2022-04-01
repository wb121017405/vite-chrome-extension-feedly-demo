import { Button, Col, Layout, Menu, message, Row, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import {
  HistoryOutlined,
  ThunderboltFilled,
  HomeOutlined,
  SyncOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';
import { getMarkersCounts } from '@/api';

const { Header, Footer, Sider, Content } = Layout;

interface LayoutProps {
  children?: React.ReactNode;
}

export default (props: LayoutProps) => {
  const { children } = props;
  const reload = () => {
    message.success('reload success');
  };
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
    }
  };
  const testBtn = () => {
    try {
      chrome.storage.sync.get(['accessToken'], function (result) {
        console.log('Value currently is ' + result.accessToken);
        message.info(result.accessToken);
      });
    } catch (error) {
      console.log(error);
    }
    HandleGetMarkersCounts();
  };
  return (
    <Layout className={styles.mainLayout}>
      <Header className={styles.header}>
        <Row>
          <Col span={8}>Feed</Col>
          <Col span={8}>center</Col>
          <Col span={8}>
            <div className={styles.header_op}>
              <Tooltip title="refresh">
                <Button type="link" icon={<SyncOutlined spin />} onClick={reload} />
              </Tooltip>
              <Button type="link" ghost icon={<SmileOutlined rotate={180} />} onClick={testBtn} />
            </div>
          </Col>
        </Row>
      </Header>
      <Layout style={{ backgroundColor: '#fff' }}>
        <Sider className={styles.sider} collapsed={true} trigger={null} theme={'light'}>
          <Menu className={styles.menu} mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <NavLink to={'/dashboard'}>Home</NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<HistoryOutlined />}>
              <NavLink to={'/history'}>History</NavLink>
            </Menu.Item>
            <Menu.Item key="3" icon={<ThunderboltFilled />}>
              {/* TODO */}
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className={styles.mainContainer}>{children}</Content>
      </Layout>
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
};
