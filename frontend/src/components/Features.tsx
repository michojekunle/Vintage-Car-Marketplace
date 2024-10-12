import { features } from "@/lib/constants";
import { motion } from "framer-motion";
import { Card } from "./ui/card";

export const Features = () => {
  const MotionCard = motion(Card);
  return (
    <section className="py-12 px-4 sm:px-10 md:px-16">
      <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
        Why VintageChain?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 text-text-body">
        {features.map((feature) => (
          <MotionCard
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            key={feature.title}
            className="bg-white p-4 rounded-lg shadow-sm shadow-secondary-action text-center overflow-hidden"
          >
            <feature.icon
              className="mx-auto mb-4 text-secondary-action"
              size={48}
            />
            <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
            <p>{feature.description}</p>
          </MotionCard>
        ))}
      </div>
    </section>
  );
};
