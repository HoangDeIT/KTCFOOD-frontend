import {
    Card,
    Row,
    Col,
    Statistic,
    List,
    Tag,
    message
} from "antd";
import { useEffect, useState } from "react";

import { getMaterials, getMaterialQuantity } from "@/api/materialApi";
import { getPackagings } from "@/api/packagingApi";
import { getPackagingQuantity } from "@/api/MaterialAndPackaging/packagingInventoryApi";

export default function DashboardPage() {

    const [materialCount, setMaterialCount] = useState(0);
    const [packagingCount, setPackagingCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lowMaterials, setLowMaterials] = useState<IMaterial[]>([]);
    const [lowPackagings, setLowPackagings] = useState<IPackaging[]>([]);
    const fetchData = async () => {
        try {
            setLoading(true);

            const mat = await getMaterials({ pageIndex: 1, pageSize: 1000 });
            const pac = await getPackagings({ pageIndex: 1, pageSize: 1000 });
            console.log("Materials:", mat);
            console.log("Packagings:", pac);
            //@ts-ignore
            setMaterialCount(mat.meta.totalItems);
            setPackagingCount(pac.meta.totalItems);

            const lowMat = (
                await Promise.all(
                    mat.items.map(async (m) => {
                        const q = await getMaterialQuantity(m.id);
                        return q != null && q < 10 ? { ...m, quantity: q } : null;
                    })
                )
            ).filter(Boolean);

            const lowPac = (
                await Promise.all(
                    pac.items.map(async (p: IPackaging) => {
                        const q = await getPackagingQuantity(p.id);
                        return q != null && q < 10 ? { ...p, quantity: q } : null;
                    })
                )
            ).filter(Boolean);

            setLowMaterials(lowMat as any);
            setLowPackagings(lowPac as any);

        } catch {
            message.error("Load dashboard failed 😢");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>

            {/* 🌟 STATISTIC */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card>
                        <Statistic title="Total Materials" value={materialCount} />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card>
                        <Statistic title="Total Packagings" value={packagingCount} />
                    </Card>
                </Col>
            </Row>

            {/* 🌟 LOW STOCK */}
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Low Material Stock ⚠️" loading={loading}>
                        <List
                            dataSource={lowMaterials}
                            locale={{ emptyText: "No low materials 🎉" }}
                            renderItem={(item: any) => (
                                <List.Item>
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                        <span>{item.name}</span>

                                        <div>
                                            <Tag color="red">LOW</Tag>
                                            <Tag color="orange">{item.quantity}</Tag>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Low Packaging Stock ⚠️" loading={loading}>
                        <List
                            dataSource={lowPackagings}
                            locale={{ emptyText: "No low packagings 🎉" }}
                            renderItem={(item: any) => (
                                <List.Item>
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                        <span>{item.packageName}</span>

                                        <div>
                                            <Tag color="red">LOW</Tag>
                                            <Tag color="orange">{item.quantity}</Tag>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    );
}