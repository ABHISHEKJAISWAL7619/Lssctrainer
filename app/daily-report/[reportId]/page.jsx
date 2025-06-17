import DailyReport from "@/ui/pages/DailyReport";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { reportId } = await params;
  return (
    <MainLayout>
      <DailyReport reportId={reportId} />
    </MainLayout>
  );
};

export default page;
