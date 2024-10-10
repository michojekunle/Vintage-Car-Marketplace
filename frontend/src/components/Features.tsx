import { Icon } from "@iconify/react";

export const Features = () => {
  return (
    <section className="py-12 bg-gray-200">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12 text-neutral-700">
          Why Choose VintageNFTCars?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-600">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Icon
              icon="ph:car-profile-fill"
              className="mx-auto mb-4 text-[#2b3fa1] text-5xl"
            />
            <h4 className="text-xl font-bold mb-2">NFT Ownership</h4>
            <p>Secure and verifiable ownership through blockchain technology</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Icon
              icon="hugeicons:auction"
              className="mx-auto mb-4 text-[#2b3fa1] text-5xl"
            />
            <h4 className="text-xl font-bold mb-2">Auctions</h4>
            <p>Participate in exciting timed auctions for rare vintage cars</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Icon
              icon="fluent-mdl2:repair"
              className="mx-auto mb-4 text-[#2b3fa1] text-5xl"
            />
            <h4 className="text-xl font-bold mb-2">Mechanic Services</h4>
            <p>Book trusted mechanics for maintenance and repairs</p>
          </div>
        </div>
      </div>
    </section>
  );
};
