import {
    Table,
    Button,
    Modal,
    Form,
    Select,
    message
} from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";

import {
    getMaterialExports,
    createMaterialExports,
    getProductsDropdown
} from "@/api/materialExportApi";

import { getBatchesDropdown } from "@/api/materialImportApi";

export default function MaterialExportPage() {

    const [data, setData] = useState<IMaterialExport[]>([]);
    const [open, setOpen] = useState(false);

    const [products, setProducts] = useState<IProduct[]>([]);
    const [batches, setBatches] = useState<IProductionBatch[]>([]);

    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        const res = await getMaterialExports({
            pageIndex: page,
            pageSize
        });

        setData(res.items);
        setPagination({
            current: res.pageIndex,
            pageSize: res.pageSize,
            total: res.totalCount
        });
    };

    const fetchDropdown = async () => {
        const [p, b] = await Promise.all([
            getProductsDropdown(),
            getBatchesDropdown()
        ]);

        setProducts(p.items);
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

        await createMaterialExports(values.batchId, values.productId);

        message.success("Export created UwU ✨");

        setOpen(false);
        form.resetFields();
        fetchData(pagination.current, pagination.pageSize);
    };

    const columns: ColumnsType<IMaterialExport> = [
        { title: "ID", dataIndex: "id" },
        { title: "Material ID", dataIndex: "materialId" },
        { title: "Batch", dataIndex: "productionBatchId" },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Date", dataIndex: "exportDate" }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => setOpen(true)}
                style={{ marginBottom: 16, float: "right" }}
            >
                Create Export
            </Button>

            <Table<IMaterialExport>
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={pagination}
                onChange={(pag) =>
                    fetchData(pag.current!, pag.pageSize!)
                }
            />

            <Modal
                title="Create Material Export"
                open={open}
                onCancel={() => setOpen(false)}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">

                    {/* PRODUCT */}
                    <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            options={products.map(p => ({
                                label: p.productName,
                                value: p.id
                            }))}
                        />
                    </Form.Item>

                    {/* BATCH */}
                    <Form.Item name="batchId" label="Batch" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            options={batches.map(b => ({
                                label: `Batch #${b.id}`,
                                value: b.id
                            }))}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}