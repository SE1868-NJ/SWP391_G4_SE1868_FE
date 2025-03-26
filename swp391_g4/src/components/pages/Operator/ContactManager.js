import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [message, setMessage] = useState('');

  // Lấy danh sách liên hệ khi component được mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      // Sửa đường dẫn API và thêm đầy đủ URL
      const response = await axios.get('http://localhost:4000/api/contact/list');
      if (response.data.success) {
        setContacts(response.data.contacts);
      } else {
        setMessage('Không thể lấy danh sách liên hệ: ' + response.data.message);
      }
    } catch (error) {
      // Cải thiện thông báo lỗi để dễ debug
      setMessage('Lỗi khi lấy danh sách liên hệ: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleResolve = async (contactId) => {
    try {
      // Sửa đường dẫn API và thêm đầy đủ URL
      const response = await axios.post(`http://localhost:4000/api/contact/resolve/${contactId}`, { responseMessage });
      if (response.data.success) {
        setMessage('Phản hồi thành công!');
        setSelectedContact(null);
        setResponseMessage('');
        fetchContacts(); // Cập nhật lại danh sách
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Lỗi khi gửi phản hồi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý liên hệ</h2>
      {message && <p style={{ color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}

      {/* Bảng hiển thị danh sách liên hệ */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tên</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Số điện thoại</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tin nhắn</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ngày tạo</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Trạng thái</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.phone}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.message}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(contact.created_at).toLocaleString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {contact.status === 'Pending' && (
                  <button onClick={() => setSelectedContact(contact)}>Xử lý</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form xử lý liên hệ */}
      {selectedContact && (
        <div style={{ border: '1px solid #ddd', padding: '20px', marginTop: '20px' }}>
          <h3>Phản hồi liên hệ: {selectedContact.name}</h3>
          <p>Email: {selectedContact.email}</p>
          <p>Tin nhắn: {selectedContact.message}</p>
          <textarea
            style={{ width: '100%', height: '100px', marginBottom: '10px' }}
            placeholder="Nhập nội dung phản hồi..."
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
          />
          <button
            onClick={() => handleResolve(selectedContact.id)}
            style={{ marginRight: '10px' }}
          >
            Gửi phản hồi
          </button>
          <button onClick={() => setSelectedContact(null)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;