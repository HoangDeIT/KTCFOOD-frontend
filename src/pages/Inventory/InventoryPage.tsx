import {
    Table,
    Button,
    Modal,
    Form,
    DatePicker,
    message
} from "antd";
import { useEffect, useState } from "react";
import {
    getInventories,
    updateInventory,
    deleteInventory
} from "@/api/inventoryApi";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

export default function InventoryPage() {
    const [data, setData] = useState<IInventory[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<IInventory | null>(null);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        try {
            const res = await getInventories({ pageIndex: page, pageSize });

            setData(res.items);
            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });
        } catch {
            message.error("Fetch inventory failed 😢");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteInventory(id);
        message.success("Deleted 😈");
        fetchData(pagination.current, pagination.pageSize);
    };

    const handleOpenEdit = (record: IInventory) => {
        setEditing(record);

        form.setFieldsValue({
            preservationEndDate: dayjs(record.preservationEndDate)
        });

        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!editing) {
            message.error("No inventory selected 😢");
            return;
        }

        const values = await form.validateFields();

        await updateInventory(
            editing.id,
            values.preservationEndDate.format("YYYY-MM-DD")
        );

        message.success("Updated UwU ✨");

        setOpen(false);
        setEditing(null); // 👈 reset luôn cho sạch
        fetchData(pagination.current, pagination.pageSize);
    };
    const columns: ColumnsType<IInventory> = [
        { title: "Product ID", dataIndex: "productId" },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Production Date", dataIndex: "productionDate" },
        { title: "Expire Date", dataIndex: "preservationEndDate" },
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
            <Table<IInventory>
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={pagination}
                onChange={(pag) =>
                    fetchData(pag.current!, pag.pageSize!)
                }
            />

            <Modal
                title="Update Expire Date"
                open={open}
                onCancel={() => setOpen(false)}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="preservationEndDate"
                        label="Expire Date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}