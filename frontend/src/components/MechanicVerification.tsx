import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

const MotionCard = motion(Card);

const MechanicVerification = () => {
  return (
    <section id="mechanic-verification" className="mb-16">
      <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
        Mechanic Verification
      </h3>
      <p className="mb-8 text-center text-xl max-w-3xl mx-auto">
        Are you a skilled mechanic specializing in classic cars? Get verified on
        VintageChain to offer your services to our community of vintage car
        enthusiasts.
      </p>
      <MotionCard
        className="bg-white border-amber-200 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ShieldCheck className="h-8 w-8 mr-4 text-amber-600" />
            Mechanic Verification Process
          </CardTitle>
          <CardDescription className="text-lg">
            Complete the following steps to become a verified mechanic on
            VintageChain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-4 text-amber-700 text-lg">
            <li>
              Fill out the application form with your professional details
            </li>
            <li>Upload copies of your certifications and licenses</li>
            <li>
              Provide references from previous classic car restoration projects
            </li>
            <li>
              Pass a brief online assessment of your vintage car knowledge
            </li>
            <li>Schedule a video interview with our verification team</li>
          </ol>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-secondary-action hover:bg-amber-600 text-white text-lg py-6">
            Start Verification Process
          </Button>
        </CardFooter>
      </MotionCard>
    </section>
  );
};

export default MechanicVerification;
