interface ISearchInput {
  placeholder: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  deleteSearchValue?: () => void;
}

interface ICarCard {
  image: string;
  name: string;
  make: string;
  model: string;
  listed: string;
  year: number;
  rating: number;
  reviews: number;
  price: number;
  onClick?: () => void;
}

interface IAddCarValues {
  make: string;
  model: string;
  year: string;
  vin: string;
  description: string;
  engineCondition: string;
  exteriorCondition: string;
}

type FieldProp =
	| "make"
	| "model"
	| "year"
	| "vin"
	| "description"
	| "engineCondition"
	| "exteriorCondition";

type VehicleOptionsProp = { label: string; value: string };

interface IComboboxForm {
	field: ControllerRenderProps<IAddCarValues, FieldProp>;
	options: VehicleOptionsProp[];
	fieldName: string;
	form: UseFormReturn<IAddCarValues, undefined>;
}
