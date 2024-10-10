import Button from "./common/Button";

export const Cta = () => {
  return (
    <section className="flex flex-col items-center justify-center bg-[#1c2657] text-white py-12">
      <h3 className="text-3xl font-bold mb-4">Ready to Join the Revolution?</h3>
      <p className="text-xl mb-8">
        Start your journey in the world of blockchain-powered vintage cars
        today!
      </p>
      <Button label="Get Started" variant="secondary" />
    </section>
  );
};
