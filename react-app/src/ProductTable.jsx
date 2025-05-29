import React, { useEffect, useState } from "react";
import { Table, Select, Space, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

export const ProductTable = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/products`);
      const data = await res.json();
      console.log(data, "getting data");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      filters: Array.from(new Set(products.map((p) => p.category?.name)))
        .filter(Boolean)
        .map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.category?.name === value,
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Title level={3}>Product List</Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Space>
  );
};
