import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message
} from "antd";
import { useEffect, useState } from "react";

import {
    getPackagings,
    addPackaging,
    updatePackaging,
    deletePackaging
} from "@/api/packagingApi";

export default function PackagingPage() {

    const [data, setData] = useState<IPackaging[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<IPackaging | null>(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        const res = await getPackagings({ pageIndex: 1, pageSize: 10 });
        setData(res.items);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        const values = await form.validateFields();

        if (editing) {
            await updatePackaging(editing.id, values);
        } else {
            await addPackaging(values);
        }

        message.success("Saved UwU ✨");
        setOpen(false);
        form.resetFields();
        fetchData();
    };

    return (
        <div>
            <Button onClick={() => setOpen(true)}
                type="primary"
                style={{ marginBottom: 16, float: "right" }}

            >Add</Button>

            <Table
                rowKey="id"
                dataSource={data}
                columns={[
                    { title: "ID", dataIndex: "id" },
                    { title: "Name", dataIndex: "packageName" },
                    { title: "Unit", dataIndex: "unit" },
                    {
                        title: "Action",
                        render: (_, r) => (
                            <>
                                <Button onClick={() => {
                                    setEditing(r);
                                    form.setFieldsValue(r);
                                    setOpen(true);
                                }}>Edit</Button>

                                <Button danger onClick={() => deletePackaging(r.id)}>
                                    Delete
                                </Button>
                            </>
                        )
                    }
                ]}
            />

            <Modal open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="packageName" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}