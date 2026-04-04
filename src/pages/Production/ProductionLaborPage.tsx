import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    DatePicker,
    Input,
    Space,
    message
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { getLabors, updateLabors } from "@/api/Production/productionLaborApi";


export default function ProductionLaborPage() {

    const { id } = useParams();
    const batchId = Number(id);

    const [data, setData] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    // ================= FETCH =================

    const fetchData = async () => {
        try {
            const res = await getLabors(batchId);
            setData(res.items);
        } catch {
            message.error("Load labor failed 😢");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // ================= UPDATE =================

    const handleSubmit = async () => {
        const values = await form.validateFields();

        const payload = [
            {
                workerCount: values.workerCount,
                workDate: values.workDate.format("YYYY-MM-DD"),
                note: values.note
            }
        ];

        try {
            await updateLabors(batchId, payload);
            message.success("Labor updated UwU ✨");
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

        { title: "Workers", dataIndex: "workerCount" },

        {
            title: "Date",
            render: (_: any, r: any) =>
                dayjs(r.workDate).format("DD/MM/YYYY")
        },

        { title: "Note", dataIndex: "note" }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => setOpen(true)}
                style={{ marginBottom: 16 }}
            >
                Add Labor
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
            />

            {/* MODAL */}
            <Modal
                title="Add Labor"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">

                    <Form.Item
                        name="workerCount"
                        label="Worker Count"
                        rules={[{ required: true }, { type: "number", min: 1 }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="workDate"
                        label="Work Date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="note"
                        label="Note"
                    >
                        <Input.TextArea />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}