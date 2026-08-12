import Catalog from "@/components/catalog";
import ContactSection from "@/components/contact";
import JournalSection from "@/components/journal";
import { STATUSES, type Status } from "@/lib/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ watch?: string; status?: string }>;
}) {
  const { watch, status } = await searchParams;
  const initialWatchId = watch && /^\d+$/.test(watch) ? Number(watch) : null;
  const initialStatus =
    status && (STATUSES as readonly string[]).includes(status)
      ? (status as Status)
      : null;
  return (
    <>
      <Catalog initialWatchId={initialWatchId} initialStatus={initialStatus} />
      <JournalSection />
      <ContactSection />
    </>
  );
}
