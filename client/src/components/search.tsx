"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Filter, SearchIcon, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/product-card";
import type { Brand, Category, Product } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileNavbar from "@/components/mobile-nav";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${process.env.API}products/categories/`),
          axios.get(`${process.env.API}products/brands/`),
        ]);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (sortBy) params.append("ordering", sortBy);
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedBrand) params.append("brand", selectedBrand);
        params.append("min_price", priceRange[0].toString());
        params.append("max_price", priceRange[1].toString());

        const { data } = await axios.get(
          `${process.env.API}products/products/?${params.toString()}`,
        );
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isFetching) {
      fetchProducts();
    }
  }, [
    debouncedSearch,
    sortBy,
    selectedCategory,
    selectedBrand,
    priceRange,
    isFetching,
  ]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set("q", search);
    else params.delete("q");
    if (sortBy) params.set("sort", sortBy);
    else params.delete("sort");
    if (selectedCategory) params.set("category", selectedCategory);
    else params.delete("category");
    if (selectedBrand) params.set("brand", selectedBrand);
    else params.delete("brand");

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    search,
    sortBy,
    selectedCategory,
    selectedBrand,
    pathname,
    router,
    searchParams,
  ]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 100000000]);
    setActiveTab("all");
    setIsFilterOpen(false);
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (priceRange[1] < 100000000 ? 1 : 0);

  return (
    <div className="pb-16">
      <MobileNavbar />
      <div className="container px-4 pt-4">
        {/* Search and Filter Header */}
        <div className="sticky top-0 z-10 -mx-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Mahsulotlarni qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                  onClick={() => setSearch("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Qidiruvni tozalash</span>
                </Button>
              )}
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative shrink-0"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg">
                <SheetHeader className="space-y-2">
                  <SheetTitle>Filterlar</SheetTitle>
                  <SheetDescription>
                    Qidiruv natijalarini filtrlash
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Barchasi</TabsTrigger>
                    <TabsTrigger value="categories">Kategoriyalar</TabsTrigger>
                    <TabsTrigger value="brands">Brendlar</TabsTrigger>
                  </TabsList>
                  <div className="mt-4 space-y-6">
                    <TabsContent value="all">
                      {/* Sort */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Saralash</h3>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue placeholder="Saralash turini tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="price">
                              Narx: Arzondan qimmatga
                            </SelectItem>
                            <SelectItem value="-price">
                              Narx: Qimmatdan arzonga
                            </SelectItem>
                            <SelectItem value="name">Nom: A-Z</SelectItem>
                            <SelectItem value="-name">Nom: Z-A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-2 mt-6">
                        <h3 className="text-sm font-medium">Narx oralig'i</h3>
                        <Slider
                          value={priceRange}
                          max={100000000}
                          step={100000}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="categories">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Kategoriyalar</h3>
                        <div className="grid gap-2">
                          {categories.map((category) => (
                            <Button
                              key={category.id}
                              variant={
                                selectedCategory === category.id
                                  ? "default"
                                  : "outline"
                              }
                              className="w-full justify-start"
                              onClick={() => {
                                setSelectedCategory(
                                  selectedCategory === category.id
                                    ? ""
                                    : category.id,
                                );
                              }}
                            >
                              {category.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="brands">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Brendlar</h3>
                        <div className="grid gap-2">
                          {brands.map((brand) => (
                            <Button
                              key={brand.id}
                              variant={
                                selectedBrand === brand.id
                                  ? "default"
                                  : "outline"
                              }
                              className="w-full justify-start"
                              onClick={() => {
                                setSelectedBrand(
                                  selectedBrand === brand.id ? "" : brand.id,
                                );
                              }}
                            >
                              {brand.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                <SheetFooter className="absolute bottom-0 left-0 right-0 bg-background p-4 border-t">
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={clearFilters}
                    >
                      Tozalash
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Natijalarni ko'rsatish ({products.length})
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <ScrollArea className="mt-2">
              <div className="flex gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="rounded-full">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedCategory("")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">
                        Kategoriya filtrini o'chirish
                      </span>
                    </Button>
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="secondary" className="rounded-full">
                    {brands.find((b) => b.id === selectedBrand)?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedBrand("")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Brend filtrini o'chirish</span>
                    </Button>
                  </Badge>
                )}
                {priceRange[1] < 100000000 && (
                  <Badge variant="secondary" className="rounded-full">
                    {formatPrice(priceRange[1])} gacha
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setPriceRange([0, 100000000])}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Narx filtrini o'chirish</span>
                    </Button>
                  </Badge>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Results */}
        <div className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Natija topilmadi</h3>
              <p className="text-muted-foreground mb-4">
                Qidiruv so'rovini o'zgartiring yoki filtrlarni tozalang
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Filtrlarni tozalash
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
