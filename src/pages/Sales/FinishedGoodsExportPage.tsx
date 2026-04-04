import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    Select,
    DatePicker,
    Space,
    message,
    Popconfirm
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import {
    getExports,
    createExport,
    deleteExport
} from "@/api/Sales/exportApi";

import { getSalesOrders } from "@/api/Sales/salesOrderApi";
import { getProducts } from "@/api/inventoryApi";

export default function FinishedGoodsExportPage() {

    const [data, setData] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // ================= FETCH =================

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const res = await getExports({ pageIndex: page, pageSize });

            setData(res.items);
            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });

        } catch {
            message.error("Load exports failed 😢");
        } finally {
            setLoading(false);
        }
    };

    const fetchRefs = async () => {
        const [o, p] = await Promise.all([
            getSalesOrders({ pageIndex: 1, pageSize: 1000 }),
            getProducts({ pageIndex: 1, pageSize: 1000 })
        ]);

        setOrders(o.items);
        setProducts(p.items);
    };

    useEffect(() => {
        fetchData();
        fetchRefs();
    }, []);

    // ================= ACTION =================

    const handleCreate = async () => {
        const values = await form.validateFields();

        try {
            const res = await createExport({
                ...values,
                exportDate: values.exportDate.format("YYYY-MM-DD")
            });
            console.log(res);
            message.success("Export created 🚀");
            setOpen(false);
            form.resetFields();
            fetchData();

        } catch {
            message.error("Create export failed 😢");
        }
    };

    const handleDelete = async (id: number) => {
        await deleteExport(id);
        message.success("Deleted ❌");
        fetchData();
    };

    // ================= TABLE =================

    const columns = [
        { title: "ID", dataIndex: "id" },

        {
            title: "Order",
            dataIndex: "salesOrderId"
        },

        {
            title: "Product",
            dataIndex: "productId"
        },

        {
            title: "Quantity",
            dataIndex: "quantity"
        },

        {
            title: "Date",
            render: (_: any, r: any) =>
                dayjs(r.exportDate).format("DD/MM/YYYY")
        },

        {
            title: "Action",
            render: (_: any, r: any) => (
                <Popconfirm
                    title="Delete export?"
                    onConfirm={() => handleDelete(r.id)}
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div>

            <Button
                type="primary"
                onClick={() => setOpen(true)}
                style={{ marginBottom: 16 }}
            >
                Create Export
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                onChange={(p) => fetchData(p.current, p.pageSize)}
            />

            {/* MODAL */}
            <Modal
                title="Create Export"
                open={open}
                onCancel={() => setOpen(false)}
                onOk={handleCreate}
            >
                <Form form={form} layout="vertical">

                    <Form.Item name="salesOrderId" label="Order" rules={[{ required: true }]}>
                        <Select
                            options={orders.map(o => ({
                                label: `Order #${o.id}`,
                                value: o.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
                        <Select
                            options={products.map(p => ({
                                label: p.productName,
                                value: p.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} min={1} />
                    </Form.Item>

                    <Form.Item name="exportDate" label="Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                </Form>
            </Modal>

        </div>
    );
}