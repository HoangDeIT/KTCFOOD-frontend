// pages/Sales/SalesOrderPage.tsx

import {
    Table,
    Button,
    Space,
    Tag,
    Input,
    Select,
    message,
    Popconfirm
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import {
    getSalesOrders,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder
} from "@/api/Sales/salesOrderApi";


import { useNavigate } from "react-router-dom";
import SalesOrderFormModal from "@/components/sales/SalesOrderFormModal";
import { getCustomers } from "@/api/Sales/customerApi";

export default function SalesOrderPage() {

    const [data, setData] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [filters, setFilters] = useState({
        search: "",
        status: undefined as string | undefined
    });

    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // ================= FETCH =================

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const res = await getSalesOrders({
                pageIndex: page,
                pageSize
            });

            let items = res.items;

            // client filter (có thể move lên backend sau)
            if (filters.search) {
                items = items.filter(i =>
                    i.id.toString().includes(filters.search)
                );
            }

            if (filters.status) {
                items = items.filter(i => i.status === filters.status);
            }

            setData(items);

            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });

        } catch {
            message.error("Load orders failed 😢");
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        const res = await getCustomers({ pageIndex: 1, pageSize: 1000 });
        setCustomers(res.items);
    };

    useEffect(() => {
        fetchData();
        fetchCustomers();
    }, [filters]);

    // ================= ACTION =================

    const handleSubmit = async (values: any) => {
        setModalLoading(true);

        const payload = {
            ...values,
            orderDate: values.orderDate.format("YYYY-MM-DD"),
            deliveryDate: values.deliveryDate.format("YYYY-MM-DD")
        };

        try {
            if (editing) {
                await updateSalesOrder(editing.id, payload);
                message.success("Updated ✨");
            } else {
                await createSalesOrder(payload);
                message.success("Created UwU ✨");
            }

            setOpen(false);
            setEditing(null);
            fetchData();

        } catch {
            message.error("Save failed 😢");
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        await deleteSalesOrder(id);
        message.success("Deleted ❌");
        fetchData();
    };

    // ================= UI =================

    const columns = [
        { title: "ID", dataIndex: "id" },

        {
            title: "Customer",
            dataIndex: "customerId"
        },

        {
            title: "Order Date",
            render: (_: any, r: any) =>
                dayjs(r.orderDate).format("DD/MM/YYYY")
        },

        {
            title: "Delivery Date",
            render: (_: any, r: any) =>
                dayjs(r.deliveryDate).format("DD/MM/YYYY")
        },

        {
            title: "Status",
            render: (_: any, r: any) => {
                const color =
                    r.status === "Completed" ? "green" :
                        r.status === "Pending" ? "orange" :
                            r.status === "Canceled" ? "red" :
                                "blue";

                return <Tag color={color}>{r.status}</Tag>;
            }
        },

        {
            title: "Action",
            render: (_: any, r: any) => (
                <Space>

                    {/* 👀 VIEW (chỉ xem info) */}
                    <Button
                        onClick={() => navigate(`/sales/orders/${r.id}`)}
                    >
                        View
                    </Button>

                    {/* 📦 DETAIL (order items) */}

                    {/* fix later 
                    <Button
                        type="primary"
                        onClick={() => navigate(`/sales/orders/${r.id}/details`)}
                    >
                        Detail
                    </Button> */}

                    {/* ✏️ EDIT */}
                    <Button onClick={() => {
                        setEditing(r);
                        setOpen(true);
                    }}>
                        Edit
                    </Button>

                    {/* ❌ DELETE */}
                    <Popconfirm
                        title="Delete this order?"
                        onConfirm={() => handleDelete(r.id)}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>

                </Space>
            )
        }
    ];

    return (
        <div>

            {/* FILTER BAR */}
            <Space style={{ marginBottom: 16 }}>

                <Input
                    placeholder="Search ID..."
                    onChange={(e) =>
                        setFilters(f => ({ ...f, search: e.target.value }))
                    }
                />

                <Select
                    placeholder="Status"
                    allowClear
                    style={{ width: 160 }}
                    onChange={(v) =>
                        setFilters(f => ({ ...f, status: v }))
                    }
                    options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Completed", value: "Completed" },
                        { label: "Canceled", value: "Canceled" }
                    ]}
                />

                <Button
                    type="primary"
                    onClick={() => {
                        setEditing(null);
                        setOpen(true);
                    }}
                >
                    Create Order
                </Button>

            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                onChange={(p) => fetchData(p.current, p.pageSize)}
            />

            <SalesOrderFormModal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setEditing(null);
                }}
                onSubmit={handleSubmit}
                customers={customers}
                initialValues={editing}
                loading={modalLoading}
            />

        </div>
    );
}