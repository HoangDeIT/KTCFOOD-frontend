import {
    Table,
    Button,
    Space,
    message,
    Popconfirm
} from "antd";
import { useEffect, useState } from "react";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "@/api/Sales/customerApi";
import EntityFormModal from "@/components/sales/EntityFormModal";


export default function CustomerPage() {

    const [data, setData] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const fetchData = async () => {
        const res = await getCustomers({ pageIndex: 1, pageSize: 100 });
        setData(res.items);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (values: any) => {
        if (editing) {
            await updateCustomer(editing.id, values);
            message.success("Updated ✨");
        } else {
            await createCustomer(values);
            message.success("Created UwU ✨");
        }

        setOpen(false);
        setEditing(null);
        fetchData();
    };

    const handleDelete = async (id: number) => {
        await deleteCustomer(id);
        message.success("Deleted ❌");
        fetchData();
    };

    const columns = [
        { title: "ID", dataIndex: "id" },
        { title: "Name", dataIndex: "name" },
        { title: "Address", dataIndex: "address" },
        { title: "Phone", dataIndex: "phone" },
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
                Create Customer
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
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
                    { name: "address", label: "Address" },
                    { name: "phone", label: "Phone" }
                ]}
            />
        </div>
    );
}