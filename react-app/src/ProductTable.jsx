import React, { useEffect, useState } from "react";

import {
  Table,
  Space,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
  Select,
} from "antd";

import { toast } from "react-hot-toast";

const API_URL = "http://localhost:3000";
const { Title } = Typography;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  inputType,
  categories,
  ...restProps
}) => {
  const form = React.useContext(EditableContext);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [editing, dataIndex, form, record]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };
  let childNode = children;

  if (editable) {
    if (editing) {
      let inputNode;

      if (dataIndex === "categoryId") {
        // Special case: use Select for category
        inputNode = (
          <Select
            onChange={(value) => {
              form.setFieldValue(dataIndex, value);
              save();
            }}
            value={form.getFieldValue(dataIndex)}
            onBlur={save}
          >
            {categories.map((cat) => (
              <Select.Option key={cat.value} value={cat.value}>
                {cat.label}
              </Select.Option>
            ))}
          </Select>
        );
      } else if (inputType === "number") {
        inputNode = <InputNumber onPressEnter={save} onBlur={save} />;
      } else {
        inputNode = <Input onPressEnter={save} onBlur={save} />;
      }

      childNode = (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>
      );
    } else {
      childNode = (
        <div onClick={toggleEdit} style={{ cursor: "pointer" }}>
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

export const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      console.log(data, "getting data");

      setCategories(extractUniqueCategories(data));
      setCount(data.length);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.text();
        toast.error(`Failed to delete product: ${err}`);
        return;
      }

      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("The product was successfully deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("An error occurred while deleting the product");
    }
  };

  const handleAdd = async () => {
    const newProduct = {
      name: "New Product",
      price: 0,
      categoryId: null,
    };

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create product");
      }

      const created = await res.json();
      setProducts((prev) => [...prev, created]);
      setCount((prev) => prev + 1);
      toast.success("Product added successfully!");
    } catch (err) {
      console.error("Add failed:", err);
      toast.error("Error adding product: " + err.message);
    }
  };

  const handleSave = async (row) => {
    const updated = {
      name: row.name,
      price: row.price,
      categoryId: row.categoryId,
    };

    try {
      const res = await fetch(`${API_URL}/products/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update product");
      }

      const updatedProduct = await res.json();
      console.log("Updated product:", updatedProduct);

      const newData = [...products];
      const index = newData.findIndex((item) => item.id === row.id);
      newData.splice(index, 1, updatedProduct);
      setProducts(newData);

      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Error updating product: " + err.message);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      editable: true,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "category",
      editable: true,
      filters: Array.from(new Set(products.map((p) => p.category?.name)))
        .filter(Boolean)
        .map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.category?.name === value,
      render: (_, record) => record.category?.name || "—",
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) =>
        products.length >= 1 ? (
          <Popconfirm
            title="Delete product?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "price" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable,
        handleSave,
        categories,
      }),
    };
  });

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleAdd} type="primary">
          Add Product
        </Button>
      </Space>
      <Title level={3}>Product List</Title>

      <Table
        rowKey="id"
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 10 }}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        bordered
        columns={mergedColumns}
      />
    </div>
  );
};

const extractUniqueCategories = (products) => {
  const map = new Map();
  for (const p of products) {
    if (p.category?.id && p.category.name) {
      map.set(p.category.id, p.category.name);
    }
  }
  return Array.from(map.entries()).map(([id, name]) => ({
    label: name,
    value: id,
  }));
};
