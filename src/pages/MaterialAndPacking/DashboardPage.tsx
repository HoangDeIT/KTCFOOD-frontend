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

    const [lowMaterials, setLowMaterials] = useState<IMaterial[]>([]);
    const [lowPackagings, setLowPackagings] = useState<IPackaging[]>([]);

    const fetchData = async () => {
        try {
            const mat = await getMaterials({ pageIndex: 1, pageSize: 1000 });
            const pac = await getPackagings({ pageIndex: 1, pageSize: 1000 });

            setMaterialCount(mat.totalCount);
            setPackagingCount(pac.totalCount);

            // 🔥 check tồn kho
            const lowMat: IMaterial[] = [];
            const lowPac: IPackaging[] = [];

            await Promise.all(
                mat.items.map(async (m) => {
                    const q = await getMaterialQuantity(m.id);
                    if (q < 10) lowMat.push(m);
                })
            );

            await Promise.all(
                pac.items.map(async (p: IPackaging) => {
                    const q = await getPackagingQuantity(p.id);
                    //@ts-ignore
                    if (q < 10) lowPac.push(p.data);
                })
            );

            setLowMaterials(lowMat);
            setLowPackagings(lowPac);

        } catch {
            message.error("Load dashboard failed 😢");
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
                    <Card title="Low Material Stock ⚠️">
                        <List
                            dataSource={lowMaterials}
                            renderItem={(item) => (
                                <List.Item>
                                    {item.name}
                                    <Tag color="red">LOW</Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Low Packaging Stock ⚠️">
                        <List
                            dataSource={lowPackagings}
                            renderItem={(item) => (
                                <List.Item>
                                    {item.packageName}
                                    <Tag color="red">LOW</Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    );
}