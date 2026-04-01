import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    message,
    Tag
} from "antd";
import { useEffect, useState } from "react";
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductInventoryCount
} from "@/api/inventoryApi";
import type { ColumnsType } from "antd/es/table";

export default function ProductsPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [form] = Form.useForm<IProductRequest>();
    const [stockModal, setStockModal] = useState(false);
    const [stockValue, setStockValue] = useState<number | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const fetchProducts = async (page = 1, pageSize = 10) => {
        const res = await getProducts({ pageIndex: page, pageSize });

        setProducts(res.items);
        setPagination({
            current: res.pageIndex,
            pageSize: res.pageSize,
            total: res.totalCount
        });
    };
    const handleViewStock = async (productId: number) => {
        try {
            const res = await getProductInventoryCount(productId);
            setStockValue(res);
            setStockModal(true);
        } catch {
            message.error("Failed to get stock 😢");
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async () => {
        const values = await form.validateFields();

        if (editingProduct) {
            await updateProduct(editingProduct.id, values);
            message.success("Updated UwU ✨");
        } else {
            await addProduct(values);
            message.success("Added UwU ✨");
        }

        setOpen(false);
        form.resetFields();
        fetchProducts();
    };

    const handleDelete = async (id: number) => {
        await deleteProduct(id);
        message.success("Deleted 😈");
        fetchProducts();
    };

    const handleOpenAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setOpen(true);
    };

    const handleOpenEdit = (product: IProduct) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        setOpen(true);
    };
    const columns: ColumnsType<IProduct> = [
        { title: "Name", dataIndex: "productName" },
        { title: "Code", dataIndex: "productCode" },
        { title: "Unit", dataIndex: "unit" },
        { title: "Price", dataIndex: "standardPrice" },
        {
            title: "Stock",
            render: (_, record) => (
                <Button onClick={() => handleViewStock(record.id)}>
                    {stockValue === 0 && <Tag color="red">Out of stock</Tag>}
                </Button>
            )
        },
        {
            title: "Action",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleOpenEdit(record)}>
                        Edit
                    </Button>

                    <Button
                        danger
                        onClick={() => handleDelete(record.id)}
                        style={{ marginLeft: 8 }}
                    >
                        Delete
                    </Button>

                    <Button
                        type="dashed"
                        onClick={() => handleViewStock(record.id)}
                        style={{ marginLeft: 8 }}
                    >
                        View Stock
                    </Button>
                </>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" onClick={handleOpenAdd}>
                    Add Product
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={products}
                pagination={pagination}
                onChange={(pag) => {
                    fetchProducts(pag.current!, pag.pageSize!);
                }}
            />
            <Modal
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="productName" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="productCode" label="Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="unit" label="Unit">
                        <Input />
                    </Form.Item>

                    <Form.Item name="standardPrice" label="Price">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Total Inventory"
                open={stockModal}
                onCancel={() => setStockModal(false)}
                footer={null}
            >
                <h2 style={{ textAlign: "center" }}>
                    {stockValue ?? 0} units 📦
                </h2>
            </Modal>
        </div>
    );
}