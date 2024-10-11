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
  onClick?: () => void;
}

interface INavLinks {
  isMobile: boolean;
  setOpen?: (open: boolean) => void;
}

interface IFeatured {
  cars: ICarCard[];
  priceRange: number[];
  setPriceRange: (priceRange: number[]) => void;
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
