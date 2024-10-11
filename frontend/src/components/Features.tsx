import { Car, Hammer, Wrench } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-12 mx-2">
      <div className="container mx-auto">
        <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
          Why VintageChain?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 text-text-body">
          <div className="bg-white p-6 rounded-lg shadow-md shadow-secondary-action text-center">
            <Car className="mx-auto mb-4 text-secondary-action" size={48} />
            <h4 className="text-xl font-bold mb-2">NFT Ownership</h4>
            <p>
              List your vintage cars as NFTs, Secure and verifiable ownership
              through VintageChain
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md shadow-secondary-action text-center">
            <Hammer className="mx-auto mb-4 text-secondary-action" size={48} />
            <h4 className="text-xl font-bold mb-2">Auctions</h4>
            <p>Participate in exciting timed auctions for rare vintage cars</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md shadow-secondary-action text-center">
            <Wrench className="mx-auto mb-4 text-secondary-action" size={48} />
            <h4 className="text-xl font-bold mb-2">Mechanic Services</h4>
            <p>
              Offer your expertise, get verified, and connect with classic car
              owners for maintenance and restoration services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
