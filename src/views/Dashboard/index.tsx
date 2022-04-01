import React, { useEffect, useState } from 'react';
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { getFeedStreams } from '@/api';
// import testList from './test.json';
// const listData: any = [];
// for (let i = 0; i < 23; i++) {
//   listData.push({
//     href: 'https://ant.design',
//     title: `ant design part ${i}`,
//     avatar: 'https://joeschmoe.io/api/v1/random',
//     description:
//       'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//     content:
//       'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//   });
// }
// const IconText = ({ icon, text }: any) => (
//   <Space>
//     {React.createElement(icon)}
//     {text}
//   </Space>
// );

const ListView = (props: any) => {
  const [streamList, setStreamList] = useState([]);
  const refreshFeedList = () => {
    if (chrome.storage) {
      chrome.storage.sync.get(['feedlyUserId'], async (result) => {
        const res: any = await getFeedStreams({
          streamId: `user/${result.feedlyUserId}/category/global.all`,
        });
        if (res.status === 200) {
          console.log(res?.data?.items);
          setStreamList(res?.data?.items);
        }
      });
    }
  };
  useEffect(() => {
    refreshFeedList();
  }, []);
  const openNewTab = (url: string) => {
    chrome.tabs.create({ url });
  };
  return (
    <List
      className={styles.list_view}
      itemLayout="vertical"
      size="large"
      dataSource={streamList}
      footer={
        <div>
          <b>Feedly</b> 没了没了 真的没了
        </div>
      }
      renderItem={(item: any) => (
        <List.Item
          key={item.title}
          // actions={[
          //   <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
          //   <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
          //   <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
          // ]}
          // extra={item?.visual?.url ? <img width={80} alt="logo" src={item?.visual?.url} /> : null}
          onClick={() => {
            openNewTab(item.alternate[0]?.href);
          }}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                  item.alternate[0]?.href,
                )}`}
              />
            }
            title={<a href={item.alternate[0]?.href}>{item.title}</a>}
            description={
              <div className={styles.list_view_item_meta_desc}>
                {item?.summary ? item?.summary?.content : item?.content?.content}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ListView;
