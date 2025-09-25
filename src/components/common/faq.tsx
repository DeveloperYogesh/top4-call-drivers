import { faqData } from "./data/faqData";

const Faq = (props: any) => {
  const { bgColor, pathname } = props;
  const data = faqData[pathname];

  // Prevent rendering if data is empty or undefined
  if (!data || data.length === 0) return null;

  return (
    <div className={`w-full ${bgColor}`}>
      <div className="custom-container">
        <h2 className="text-center">Frequently Asked Questions</h2>
        <p className="text-center m-auto max-w-4xl">
          Find answers to common queries about our cab bookings, call taxi
          services, and more for a smooth travel experience.
        </p>

        <div className="bg-gray rounded-lg mt-6 h-full md:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {data.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-4 rounded-lg my-border`}
              >
                <h4 className={`m-0 font-medium`}>
                  {index + 1}. {item.question}
                </h4>
                <div>
                  <p className="mt-2">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
