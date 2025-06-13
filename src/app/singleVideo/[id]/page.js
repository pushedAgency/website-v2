import Header from "@/app/singleVideo/[id]/Header";
import VideoMuxPlayer from "@/app/components/Main/VideoMuxPlayer/VideoMuxPlayer";

const Page = async ({ params }) => {
  const { id } = await params;

  return (
    <main className="">
      <Header id={id} />
      <VideoMuxPlayer id={id} />
    </main>
  );
};

export default Page;
