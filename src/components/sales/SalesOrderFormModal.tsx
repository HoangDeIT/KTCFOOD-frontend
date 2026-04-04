// components/Sales/SalesOrderFormModal.tsx

import { Modal, Form, Select, DatePicker } from "antd";
import dayjs from "dayjs";

interface Props {
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    customers: any[];
    initialValues?: any;
    loading?: boolean;
}

export default function SalesOrderFormModal({
    open,
    onCancel,
    onSubmit,
    customers,
    initialValues,
    loading
}: Props) {

    const [form] = Form.useForm();

    return (
        <Modal
            title={initialValues ? "Edit Order" : "Create Order"}
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
                initialValues={{
                    ...initialValues,
                    orderDate: initialValues?.orderDate ? dayjs(initialValues.orderDate) : null,
                    deliveryDate: initialValues?.deliveryDate ? dayjs(initialValues.deliveryDate) : null
                }}
                onFinish={onSubmit}
            >
                <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        optionFilterProp="label"
                        options={customers.map(c => ({
                            label: c.name,
                            value: c.id
                        }))}
                    />
                </Form.Item>

                <Form.Item name="orderDate" label="Order Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="deliveryDate" label="Delivery Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { label: "Pending", value: "Pending" },
                            { label: "Completed", value: "Completed" },
                            { label: "Canceled", value: "Canceled" }
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}