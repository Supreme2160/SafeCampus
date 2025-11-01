import fetchModule from "@/actions/fetchmodule";
import ModuleViewer from "@/components/custom/module/ModuleViewer";
import { notFound } from "next/navigation";

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const moduleX = await fetchModule(id);
    // console.log(moduleX);
    if (!moduleX) {
        notFound();
    }

    return <ModuleViewer moduleX={moduleX} />;
}
