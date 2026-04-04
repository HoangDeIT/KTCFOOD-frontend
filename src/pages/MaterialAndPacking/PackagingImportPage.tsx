import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    DatePicker,
    Select,
    message
} from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";

import {
    getPackagingImports,
    addPackagingImports,
    getPackagingsDropdown
} from "@/api/packagingImportApi";

import { getBatchesDropdown, getSuppliersDropdown } from "@/api/materialImportApi";

export default function PackagingImportPage() {

    const [open, setOpen] = useState(false);

    const [packagings, setPackagings] = useState<IPackaging[]>([]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [batches, setBatches] = useState<IProductionBatch[]>([]);

    const [data, setData] = useState<IPackagingImport[]>([]);
    const [form] = Form.useForm();

    const [reason, setReason] = useState<number>(0);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        try {
            const res = await getPackagingImports({
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
            message.error("Fetch packaging import failed 😢");
        }
    };

    const fetchDropdown = async () => {
        const [p, s, b] = await Promise.all([
            getPackagingsDropdown(),
            getSuppliersDropdown(),
            getBatchesDropdown()
        ]);

        setPackagings(p.items);
        setSuppliers(s.items);
        setBatches(b.items);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (open) fetchDropdown();
    }, [open]);

    const handleSubmit = async () => {
        const values = await form.validateFields();

        const payload: IPackagingImportRequest[] = [
            {
                packagingMaterialId: values.packagingMaterialId,
                quantity: values.quantity,
                importDate: values.importDate.format("YYYY-MM-DD")
            }
        ];

        try {
            await addPackagingImports(payload, reason, values.originId);

            message.success("Packaging import created UwU ✨");

            setOpen(false);
            form.resetFields();
            fetchData(pagination.current, pagination.pageSize);

        } catch {
            message.error("Create failed 😢");
        }
    };

    const columns: ColumnsType<IPackagingImport> = [
        { title: "ID", dataIndex: "id" },

        {
            title: "Packaging",
            render: (_, r) =>
                packagings.find(p => p.id === r.packagingMaterialId)?.packageName
                || r.packagingMaterialId
        },

        {
            title: "Reason",
            render: (_, r) =>
                ["Purchased", "BatchCanceled", "Adjustment"][r.importReason]
        },

        {
            title: "Supplier",
            render: (_, r) =>
                suppliers.find(s => s.id === r.supplierId)?.name || "-"
        },

        {
            title: "Batch",
            render: (_, r) =>
                r.productionBatchId ? `#${r.productionBatchId}` : "-"
        },

        { title: "Quantity", dataIndex: "quantity" },
        { title: "Date", dataIndex: "importDate" }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => setOpen(true)}
                style={{ marginBottom: 16, float: "right" }}
            >
                Add Packaging Import
            </Button>

            <Table<IPackagingImport>
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={pagination}
                onChange={(pag) =>
                    fetchData(pag.current!, pag.pageSize!)
                }
            />

            <Modal
                title="Create Packaging Import"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">

                    <Form.Item
                        name="packagingMaterialId"
                        label="Packaging"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            options={packagings.map(p => ({
                                label: `${p.packageName} (${p.unit})`,
                                value: p.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Import Reason">
                        <Select
                            value={reason}
                            onChange={setReason}
                            options={[
                                { label: "Purchased", value: 0 },
                                { label: "BatchCanceled", value: 1 },
                                { label: "Adjustment", value: 2 }
                            ]}
                        />
                    </Form.Item>

                    {reason === 0 && (
                        <Form.Item
                            name="originId"
                            label="Supplier"
                            rules={[{ required: true }]}
                        >
                            <Select
                                showSearch
                                options={suppliers.map(s => ({
                                    label: s.name,
                                    value: s.id
                                }))}
                            />
                        </Form.Item>
                    )}

                    {reason === 1 && (
                        <Form.Item
                            name="originId"
                            label="Batch"
                            rules={[{ required: true }]}
                        >
                            <Select
                                showSearch
                                options={batches.map(b => ({
                                    label: `Batch #${b.id}`,
                                    value: b.id
                                }))}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="importDate"
                        label="Date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}