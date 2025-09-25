import { tariffTableContentData } from "@/data/tariffTableContentData";

const TariffTableContentSection = (props: any) => {
  const { bgColor, pathname } = props;
  // const route = usePathname();
  const sectionData = tariffTableContentData[pathname];

  if (!sectionData || !sectionData.content) return null; // Handle missing or empty data

  return (
    <section className={`bg-white ${bgColor}`}>
      <div className="custom-container">
        <h2 className=" text-center">{sectionData.head}</h2>
        <div className="parah-content" dangerouslySetInnerHTML={{ __html: sectionData.content }} />
      </div>
    </section>
  );
};

export default TariffTableContentSection;
