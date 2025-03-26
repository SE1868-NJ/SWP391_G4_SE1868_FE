import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/BonusSettings.css';

const BonusSettings = () => {
  const [settings, setSettings] = useState({
    rating5Threshold: 60,
    rating5Bonus: 10000,
    rating4And5Threshold: 60,
    rating4And5Bonus: 5000,
    otherBonus: 2000,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/bonus/settings');
      setSettings({
        rating5Threshold: parseFloat(response.data.rating5Threshold),
        rating5Bonus: parseFloat(response.data.rating5Bonus),
        rating4And5Threshold: parseFloat(response.data.rating4And5Threshold),
        rating4And5Bonus: parseFloat(response.data.rating4And5Bonus),
        otherBonus: parseFloat(response.data.otherBonus),
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:4000/api/bonus/update-settings', {
        rating5Threshold: parseFloat(settings.rating5Threshold),
        rating5Bonus: parseFloat(settings.rating5Bonus),
        rating4And5Threshold: parseFloat(settings.rating4And5Threshold),
        rating4And5Bonus: parseFloat(settings.rating4And5Bonus),
        otherBonus: parseFloat(settings.otherBonus),
      });
      setSnackbar({
        open: true,
        message: 'Cài đặt đã được cập nhật thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật cài đặt!',
        severity: 'error',
      });
    }
  };

  const handleReset = () => {
    setSettings({
      rating5Threshold: 60,
      rating5Bonus: 10000,
      rating4And5Threshold: 60,
      rating4And5Bonus: 5000,
      otherBonus: 2000,
    });
    alert('Đã khôi phục về cài đặt mặc định');
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value === '' ? '' : parseFloat(value) }));
  };

  return (
    <div>
      <header className="BonusSetting-header">
        <div className="BonusSetting-logo">
          
          <span>Quản Lý Tiền Thưởng của Shipper</span>
        </div>
        <nav>
          <ul className="BonusSetting-nav-list">
            <li><a href="http://localhost:3000/shipper-bonus-list">Danh sách thưởng</a></li>
            <li><a href="#" className="active">Cài đặt</a></li>
          </ul>
        </nav>
      </header>

      <main className="BonusSetting-main">
        <div className="BonusSetting-settings-container">
          <h1>Cài Đặt Thưởng Shipper</h1>
          <p>Thiết lập các quy tắc tính tiền thưởng dựa trên đánh giá của shipper</p>

          <div className="BonusSetting-form-group">
            <label htmlFor="rating5Threshold">Ngưỡng Rating 5 sao (%):</label>
            <input
              type="number"
              id="rating5Threshold"
              value={settings.rating5Threshold}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
            />
            <small>Tỷ lệ đơn hàng đạt 5 sao để nhận mức thưởng cao nhất</small>
          </div>

          <div className="BonusSetting-form-group">
            <label htmlFor="rating4And5Threshold">Ngưỡng Rating 4 + 5 sao (%):</label>
            <input
              type="number"
              id="rating4And5Threshold"
              value={settings.rating4And5Threshold}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
            />
            <small>Tỷ lệ đơn hàng đạt 4 hoặc 5 sao để nhận mức thưởng trung bình</small>
          </div>

          <div className="BonusSetting-form-group">
            <label htmlFor="rating5Bonus">Thưởng cho Rating 5 sao (VNĐ/đơn):</label>
            <input
              type="number"
              id="rating5Bonus"
              value={settings.rating5Bonus}
              onChange={handleChange}
              min="0"
              step="1000"
            />
            <small>Số tiền thưởng mỗi đơn nếu đạt ngưỡng Rating 5 sao</small>
          </div>

          <div className="BonusSetting-form-group">
            <label htmlFor="rating4And5Bonus">Thưởng cho Rating 4 + 5 sao (VNĐ/đơn):</label>
            <input
              type="number"
              id="rating4And5Bonus"
              value={settings.rating4And5Bonus}
              onChange={handleChange}
              min="0"
              step="1000"
            />
            <small>Số tiền thưởng mỗi đơn nếu đạt ngưỡng Rating 4 + 5 sao</small>
          </div>

          <div className="BonusSetting-form-group">
            <label htmlFor="otherBonus">Thưởng mặc định (VNĐ/đơn):</label>
            <input
              type="number"
              id="otherBonus"
              value={settings.otherBonus}
              onChange={handleChange}
              min="0"
              step="1000"
            />
            <small>Số tiền thưởng mỗi đơn nếu không đạt các ngưỡng trên</small>
          </div>

          <div className="BonusSetting-actions">
            <button className="BonusSetting-save" onClick={handleSave}>
              <i className="fas fa-save"></i> Lưu cài đặt
            </button>
            <button className="BonusSetting-reset" onClick={handleReset}>
              <i className="fas fa-undo"></i> Khôi phục mặc định
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BonusSettings;