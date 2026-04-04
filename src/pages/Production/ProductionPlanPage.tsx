import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    DatePicker,
    Select,
    message,
    Tag,
    Space
} from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import {
    getProductionPlans,
    createProductionPlan,
    updateProductionPlan,
    deleteProductionPlan,
    getPlanRemaining,
    checkPlanFinished,
    getProductsDropdown
} from "@/api/Production/productionApi";
import { useNavigate } from "react-router-dom";

interface IProductionPlan {
    id: number;
    productId: number;
    plannedQuantity: number;
    shift: string;
    startDate: string;
    endDate: string;
    status: string;
}

export default function ProductionPlanPage() {

    const [data, setData] = useState<IProductionPlan[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<IProductionPlan | null>(null);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [products, setProducts] = useState<IProduct[]>([]);

    const fetchProducts = async () => {
        try {
            const res = await getProductsDropdown();
            setProducts(res.items);
        } catch {
            message.error("Load products failed 😢");
        }
    };
    // ================= FETCH =================
    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const res = await getProductionPlans({
                pageIndex: page,
                pageSize
            });

            const d = res;

            setData(d.items);
            setPagination({
                current: d.pageIndex,
                pageSize: d.pageSize,
                total: d.totalCount
            });

        } catch {
            message.error("Fetch plans failed 😢");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchProducts(); // thêm dòng này
    }, []);

    // ================= CRUD =================

    const handleSubmit = async () => {
        const values = await form.validateFields();

        const payload = {
            ...values,
            startDate: values.startDate.format("YYYY-MM-DD"),
            endDate: values.endDate.format("YYYY-MM-DD")
        };

        try {
            if (editing) {
                await updateProductionPlan(editing.id, payload);
                message.success("Updated successfully UwU ✨");
            } else {
                await createProductionPlan(payload);
                message.success("Created successfully UwU ✨");
            }

            setOpen(false);
            setEditing(null);
            form.resetFields();
            fetchData(pagination.current, pagination.pageSize);

        } catch {
            message.error("Save failed 😢");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteProductionPlan(id);
            message.success("Deleted UwU ✨");
            fetchData();
        } catch {
            message.error("Delete failed 😢");
        }
    };

    // ================= EXTRA =================

    const handleRemaining = async (id: number) => {
        const res = await getPlanRemaining(id);
        message.info(`Remaining: ${res}`);
    };

    const handleFinished = async (id: number) => {
        const res = await checkPlanFinished(id);
        message.info(res ? "Finished ✅" : "Not finished ❌");
    };

    // ================= COLUMNS =================

    const columns: ColumnsType<IProductionPlan> = [
        { title: "ID", dataIndex: "id" },

        {
            title: "Product",
            render: (_, r) =>
                products.find(p => p.id === r.productId)?.productName
                || `#${r.productId}`
        },

        { title: "Quantity", dataIndex: "plannedQuantity" },

        { title: "Shift", dataIndex: "shift" },

        {
            title: "Start",
            render: (_, r) => dayjs(r.startDate).format("DD/MM/YYYY")
        },

        {
            title: "End",
            render: (_, r) => dayjs(r.endDate).format("DD/MM/YYYY")
        },

        {
            title: "Status",
            render: (_, r) => {
                const color =
                    r.status === "Finished" ? "green" :
                        r.status === "InProgress" ? "blue" :
                            "default";

                return <Tag color={color}>{r.status}</Tag>;
            }
        },

        {
            title: "Action",
            render: (_, r) => (
                <Space>
                    <Button
                        onClick={() => navigate(`/production/plans/${r.id}`)}
                    >
                        View
                    </Button>

                    <Button
                        disabled={r.status !== "Drafted"}
                        onClick={() => {
                            setEditing(r);
                            setOpen(true);
                            form.setFieldsValue({
                                ...r,
                                startDate: dayjs(r.startDate),
                                endDate: dayjs(r.endDate)
                            });
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        danger
                        disabled={r.status !== "Drafted"}
                        onClick={() => handleDelete(r.id)}
                    >
                        Delete
                    </Button>

                    <Button onClick={() => handleRemaining(r.id)}>
                        Remaining
                    </Button>

                    <Button onClick={() => handleFinished(r.id)}>
                        Check
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                    setEditing(null);
                }}
                style={{ float: "right", marginBottom: 16 }}
            >
                Create Plan
            </Button>
            <Table<IProductionPlan>
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                onChange={(pag) =>
                    fetchData(pag.current!, pag.pageSize!)
                }
            />

            <Modal
                title={editing ? "Update Plan" : "Create Plan"}
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setEditing(null);
                    form.resetFields();
                }}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">

                    <Form.Item
                        name="productId"
                        label="Product"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select product..."
                            optionFilterProp="label"
                            options={products.map(p => ({
                                label: `${p.productName} (${p.productCode})`,
                                value: p.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="plannedQuantity"
                        label="Quantity"
                        rules={[
                            { required: true },
                            { type: "number", min: 1 }
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="shift"
                        label="Shift"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { label: "Morning", value: "Morning" },
                                { label: "Afternoon", value: "Afternoon" },
                                { label: "Night", value: "Night" }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}