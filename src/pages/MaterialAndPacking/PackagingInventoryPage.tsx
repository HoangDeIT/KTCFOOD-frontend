import {
    Table,
    Input,
    Tag,
    message
} from "antd";
import { useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";

import {
    getPackagings,
    getPackagingQuantity
} from "@/api/MaterialAndPackaging/packagingInventoryApi";

export default function PackagingInventoryPage() {

    const [data, setData] = useState<IPackaging[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const res = await getPackagings({
                pageIndex: page,
                pageSize
            });
            setData(res.items);

            setPagination({
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.totalCount
            });

            // 🌟 fetch quantity (song song)
            const map: Record<number, number> = {};

            await Promise.all(
                res.items.map(async (p) => {
                    try {
                        const q = await getPackagingQuantity(p.id);
                        map[p.id] = q;
                    } catch {
                        map[p.id] = 0;
                    }
                })
            );

            setQuantities(map);

        } catch {
            message.error("Fetch packaging inventory failed 😢");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter(p =>
            p.packageName.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    const columns: ColumnsType<IPackaging> = [
        { title: "ID", dataIndex: "id" },
        { title: "Name", dataIndex: "packageName" },
        { title: "Unit", dataIndex: "unit" },

        {
            title: "Available",
            render: (_, record) => {
                const q = quantities[record.id];

                if (q === undefined) return "Loading...";

                return (
                    <Tag key={q} color={
                        q < 10 ? "red" :
                            q < 50 ? "orange" :
                                "green"
                    }>
                        {q}
                    </Tag>
                );
            }
        }
    ];

    return (
        <div>

            {/* 🌟 SEARCH */}
            <Input
                placeholder="Search packaging..."
                style={{ marginBottom: 16, width: 300 }}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Table<IPackaging>
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