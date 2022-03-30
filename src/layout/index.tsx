import { Button, Col, Layout, Menu, Row, Tooltip } from "antd";
import { NavLink } from "react-router-dom";
import {
  HistoryOutlined,
  ThunderboltFilled,
  HomeOutlined,
  SyncOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import styles from "./index.module.less";

const { Header, Footer, Sider, Content } = Layout;

interface LayoutProps {
  children?: React.ReactNode;
}

export default (props: LayoutProps) => {
  const { children } = props;
  return (
    <Layout className={styles.mainLayout}>
      <Header className={styles.header}>
        <Row>
          <Col span={8}>Feed</Col>
          <Col span={8}>center</Col>
          <Col span={8}>
            <div className={styles.header_op}>
              <Tooltip title="refresh">
                <Button type="link" icon={<SyncOutlined spin />} />
              </Tooltip>
              <Button type="link" ghost icon={<SmileOutlined rotate={180} />} />
            </div>
          </Col>
        </Row>
      </Header>
      <Layout style={{ backgroundColor: "#fff" }}>
        <Sider
          className={styles.sider}
          collapsed={true}
          trigger={null}
          theme={"light"}
        >
          <Menu
            className={styles.menu}
            mode="inline"
            defaultSelectedKeys={["1"]}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <NavLink to={"/dashboard"}>Home</NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<HistoryOutlined />}>
              <NavLink to={"/history"}>History</NavLink>
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
