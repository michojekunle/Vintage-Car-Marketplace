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
  year: number;
  rating: number;
  reviews: number;
  price: number;
  onClick?: () => void;
}
