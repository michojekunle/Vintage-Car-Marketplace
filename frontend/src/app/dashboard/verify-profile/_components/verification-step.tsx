import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface VerificationStepProp {
	icon: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
	title: string;
	description: string;
	completed: boolean;
    failed: boolean;
}

export default function VerificationStep({ icon: Icon, title, description, completed, failed }: VerificationStepProp) {
    return (
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${failed ? 'bg-red-100' : completed ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${failed ? 'text-red-600' : completed ? 'text-green-600' :  'text-gray-400'}`} />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    )
  }
