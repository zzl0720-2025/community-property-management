import React, { useState } from 'react';
import {
  Card, Typography, List, Avatar, Button, Input, Modal, Form, message, Space, Tag,
  Popconfirm
} from 'antd';
import {
  UserOutlined, PlusOutlined, MessageOutlined, LikeOutlined, LikeFilled
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function Discussion() {
  // 每个帖子包含 id, title, content, author, time, replies (数组)
  // 每个回复包含 id, author, content, time, likes, liked (当前用户是否已点赞)
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '小区即将举办广场舞活动',
      content: '时间暂定2026-05-10，可参加人数20',
      author: '物业A',
      time: '2026-05-07',
      replies: [
        { id: 101, author: '业主1', content: '急急急', time: '2025-05-07 14:30', likes: 5, liked: false },
        { id: 102, author: '业主2', content: '急急急急急急', time: '2025-05-07 16:20', likes: 3, liked: false },
      ],
    },
    {
      id: 2,
      title: 'title2',
      content: 'content2',
      author: 'proprietor2',
      time: '2025-05-07',
      replies: [
        { id: 201, author: 'proprietor3', content: 'comment1', time: '2025-05-07 10:15', likes: 2, liked: false },
      ],
    },
    {
      id: 3,
      title: 'title3',
      content: 'content3',
      author: 'proprietor3',
      time: '2025-05-07',
      replies: [],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const [replyForm] = Form.useForm();

  const updatePostReplies = (postId, updater) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === postId ? { ...post, replies: updater(post.replies) } : post
    ));
  };

  const openReplyModal = (post) => {
    setCurrentPost(post);
    setModalVisible(true);
    replyForm.resetFields();
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentPost(null);
  };

  const handleAddReply = (values) => {
    if (!currentPost) return;
    const newReply = {
      id: Date.now(), // 临时ID，实际应由后端生成
      author: '当前用户', // TODO: 从全局认证状态获取真实用户名
      content: values.replyContent,
      time: new Date().toLocaleString(),
      likes: 0,
      liked: false,
    };
    updatePostReplies(currentPost.id, (replies) => [...replies, newReply]);
    message.success('回复成功');
    replyForm.resetFields();
    // 更新当前显示的帖子对象，以便模态框内的回复列表实时刷新
    setCurrentPost(prev => ({
      ...prev,
      replies: [...prev.replies, newReply]
    }));
  };

  // 点赞回复
  const handleLikeReply = (postId, replyId) => {
    updatePostReplies(postId, (replies) =>
      replies.map(reply =>
        reply.id === replyId
          ? {
              ...reply,
              likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
              liked: !reply.liked,
            }
          : reply
      )
    );
    // 同步更新当前显示的帖子对象
    if (currentPost && currentPost.id === postId) {
      setCurrentPost(prev => ({
        ...prev,
        replies: prev.replies.map(reply =>
          reply.id === replyId
            ? {
                ...reply,
                likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                liked: !reply.liked,
              }
            : reply
        )
      }));
    }
  };

  const renderReplyItem = (reply, postId) => (
    <List.Item
      key={reply.id}
      actions={[
        <Button
          type="text"
          icon={reply.liked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
          onClick={() => handleLikeReply(postId, reply.id)}
        >
          {reply.likes}
        </Button>,
        <Text type="secondary" style={{ fontSize: 12 }}>{reply.time}</Text>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={<Text strong>{reply.author}</Text>}
        description={reply.content}
      />
    </List.Item>
  );

  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        {/* 头部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ marginBottom: 0 }}>社区讨论区</Title>
            <Paragraph type="secondary">分享生活，共建和谐社区</Paragraph>
          </div>
          {/* 发布新帖按钮*/}
        </div>

        {/* 帖子列表 */}
        <List
          itemLayout="vertical"
          dataSource={posts}
          renderItem={(post) => (
            <List.Item
              key={post.id}
              actions={[
                <Space key="reply" onClick={() => openReplyModal(post)} style={{ cursor: 'pointer' }}>
                  <MessageOutlined /> {post.replies.length} 回复
                </Space>,
                <span key="time">{post.time}</span>,
              ]}
              extra={post.replies.length > 0 ? <Tag color="blue">热门</Tag> : null}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<Text strong>{post.title}</Text>}
                description={`作者：${post.author}`}
              />
              {post.content}
            </List.Item>
          )}
        />

        {/* 回复模态框 */}
        <Modal
          title={`回复 · ${currentPost?.title || ''}`}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width={700}
        >
          {currentPost && (
            <>
              {/* 原帖内容摘要 */}
              <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
                <Paragraph>
                  <Text strong>{currentPost.author}</Text> 发表于 {currentPost.time}
                </Paragraph>
                <Paragraph>{currentPost.content}</Paragraph>
              </Card>

              {/* 回复列表 */}
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 16 }}>全部回复 ({currentPost.replies.length})</Text>
                <List
                  dataSource={currentPost.replies}
                  renderItem={(reply) => renderReplyItem(reply, currentPost.id)}
                  locale={{ emptyText: '暂无回复' }}
                  style={{ marginTop: 12 }}
                />
              </div>

              {/* 添加新回复的表单 */}
              <Form form={replyForm} onFinish={handleAddReply} layout="vertical">
                <Form.Item
                  name="replyContent"
                  label="发表回复"
                  rules={[{ required: true, message: '请输入回复内容' }]}
                >
                  <TextArea rows={3} placeholder="写下你的回复..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">提交回复</Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Modal>
      </Card>
    </div>
  );
}

const styles = {
  page: { maxWidth: '960px', margin: '0 auto' },
  card: { boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)' },
};

export default Discussion;