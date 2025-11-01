import fetchModule from "@/actions/fetchmodule";
import ModuleViewer from "@/components/custom/module/ModuleViewer";
import { notFound } from "next/navigation";

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const module = await fetchModule(id);
    console.log(module);
    if (!module) {
        notFound();
    }

    return <ModuleViewer module={module} />;
}
