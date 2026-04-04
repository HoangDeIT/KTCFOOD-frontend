import {
    Table,
    Input,
    Tag,
    message
} from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";

import { getMaterials, getMaterialQuantity } from "@/api/materialApi";

export default function MaterialInventoryPage() {

    const [data, setData] = useState<IMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [quantities, setQuantities] = useState<Record<number, number>>({});

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const res = await getMaterials({
                pageIndex: page,
                pageSize
            });

            setData(res.items);

            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });

            // 🌟 fetch quantity song song
            const quantityMap: Record<number, number> = {};

            await Promise.all(
                res.items.map(async (m) => {
                    try {
                        const q = await getMaterialQuantity(m.id);
                        quantityMap[m.id] = q;
                    } catch {
                        quantityMap[m.id] = 0;
                    }
                })
            );

            setQuantities(quantityMap);

        } catch {
            message.error("Fetch inventory failed 😢");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: ColumnsType<IMaterial> = [
        { title: "ID", dataIndex: "id" },
        { title: "Name", dataIndex: "name" },
        { title: "Unit", dataIndex: "unit" },
        { title: "Type", dataIndex: "type" },

        {
            title: "Available",
            render: (_, record) => {
                const q = quantities[record.id];

                if (q === undefined) return "Loading...";

                return (
                    <Tag color={q < 10 ? "red" : "green"}>
                        {q}
                    </Tag>
                );
            }
        }
    ];

    const filteredData = data.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>

            {/* 🌟 SEARCH */}
            <Input
                placeholder="Search material..."
                style={{ marginBottom: 16, width: 300 }}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Table<IMaterial>
                rowKey="id"
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={pagination}
                onChange={(pag) =>
                    fetchData(pag.current!, pag.pageSize!)
                }
            />
        </div>
    );
}