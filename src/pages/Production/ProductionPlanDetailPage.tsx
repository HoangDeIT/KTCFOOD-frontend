import {
    Card,
    Descriptions,
    Button,
    Form,
    InputNumber,
    DatePicker,
    Select,
    message,
    Space,
    Tag
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
    getProductionPlanById,
    updateProductionPlan,
    getPlanRemaining,
    checkPlanFinished,
    checkBOMSatisfied
} from "@/api/Production/productionApi";
import { getProductsDropdown } from "@/api/Production/productionApi";



export default function ProductionPlanDetailPage() {

    const { id } = useParams();
    const planId = Number(id);

    const [data, setData] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);

    const [remaining, setRemaining] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState<boolean | null>(null);
    const [bomOk, setBomOk] = useState<boolean | null>(null);

    const [editing, setEditing] = useState(false);

    const [form] = Form.useForm();

    // ================= FETCH =================

    const fetchAll = async () => {
        try {
            const [planRes, remainRes, finishedRes, bomRes] =
                await Promise.all([
                    getProductionPlanById(planId),
                    getPlanRemaining(planId),
                    checkPlanFinished(planId),
                    checkBOMSatisfied(planId)
                ]);

            setData(planRes);
            setRemaining(remainRes);
            setIsFinished(finishedRes);
            setBomOk(bomRes);

            form.setFieldsValue({
                ...planRes,
                startDate: dayjs(planRes.startDate),
                endDate: dayjs(planRes.endDate)
            });

        } catch {
            message.error("Load detail failed 😢");
        }
    };

    const fetchProducts = async () => {
        const res = await getProductsDropdown();
        setProducts(res.items);
    };

    useEffect(() => {
        fetchAll();
        fetchProducts();
    }, [id]);

    // ================= UPDATE =================

    const handleUpdate = async () => {
        const values = await form.validateFields();

        const payload = {
            ...values,
            startDate: values.startDate.format("YYYY-MM-DD"),
            endDate: values.endDate.format("YYYY-MM-DD")
        };

        try {
            await updateProductionPlan(planId, payload);
            message.success("Updated UwU ✨");
            setEditing(false);
            fetchAll();
        } catch {
            message.error("Update failed 😢");
        }
    };

    if (!data) return null;

    const isDraft = data.status === "Drafted";

    return (
        <Card
            title={`Production Plan #${data.id}`}
            extra={
                <Space>
                    {isDraft && (
                        <Button onClick={() => setEditing(!editing)}>
                            {editing ? "Cancel" : "Edit"}
                        </Button>
                    )}

                    {editing && (
                        <Button type="primary" onClick={handleUpdate}>
                            Save
                        </Button>
                    )}
                </Space>
            }
        >
            {/* ===== STATUS ===== */}
            <Space style={{ marginBottom: 16 }}>
                <Tag color="blue">Remaining: {remaining}</Tag>
                <Tag color={isFinished ? "green" : "red"}>
                    {isFinished ? "Finished" : "Not Finished"}
                </Tag>
                <Tag color={bomOk ? "green" : "red"}>
                    {bomOk ? "BOM OK" : "BOM Missing"}
                </Tag>
            </Space>

            {/* ===== FORM ===== */}
            <Form form={form} layout="vertical" disabled={!editing}>

                <Form.Item
                    name="productId"
                    label="Product"
                    rules={[{ required: true }]}
                >
                    <Select
                        showSearch
                        options={products.map(p => ({
                            label: `${p.productName} (${p.productCode})`,
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

            {/* ===== READ ONLY INFO ===== */}
            {!editing && (
                <Descriptions column={2} style={{ marginTop: 20 }}>
                    <Descriptions.Item label="Status">
                        <Tag>{data.status}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Product ID">
                        {data.productId}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Card>
    );
}