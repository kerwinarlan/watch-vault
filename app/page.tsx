import Catalog from "@/components/catalog";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ watch?: string }>;
}) {
  const { watch } = await searchParams;
  const initialWatchId = watch && /^\d+$/.test(watch) ? Number(watch) : null;
  return <Catalog initialWatchId={initialWatchId} />;
}
