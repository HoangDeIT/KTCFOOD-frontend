import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    Select,
    Switch,
    message,
    Tag
} from "antd";
import { useEffect, useState } from "react";

import { getMaterials } from "@/api/materialApi";
import { getPackagingsDropdown } from "@/api/packagingImportApi";
import { getBOMs, updateBOMs } from "@/api/Production/productionBOMApi";
import { getProductsDropdown } from "@/api/Production/productionApi";

export default function ProductionBOMPage() {

    const [productId, setProductId] = useState<number | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [packagings, setPackagings] = useState<any[]>([]);

    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const isMaterial = Form.useWatch("isMaterial", form);
    // ================= FETCH =================

    const fetchData = async () => {
        if (!productId) return;

        const res = await getBOMs({ productId });
        setData(res.items);
    };

    const fetchDropdown = async () => {
        const [p, m, pk] = await Promise.all([
            getProductsDropdown(),
            getMaterials({ pageIndex: 1, pageSize: 1000 }),
            getPackagingsDropdown()
        ]);

        setProducts(p.items);
        setMaterials(m.items);
        setPackagings(pk.items);
    };

    useEffect(() => {
        fetchDropdown();
    }, []);

    useEffect(() => {
        fetchData();
    }, [productId]);

    // ================= CREATE / UPDATE =================

    const handleSubmit = async () => {
        const values = await form.validateFields();

        const payload = [
            {
                isMaterial: values.isMaterial,
                originId: values.originId,
                quantityPerUnit: values.quantityPerUnit
            }
        ];

        try {
            await updateBOMs(productId!, payload);
            message.success("BOM updated UwU ✨");
            setOpen(false);
            form.resetFields();
            fetchData();
        } catch {
            message.error("Update failed 😢");
        }
    };

    // ================= COLUMNS =================

    const columns = [
        { title: "ID", dataIndex: "id" },

        {
            title: "Type",
            render: (_: any, r: any) =>
                r.isMaterial
                    ? <Tag color="blue">Material</Tag>
                    : <Tag color="purple">Packaging</Tag>
        },

        {
            title: "Name",
            render: (_: any, r: any) => {
                if (r.isMaterial) {
                    return materials.find(m => m.id === r.materialId)?.name;
                }
                return packagings.find(p => p.id === r.packagingMaterialId)?.packageName;
            }
        },

        {
            title: "Quantity / Unit",
            dataIndex: "quantityPerUnit"
        }
    ];

    return (
        <div>
            {/* PRODUCT SELECT */}
            <Select
                placeholder="Select product..."
                style={{ width: 300, marginBottom: 16 }}
                onChange={setProductId}
                options={products.map(p => ({
                    label: `${p.productName} (${p.productCode})`,
                    value: p.id
                }))}
            />

            <Button
                type="primary"
                onClick={() => setOpen(true)}
                disabled={!productId}
                style={{ float: "right" }}
            >
                Add BOM
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
            />

            {/* MODAL */}
            <Modal
                title="Add BOM"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                onOk={handleSubmit}
            >

                <Form form={form} layout="vertical">

                    <Form.Item
                        name="isMaterial"
                        label="Type"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch
                            checkedChildren="Material"
                            unCheckedChildren="Packaging"
                            onChange={() =>
                                form.setFieldsValue({
                                    originId: null,
                                    quantityPerUnit: null
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="originId"
                        label="Select Item"
                        rules={[{ required: true }]}
                    >
                        <Select
                            disabled={isMaterial === undefined}
                            options={
                                isMaterial
                                    ? materials.map(m => ({
                                        label: m.name,
                                        value: m.id
                                    }))
                                    : packagings.map(p => ({
                                        label: p.packageName,
                                        value: p.id
                                    }))
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="quantityPerUnit"
                        label="Quantity"
                        rules={[{ required: true }, { type: "number", min: 0.0001 }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}