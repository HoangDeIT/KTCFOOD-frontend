import {
    Table,
    Button,
    Space,
    message,
    Popconfirm
} from "antd";
import { useEffect, useState } from "react";

import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from "@/api/Sales/supplierApi";
import EntityFormModal from "@/components/sales/EntityFormModal";



export default function SupplierPage() {

    const [data, setData] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const res = await getSuppliers({ pageIndex: 1, pageSize: 100 });
        setData(res.items);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (values: any) => {
        if (editing) {
            await updateSupplier(editing.id, values);
            message.success("Updated ✨");
        } else {
            await createSupplier(values);
            message.success("Created UwU ✨");
        }

        setOpen(false);
        setEditing(null);
        fetchData();
    };

    const handleDelete = async (id: number) => {
        await deleteSupplier(id);
        message.success("Deleted ❌");
        fetchData();
    };

    const columns = [
        { title: "ID", dataIndex: "id" },
        { title: "Name", dataIndex: "name" },
        { title: "Phone", dataIndex: "phoneNumber" },
        { title: "Email", dataIndex: "email" },
        {
            title: "Action",
            render: (_: any, r: any) => (
                <Space>
                    <Button onClick={() => {
                        setEditing(r);
                        setOpen(true);
                    }}>
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete?"
                        onConfirm={() => handleDelete(r.id)}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setOpen(true)}>
                Create Supplier
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
            />

            <EntityFormModal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setEditing(null);
                }}
                onSubmit={handleSubmit}
                initialValues={editing}
                fields={[
                    { name: "name", label: "Name", rules: [{ required: true }] },
                    { name: "phoneNumber", label: "Phone" },
                    { name: "email", label: "Email" }
                ]}
            />
        </div>
    );
}