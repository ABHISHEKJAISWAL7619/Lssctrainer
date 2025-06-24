import Addperformance from "@/ui/molecules/Addperformance";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { reportId } = await params;
  return (
    <MainLayout>
      <Addperformance reportId={reportId} />
    </MainLayout>
  );
};

export default page;
