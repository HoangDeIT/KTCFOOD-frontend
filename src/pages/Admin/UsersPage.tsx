import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message
} from "antd";
import { useEffect, useState } from "react";
import {
    getUsers,
    addUser,
    deleteUser,
    updateUser
} from "@/api/adminApi";
import type { ColumnsType } from "antd/es/table";


export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [form] = Form.useForm<IAdminUserRequest>();
    const [editingUser, setEditingUser] = useState<IUser | null>(null);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const fetchUsers = async (page = 1, pageSize = 10) => {
        try {
            const res = await getUsers({ pageIndex: page, pageSize });
            console.log("Fetched users:", res);
            setUsers(res.items);
            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });
        } catch (err) {
            message.error("Failed to fetch users 😢" + err);
            return;
        }

    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async () => {
        const values = await form.validateFields();

        if (editingUser) {
            await updateUser(editingUser.userId, values);
            message.success("Updated user UwU ✨");
        } else {
            await addUser(values);
            message.success("Added user UwU ✨");
        }

        setOpen(false);
        form.resetFields();
        fetchUsers();
    };

    const handleDelete = async (id: string) => {
        await deleteUser(id);
        message.success("Deleted 😈");
        fetchUsers();
    };
    const handleOpenAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setOpen(true);
    };

    const handleOpenEdit = (user: IUser) => {
        setEditingUser(user);
        form.setFieldsValue({
            username: user.username,
            role: user.role,
            password: "" // optional
        });
        setOpen(true);
    };


    const columns: ColumnsType<IUser> = [
        {
            title: "Username",
            dataIndex: "username"
        },
        {
            title: "Role",
            dataIndex: "role"
        },
        {
            title: "Action",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleOpenEdit(record)}>
                        Edit
                    </Button>

                    <Button
                        danger
                        onClick={() => handleDelete(record.userId)}
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" onClick={handleOpenAdd}>
                    Add User
                </Button>
            </div>

            <Table<IUser>
                rowKey="userId"
                columns={columns}
                dataSource={users}
                style={{ marginTop: 20 }}
                pagination={pagination}
                onChange={(pag) => fetchUsers(pag.current, pag.pageSize)}
            />

            <Modal
                title={editingUser ? "Edit User" : "Add User"}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: !editingUser }]} // 👈 edit thì không bắt buộc
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="role" label="Role">
                        <Select
                            options={[
                                { value: "Admin" },
                                { value: "Inventory" },
                                { value: "Sales" },
                                { value: "Production" },
                                { value: "MaterialAndPackaging" }
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}