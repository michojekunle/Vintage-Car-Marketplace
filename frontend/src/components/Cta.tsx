import { Button } from "./ui/button";

export const Cta = () => {
  return (
    <section className="flex flex-col items-center justify-center bg-primary text-white py-12 text-center">
      <h3 className="text-2xl lg:text-3xl font-bold mb-4">
        Ready to Join the Revolution?
      </h3>
      <p className="text-lg lg:text-xl mb-8">
        Start your journey in the world of blockchain-powered vintage cars
        today!
      </p>
      <Button className="border-2 border-white  bg-transparent font-semibold">
        Get Started
      </Button>
    </section>
  );
};
