import React from "react";

const OrderStatusSelect = ({ order, orderStatusList, handleStatusChange }) => {
  return (
    <select
      value={order.OrderStatus}
      onChange={(e) => handleStatusChange(order.OrderID, e.target.value)}
      className="form-select"
    >
      {orderStatusList.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default OrderStatusSelect;
