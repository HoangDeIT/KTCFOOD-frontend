import { Modal, Form, Input } from "antd";

export default function EntityFormModal({
    open,
    onCancel,
    onSubmit,
    initialValues,
    loading,
    fields
}: any) {

    const [form] = Form.useForm();

    return (
        <Modal
            title={initialValues ? "Edit" : "Create"}
            open={open}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => form.submit()}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={onSubmit}
            >
                {fields.map((f: any) => (
                    <Form.Item
                        key={f.name}
                        name={f.name}
                        label={f.label}
                        rules={f.rules}
                    >
                        <Input />
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    );
}