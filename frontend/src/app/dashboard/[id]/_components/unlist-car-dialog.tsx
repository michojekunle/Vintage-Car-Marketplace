import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UnlistCarDialog = ({ handleUnlist }: { handleUnlist: () => void }) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
			<Button variant={"destructive"} className="w-full ">
			<Car className="mr-2 h-4 w-4" /> Unlist Vehicle
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to unlist your vehicle?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. Your vehicle will no longer be visible
						to potential buyers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleUnlist}>Unlist</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default UnlistCarDialog;
