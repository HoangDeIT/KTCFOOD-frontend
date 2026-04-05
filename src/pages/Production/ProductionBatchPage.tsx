import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    Select,
    Tag,
    Space,
    message
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import {
    getProductionBatches,
    createBatch,
    startBatch,
    cancelBatch,
    completeBatch
} from "@/api/Production/productionBatchApi";

import { getProductionPlans } from "@/api/Production/productionApi";
import { useNavigate } from "react-router-dom";
export default function ProductionBatchPage() {

    const [data, setData] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const BatchStatus = {
        Planned: 0,
        InProgress: 1,
        Finished: 2,
        Canceled: 3
    };
    const getStatusColor = (status: number) => {
        if (status === BatchStatus.Finished) return "green";
        if (status === BatchStatus.InProgress) return "blue";
        if (status === BatchStatus.Canceled) return "red";
        return "default";
    };

    const getStatusText = (status: number) => {
        return ["Planned", "InProgress", "Finished", "Canceled"][status];
    };
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // ================= FETCH =================

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const res = await getProductionBatches({ pageIndex: page, pageSize });
            const d = res;

            setData(d.items);
            setPagination({
                current: d.pageIndex,
                pageSize: d.pageSize,
                total: d.totalCount
            });

        } catch {
            message.error("Load batches failed 😢");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        const res = await getProductionPlans({ pageIndex: 1, pageSize: 1000 });
        setPlans(res.items);
    };

    useEffect(() => {
        fetchData();
        fetchPlans();
    }, []);

    // ================= ACTION =================

    const handleCreate = async () => {
        const values = await form.validateFields();

        try {
            const res = await createBatch(values.planId, values.plannedQuantity);
            message.success("Batch created UwU ✨");
            console.log(res);
            setOpen(false);
            form.resetFields();
            fetchData();
        } catch {
            message.error("Create batch failed 😢");
        }
    };

    const handleStart = async (id: number) => {
        await startBatch(id);
        message.success("Started 🚀");
        fetchData();
    };

    const handleCancel = async (id: number) => {
        await cancelBatch(id, "Manual cancel");
        message.success("Canceled ❌");
        fetchData();
    };

    const handleComplete = async (id: number) => {
        await completeBatch(id);
        message.success("Completed ✅");
        fetchData();
    };

    // ================= COLUMNS =================

    const columns = [
        { title: "ID", dataIndex: "id" },

        {
            title: "Plan",
            dataIndex: "productionPlanId"
        },

        {
            title: "Quantity",
            render: (_: any, r: any) =>
                `${r.actualQuantity}/${r.plannedQuantity}`
        },

        {
            title: "Shift",
            dataIndex: "shift"
        },

        {
            title: "Date",
            render: (_: any, r: any) =>
                dayjs(r.productionDate).format("DD/MM/YYYY")
        },

        {
            title: "Status",
            render: (_: any, r: any) => (
                <Tag color={getStatusColor(r.status)}>
                    {getStatusText(r.status)}
                </Tag>
            )
        },

        {
            title: "Action",
            render: (_: any, r: any) => (
                <Space>

                    {/* 👀 VIEW DETAIL */}
                    <Button
                        onClick={() => navigate(`/production/batches/${r.id}`)}
                    >
                        View
                    </Button>

                    {r.status === BatchStatus.Planned && (
                        <Button onClick={() => handleStart(r.id)}>
                            Start
                        </Button>
                    )}

                    {r.status === BatchStatus.InProgress && (
                        <>
                            <Button onClick={() => handleComplete(r.id)}>
                                Complete
                            </Button>
                            <Button danger onClick={() => handleCancel(r.id)}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => setOpen(true)}
                style={{ float: "right", marginBottom: 16 }}
            >
                Create Batch
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                onChange={(p) =>
                    fetchData(p.current, p.pageSize)
                }
            />

            {/* MODAL CREATE */}
            <Modal
                title="Create Batch"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                onOk={handleCreate}
            >
                <Form form={form} layout="vertical">

                    <Form.Item
                        name="planId"
                        label="Production Plan"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            options={plans.map(p => ({
                                label: `Plan #${p.id} (${p.shift})`,
                                value: p.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="plannedQuantity"
                        label="Quantity"
                        rules={[{ required: true }, { type: "number", min: 1 }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}