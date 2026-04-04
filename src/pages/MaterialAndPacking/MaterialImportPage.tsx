import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    message
} from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";

import {
    getMaterialImports,
    addMaterialImports
} from "@/api/materialImportApi";

import { useDropdownData } from "@/hooks/DropDownData";
import { MaterialImportReason } from "@/types/enum";

export default function MaterialImportPage() {

    const [open, setOpen] = useState(false);

    const { materials, suppliers, batches } = useDropdownData(open);

    const [data, setData] = useState<IMaterialImport[]>([]);
    const [form] = Form.useForm();

    const [reason, setReason] = useState<MaterialImportReason>(
        MaterialImportReason.Purchased
    );

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        try {
            const res = await getMaterialImports({
                pageIndex: page,
                pageSize
            });

            setData(res.items);
            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });
        } catch {
            message.error("Fetch import failed 😢");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        const values = await form.validateFields();

        const payload = [
            {
                materialId: values.materialId,
                quantity: values.quantity,
                importCost: values.importCost,
                importDate: values.importDate.format("YYYY-MM-DD"),
                status: values.status
            }
        ];

        await addMaterialImports(payload, reason, values.originId);

        message.success("Import created UwU ✨");

        setOpen(false);
        form.resetFields();
        fetchData(pagination.current, pagination.pageSize);
    };

    const columns: ColumnsType<IMaterialImport> = [
        { title: "ID", dataIndex: "id" },
        {
            title: "Material",
            render: (_, r) =>
                materials.find(m => m.id === r.materialId)?.name || r.materialId
        },
        {
            title: "Reason",
            render: (_, r) => ["Purchased", "BatchCanceled", "Adjustment"][r.importReason]
        },
        {
            title: "Supplier",
            render: (_, r) =>
                suppliers.find(s => s.id === r.supplierId)?.name || "-"
        },
        {
            title: "Batch",
            render: (_, r) => r.productionBatchId ? `#${r.productionBatchId}` : "-"
        },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Cost", dataIndex: "importCost" },
        { title: "Date", dataIndex: "importDate" },
        { title: "Status", dataIndex: "status" }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => setOpen(true)}
                style={{ marginBottom: 16, float: "right" }}
            >
                Add Import
            </Button>

            <Table<IMaterialImport>
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={pagination}
                onChange={(pag) =>
                    fetchData(pag.current!, pag.pageSize!)
                }
            />

            <Modal
                title="Create Material Import"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">

                    {/* 🌟 MATERIAL DROPDOWN */}
                    <Form.Item name="materialId" label="Material" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder="Select material"
                            options={materials.map(m => ({
                                label: `${m.name} (${m.unit})`,
                                value: m.id
                            }))}
                        />
                    </Form.Item>

                    {/* 🌟 REASON */}
                    <Form.Item label="Import Reason">
                        <Select
                            value={reason}
                            onChange={(v) => setReason(v)}
                            options={[
                                { label: "Purchased", value: 0 },
                                { label: "BatchCanceled", value: 1 },
                                { label: "Adjustment", value: 2 }
                            ]}
                        />
                    </Form.Item>

                    {/* 🌟 SUPPLIER */}
                    {reason === 0 && (
                        <Form.Item name="originId" label="Supplier" rules={[{ required: true }]}>
                            <Select
                                showSearch
                                placeholder="Select supplier"
                                options={suppliers.map(s => ({
                                    label: `${s.name}`,
                                    value: s.id
                                }))}
                            />
                        </Form.Item>
                    )}

                    {/* 🌟 BATCH */}
                    {reason === 1 && (
                        <Form.Item name="originId" label="Batch" rules={[{ required: true }]}>
                            <Select
                                showSearch
                                placeholder="Select batch"
                                options={batches.map(b => ({
                                    label: `Batch #${b.id}`,
                                    value: b.id
                                }))}
                            />
                        </Form.Item>
                    )}

                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="importCost" label="Import Cost" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="importDate" label="Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="status" label="Status">
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}