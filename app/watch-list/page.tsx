import Catalog from "@/components/catalog";
import ContactSection from "@/components/contact";

export default async function WatchListPage({
  searchParams,
}: {
  searchParams: Promise<{ watch?: string; status?: string }>;
}) {
  const { watch, status } = await searchParams;
  const initialWatchId = watch && /^\d+$/.test(watch) ? Number(watch) : null;
  const initialStatus = status === "Available" || status === "Reserved" ? status : null;
  return (
    <>
      <Catalog
        initialWatchId={initialWatchId}
        initialStatus={initialStatus}
        eyebrow="First access from Manila's collecting desk."
        heading="The Collector List"
      />
      <ContactSection />
    </>
  );
}
