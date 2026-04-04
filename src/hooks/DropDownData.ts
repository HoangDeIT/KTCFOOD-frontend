import { getBatchesDropdown, getMaterialsDropdown, getSuppliersDropdown } from "@/api/materialImportApi";
import { useEffect, useState } from "react";


export function useDropdownData(open: boolean) {
    const [materials, setMaterials] = useState<IMaterial[]>([]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [batches, setBatches] = useState<IProductionBatch[]>([]);

    useEffect(() => {
        if (!open) return;

        const fetchAll = async () => {
            const [m, s, b] = await Promise.all([
                getMaterialsDropdown(),
                getSuppliersDropdown(),
                getBatchesDropdown()
            ]);

            setMaterials(m.items);
            setSuppliers(s.items);
            setBatches(b.items);
        };

        fetchAll();
    }, [open]);

    return { materials, suppliers, batches };
}