// Install this package first:
// npm install xlsx file-saver --save

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Utility function to export data to Excel
export const exportToExcel = (data, fileName, sheetName = 'Sheet1') => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save the file using FileSaver
  saveAs(blob, `${fileName}_${new Date().toLocaleDateString('vi-VN')}.xlsx`);
};

// Format the data for each specific export
export const formatDataForExport = {
  // Format overview data
  overview: (data, revenueByDay) => {
    // Summary sheet data
    const summaryData = [
      { 
        'Chỉ số': 'Tổng doanh thu', 
        'Giá trị': data.revenue 
      },
      { 
        'Chỉ số': 'Tổng đơn hàng', 
        'Giá trị': data.orders 
      },
      { 
        'Chỉ số': 'Doanh thu trung bình/đơn', 
        'Giá trị': data.avgRevenue 
      },
      { 
        'Chỉ số': 'Lợi nhuận sau phí', 
        'Giá trị': data.profitAfterFees 
      }
    ];
    
    // Format the revenue by day data for the second sheet
    const formattedRevenueByDay = revenueByDay.map(item => ({
      'Ngày': item.date,
      'Doanh thu': item.revenue
    }));
    
    return { 
      summaryData,
      revenueData: formattedRevenueByDay
    };
  },
  
  // Format orders data
  orders: (ordersData) => {
    const statusText = {
      'success': 'Đã giao',
      'pending': 'Đang giao',
      'error': 'Lỗi giao'
    };
    
    const serviceText = {
      'Standard': 'Tiêu chuẩn',
      'Express': 'Nhanh',
      'Scheduled': 'Hẹn giờ'
    };
    
    const regionText = {
      'mid_zone': 'Quanh trung tâm',
      'central': 'Trung tâm',
      'outer_zone': 'Rìa trung tâm'
    };
    
    return ordersData.map(order => ({
      'Mã đơn hàng': order.id,
      'Ngày giao': order.date,
      'Loại dịch vụ': serviceText[order.type] || order.type,
      'Khu vực': regionText[order.region] || order.region,
      'Trạng thái': statusText[order.status] || order.status,
      'Doanh thu': order.revenue
    }));
  },
  
  // Format region data
  region: (revenueByRegion) => {
    return [
      { 'Khu vực': 'Trung tâm', 'Doanh thu': revenueByRegion.central || 0 },
      { 'Khu vực': 'Quanh trung tâm', 'Doanh thu': revenueByRegion.mid_zone || 0 },
      { 'Khu vực': 'Rìa trung tâm', 'Doanh thu': revenueByRegion.outer_zone || 0 }
    ];
  },
  
  // Format service data
  service: (revenueByService) => {
    // Normalize the data to handle case-insensitivity
    const normalizeRevenueData = (data) => {
      const normalized = { standard: 0, express: 0, scheduled: 0 };
      
      if (!data) return normalized;
      
      Object.keys(data).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (['standard', 'express', 'scheduled'].includes(lowerKey)) {
          normalized[lowerKey] += Number(data[key]) || 0;
        }
      });
      
      return normalized;
    };

    const normalizedData = normalizeRevenueData(revenueByService);
    
    return [
      { 'Loại dịch vụ': 'Giao hàng tiêu chuẩn', 'Doanh thu': normalizedData.standard },
      { 'Loại dịch vụ': 'Giao hàng nhanh', 'Doanh thu': normalizedData.express },
      { 'Loại dịch vụ': 'Giao hàng hẹn giờ', 'Doanh thu': normalizedData.scheduled }
    ];
  },
  
  // Format payments data
  payments: (payments) => {
    return payments.map(payment => ({
      'Mã giao dịch': payment.id,
      'Ngày thanh toán': payment.date,
      'Số tiền': payment.amount,
      'Phương thức': payment.method,
      'Trạng thái': payment.status
    }));
  },
  
  // Format fees data
  fees: (fees) => {
    return fees.map(fee => ({
      'Loại phí': fee.type,
      'Mô tả': fee.description,
      'Số tiền': fee.amount,
      'Tỷ lệ (%)': fee.percentage
    }));
  }
};

// Function to export multiple sheets in one workbook
export const exportMultipleSheets = (dataObj, fileName) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // For each key in the dataObj, create a worksheet
  Object.keys(dataObj).forEach((sheetName) => {
    const worksheet = XLSX.utils.json_to_sheet(dataObj[sheetName]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });
  
  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save the file using FileSaver
  saveAs(blob, `${fileName}_${new Date().toLocaleDateString('vi-VN')}.xlsx`);
};