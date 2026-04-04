import {
    Card,
    Descriptions,
    Button,
    Space,
    Tag,
    Modal,
    Form,
    InputNumber,
    message
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
    getBatchById,
    startBatch,
    cancelBatch,
    completeBatch
} from "@/api/Production/productionBatchApi";

export default function ProductionBatchDetailPage() {

    const { id } = useParams();
    const batchId = Number(id);
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [openComplete, setOpenComplete] = useState(false);
    const [form] = Form.useForm();

    // ================= FETCH =================

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getBatchById(batchId);
            setData(res);
        } catch {
            message.error("Load batch failed 😢");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // ================= ACTION =================

    const handleStart = async () => {
        try {
            await startBatch(batchId);
            message.success("Started 🚀");
            fetchData();
        } catch {
            message.error("Start failed (maybe BOM not enough 😢)");
        }
    };

    const handleCancel = async () => {
        try {
            await cancelBatch(batchId, "Manual cancel");
            message.success("Canceled ❌");
            fetchData();
        } catch {
            message.error("Cancel failed 😢");
        }
    };

    const handleComplete = async () => {
        const values = await form.validateFields();

        try {
            await completeBatch(batchId, values.actualQuantity);
            message.success("Completed ✅");
            setOpenComplete(false);
            form.resetFields();
            fetchData();
        } catch {
            message.error("Complete failed 😢");
        }
    };

    if (!data) return null;

    // ================= STATUS COLOR =================

    const getColor = () => {
        if (data.status === "Finished") return "green";
        if (data.status === "InProgress") return "blue";
        if (data.status === "Canceled") return "red";
        return "default";
    };

    return (
        <Card
            title={`🏭 Batch #${data.id}`}
            extra={
                <Tag color={getColor()}>
                    {data.status}
                </Tag>
            }
            loading={loading}
        >
            {/* ===== INFO ===== */}
            <Button
                onClick={() => navigate(`/production/batches/${batchId}/labor`)}
            >
                👷 Labor
            </Button>
            <Descriptions column={2}>
                <Descriptions.Item label="Plan">
                    #{data.productionPlanId}
                </Descriptions.Item>

                <Descriptions.Item label="Product">
                    {data.productId}
                </Descriptions.Item>

                <Descriptions.Item label="Shift">
                    {data.shift}
                </Descriptions.Item>

                <Descriptions.Item label="Date">
                    {dayjs(data.productionDate).format("DD/MM/YYYY")}
                </Descriptions.Item>

                <Descriptions.Item label="Planned Quantity">
                    {data.plannedQuantity}
                </Descriptions.Item>

                <Descriptions.Item label="Actual Quantity">
                    {data.actualQuantity}
                </Descriptions.Item>
            </Descriptions>

            {/* ===== ACTION ===== */}
            <Space style={{ marginTop: 20 }}>

                {data.status === "Planned" && (
                    <Button type="primary" onClick={handleStart}>
                        🚀 Start
                    </Button>
                )}

                {data.status === "InProgress" && (
                    <>
                        <Button
                            type="primary"
                            onClick={() => setOpenComplete(true)}
                        >
                            ✅ Complete
                        </Button>

                        <Button danger onClick={handleCancel}>
                            ❌ Cancel
                        </Button>
                    </>
                )}
            </Space>

            {/* ===== COMPLETE MODAL ===== */}
            <Modal
                title="Complete Batch"
                open={openComplete}
                onCancel={() => setOpenComplete(false)}
                onOk={handleComplete}
            >
                <Form form={form} layout="vertical">

                    <Form.Item
                        name="actualQuantity"
                        label="Actual Quantity"
                        rules={[
                            { required: true },
                            { type: "number", min: 1 }
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                </Form>
            </Modal>
        </Card>
    );
}