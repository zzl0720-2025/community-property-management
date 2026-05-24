import React, { useState } from 'react';
import {
  Card, Typography, List, Avatar, Button, Input, Modal, Form, message, Space, Tag,
} from 'antd';
import {
  UserOutlined, PlusOutlined, MessageOutlined, LikeOutlined, LikeFilled
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function Discussion() {
  // Each post has id, title, content, author, time, replies (array)
  // Each reply has id, author, content, time, likes, liked (whether the current user liked it)
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Upcoming community square-dance event',
      content: 'Tentative date: 2026-05-10. Capacity: 20.',
      author: 'Property Manager A',
      time: '2026-05-07',
      replies: [
        { id: 101, author: 'Resident 1', content: 'Sign me up!', time: '2025-05-07 14:30', likes: 5, liked: false },
        { id: 102, author: 'Resident 2', content: 'Count me in too!', time: '2025-05-07 16:20', likes: 3, liked: false },
      ],
    },
    {
      id: 2,
      title: 'Parking gate access reminder',
      content: 'Please keep your parking card with you when entering the garage after 10 PM.',
      author: 'Community Management',
      time: '2025-05-07',
      replies: [
        { id: 201, author: 'Resident 3', content: 'Thanks for the reminder.', time: '2025-05-07 10:15', likes: 2, liked: false },
      ],
    },
    {
      id: 3,
      title: 'Package room pickup hours',
      content: 'Has anyone confirmed whether weekend package pickup is available after 6 PM?',
      author: 'Resident 4',
      time: '2025-05-07',
      replies: [],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const [replyForm] = Form.useForm();
  const [postForm] = Form.useForm();

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

  const openPostModal = () => {
    setPostModalVisible(true);
    postForm.resetFields();
  };

  const closePostModal = () => {
    setPostModalVisible(false);
    postForm.resetFields();
  };

  const handleCreatePost = (values) => {
    const newPost = {
      id: Date.now(),
      title: values.title,
      content: values.content,
      author: 'Current User',
      time: new Date().toLocaleDateString(),
      replies: [],
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    message.success('Discussion posted');
    closePostModal();
  };

  const handleAddReply = (values) => {
    if (!currentPost) return;
    const newReply = {
      id: Date.now(),
      author: 'Current User',
      content: values.replyContent,
      time: new Date().toLocaleString(),
      likes: 0,
      liked: false,
    };
    updatePostReplies(currentPost.id, (replies) => [...replies, newReply]);
    message.success('Reply posted');
    replyForm.resetFields();
    // Update the currently displayed post so the modal's reply list refreshes immediately
    setCurrentPost(prev => ({
      ...prev,
      replies: [...prev.replies, newReply]
    }));
  };

  // Like a reply
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
    // Sync the currently displayed post object
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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ marginBottom: 0 }}>Community Discussion</Title>
            <Paragraph type="secondary">Share life and build a friendly community</Paragraph>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openPostModal}>
            Post Discussion
          </Button>
        </div>

        {/* Post list */}
        <List
          itemLayout="vertical"
          dataSource={posts}
          renderItem={(post) => (
            <List.Item
              key={post.id}
              actions={[
                <Space key="reply" onClick={() => openReplyModal(post)} style={{ cursor: 'pointer' }}>
                  <MessageOutlined /> {post.replies.length} replies
                </Space>,
                <span key="time">{post.time}</span>,
              ]}
              extra={post.replies.length > 0 ? <Tag color="blue">Hot</Tag> : null}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<Text strong>{post.title}</Text>}
                description={`Author: ${post.author}`}
              />
              {post.content}
            </List.Item>
          )}
        />

        {/* New post modal */}
        <Modal
          title="Post Discussion"
          open={postModalVisible}
          onCancel={closePostModal}
          footer={null}
          width={600}
        >
          <Form form={postForm} onFinish={handleCreatePost} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Discussion title" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: 'Please enter discussion content' }]}
            >
              <TextArea rows={5} placeholder="Share your message with the community..." />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                Post Discussion
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Reply modal */}
        <Modal
          title={`Reply - ${currentPost?.title || ''}`}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width={700}
        >
          {currentPost && (
            <>
              {/* Original post summary */}
              <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
                <Paragraph>
                  <Text strong>{currentPost.author}</Text> posted on {currentPost.time}
                </Paragraph>
                <Paragraph>{currentPost.content}</Paragraph>
              </Card>

              {/* Reply list */}
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 16 }}>All replies ({currentPost.replies.length})</Text>
                <List
                  dataSource={currentPost.replies}
                  renderItem={(reply) => renderReplyItem(reply, currentPost.id)}
                  locale={{ emptyText: 'No replies yet' }}
                  style={{ marginTop: 12 }}
                />
              </div>

              {/* New reply form */}
              <Form form={replyForm} onFinish={handleAddReply} layout="vertical">
                <Form.Item
                  name="replyContent"
                  label="Post a reply"
                  rules={[{ required: true, message: 'Please enter your reply' }]}
                >
                  <TextArea rows={3} placeholder="Write your reply..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Submit reply</Button>
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
