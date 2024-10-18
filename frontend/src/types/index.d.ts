// declare module "wagmi";

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
  listed: boolean;
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
  color: string;
  mileage: string;
  description: string;
  engineCondition: string;
  exteriorCondition: string;
}

type FieldProp =
  | "make"
  | "model"
  | "year"
  | "vin"
  | "color"
  | "mileage"
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
  cars: IListing[];
  priceRange: number[];
  setPriceRange: (priceRange: number[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  totalCars: number;
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
  loading: boolean;
  form: UseFormReturn<ListCarFormValues, undefined>;
}

interface IListing {
  tokenId: number;
  seller: string;
  price: number;
  isActive: boolean;
  listingType: number;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  };
}

interface Car {
  id: number;
  listed: boolean;
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
  selectedCar: any | null;
  setSelectedCar: (car: any) => void;
  listings: IListing[];
  setListings: (listings: IListing[]) => void;
  auctions: any[];
  setAuctions: (auctions: any[]) => void;
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

interface ILiveAuction {
  auctions: Listing[];
}
