import {
    Table,
    Button,
    InputNumber,
    Select,
    Space,
    Card,
    message
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getOrderDetails,
    updateOrderDetails
} from "@/api/Sales/orderDetailApi";
import { getProducts } from "@/api/inventoryApi";


export default function SalesOrderDetailPage() {

    const { id } = useParams();

    const [data, setData] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ================= FETCH =================

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getOrderDetails(Number(id));
            setData(res.items);
        } catch {
            message.error("Load details failed 😢");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        const res = await getProducts({ pageIndex: 1, pageSize: 1000 });
        setProducts(res.items);
    };

    useEffect(() => {
        fetchData();
        fetchProducts();
    }, []);

    // ================= ACTION =================

    const handleAddRow = () => {
        setData(prev => [
            ...prev,
            { productId: null, quantity: 1, price: 0 }
        ]);
    };

    const handleSave = async () => {
        try {
            await updateOrderDetails(Number(id), data);
            message.success("Saved UwU ✨");
            fetchData();
        } catch {
            message.error("Save failed 😢");
        }
    };

    // ================= TABLE =================

    const columns = [
        {
            title: "Product",
            render: (_: any, r: any, index: number) => (
                <Select
                    style={{ width: 200 }}
                    value={r.productId}
                    onChange={(v) => {
                        const newData = [...data];
                        newData[index].productId = v;
                        setData(newData);
                    }}
                    options={products.map(p => ({
                        label: p.productName,
                        value: p.id
                    }))}
                />
            )
        },
        {
            title: "Quantity",
            render: (_: any, r: any, index: number) => (
                <InputNumber
                    min={1}
                    value={r.quantity}
                    onChange={(v) => {
                        const newData = [...data];
                        newData[index].quantity = v;
                        setData(newData);
                    }}
                />
            )
        },
        {
            title: "Price",
            render: (_: any, r: any, index: number) => (
                <InputNumber
                    min={0}
                    value={r.price}
                    onChange={(v) => {
                        const newData = [...data];
                        newData[index].price = v;
                        setData(newData);
                    }}
                />
            )
        },
        {
            title: "Total",
            render: (_: any, r: any) =>
                (r.quantity || 0) * (r.price || 0)
        }
    ];

    return (
        <Card
            title={`Order #${id}`}
            extra={
                <Space>
                    <Button onClick={handleAddRow}>
                        Add Item
                    </Button>

                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Space>
            }
        >
            <Table
                rowKey={(index, i) => index.toString()}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
            />
        </Card>
    );
}