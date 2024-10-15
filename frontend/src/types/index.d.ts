declare module "wagmi";

interface ISearchInput {
  placeholder: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  deleteSearchValue?: () => void;
}

interface ICarCard {
  id: number;
  image: string;
  name: string;
  make: string;
  model: string;
  listed: string;
  year: number;
  rating: number;
  reviews: number;
  price: number;
  condition?: string | undefined;
  serviceHistory?: string[]; // Optional service history
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

interface INavLinks {
  isMobile: boolean;
  setOpen?: (open: boolean) => void;
}

interface IFeatured {
  cars: ICarCard[];
  priceRange: number[];
  setPriceRange: (priceRange: number[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  totalCars: number;
  listingData?: any;
}

interface IFilterCar {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  selectedMake: string;
  setSelectedMake: (selectedMake: string) => void;
  selectedModel: string;
  setSelectedModel: (selectedModel: string) => void;
}

interface ICountdownTimer {
  initialTime: string;
}

interface IProviders {
  children: React.ReactNode;
}
type ListCarFormValues = {
  listingType: "normalSale" | "auction";
  enableBuyout: boolean;
  durationUnit: "minutes" | "hours" | "days";
  salePrice?: string;
  buyoutPrice?: string;
  startingPrice?: string;
  duration?: string;
};

interface IListCarDialog {
  isDialogOpen: boolean;
  onSubmit: (values: ListCarFormValues) => void;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<ListCarFormValues, undefined>;
}

interface Car {
  id: number;
  listed: string;
  name: string;
  make: string;
  model: string;
  year: number;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  condition: string | undefined;
  serviceHistory?: string[] | null; // Array of strings to represent service records
}

interface CarStore {
  selectedCar: Car | null;
  setSelectedCar: (car: Car) => void;
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  fetchListings: () => Promise<void>;
}

enum ListingType {
  FixedPrice,
  Auction,
}
interface Listing {
  tokenId: string;
  seller: string;
  price: any;
  isActive: boolean;
  listingType: ListingType;
}
