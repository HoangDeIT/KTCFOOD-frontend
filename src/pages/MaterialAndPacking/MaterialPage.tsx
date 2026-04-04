import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    message
} from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";

import {
    getMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial
} from "@/api/materialApi";

export default function MaterialPage() {
    const [data, setData] = useState<IMaterial[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<IMaterial | null>(null);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        try {
            const res = await getMaterials({ pageIndex: page, pageSize });

            setData(res.items);
            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });
        } catch (err) {
            message.error("Fetch materials failed 😢");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteMaterial(id);
        message.success("Deleted 😈");
        fetchData(pagination.current, pagination.pageSize);
    };

    const handleOpenAdd = () => {
        setEditing(null);
        form.resetFields();
        setOpen(true);
    };

    const handleOpenEdit = (record: IMaterial) => {
        setEditing(record);
        form.setFieldsValue(record);
        setOpen(true);
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();

        if (editing) {
            await updateMaterial(editing.id, values);
            message.success("Updated UwU ✨");
        } else {
            await addMaterial(values);
            message.success("Created UwU ✨");
        }

        setOpen(false);
        fetchData(pagination.current, pagination.pageSize);
    };

    const columns: ColumnsType<IMaterial> = [
        { title: "ID", dataIndex: "id" },
        { title: "Name", dataIndex: "name" },
        { title: "Unit", dataIndex: "unit" },
        { title: "Type", dataIndex: "type" },
        { title: "Note", dataIndex: "note" },
        {
            title: "Action",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleOpenEdit(record)}>
                        Edit
                    </Button>

                    <Button
                        danger
                        onClick={() => handleDelete(record.id)}
                        style={{ marginLeft: 8 }}
                    >
                        Delete
                    </Button>
                </>
            )
        }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={handleOpenAdd}
                style={{ marginBottom: 16, float: "right" }}
            >
                Add Material
            </Button>

            <Table<IMaterial>
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={pagination}
                onChange={(pag) =>
                    fetchData(pag.current!, pag.pageSize!)
                }
            />

            <Modal
                title={editing ? "Update Material" : "Add Material"}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="type" label="Type">
                        <Input />
                    </Form.Item>

                    <Form.Item name="note" label="Note">
                        <Input />
                    </Form.Item>

                    <Form.Item name="avgPrice" label="Avg Price">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}