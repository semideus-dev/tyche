"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import debounce from "lodash/debounce";

interface Company {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

interface CompanyProfile {
  logo: string;
  name: string;
  ticker: string;
  exchange: string|undefined;
}

interface RecentSearch {
  symbol: string;
  name: string;
  exchange: string|undefined;
  type: string;
  logo?: string;
}

const fetchCompanies = async (query: string): Promise<Company[]> => {
  if (query.length < 2) return [];
  const response = await fetch(
    `/api/finnhub/search?q=${encodeURIComponent(query)}`,
  );
  const data = await response.json();
  return data.result || [];
};

const fetchAllCompanies = async (): Promise<Company[]> => {
  const response = await fetch("/api/finnhub/companies");
  return response.json();
};

const fetchCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
  const response = await fetch(
    `/api/finnhub/company?symbol=${encodeURIComponent(symbol)}`,
  );
  return response.json();
};

export default function StockSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const debouncedSetQuery = useCallback(
    debounce((value: string) => setDebouncedQuery(value), 300),
    [],
  );

  useEffect(() => {
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchCompanies(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: allCompanies = [], isLoading: isAllCompaniesLoading } =
    useQuery({
      queryKey: ["allCompanies"],
      queryFn: fetchAllCompanies,
      staleTime: 1000 * 60 * 60, // 1 hour
    });

  const addToRecent = async (company: Company) => {
    try {
      const profile = await fetchCompanyProfile(company.symbol);
      const newSearch: RecentSearch = {
        symbol: company.symbol,
        name: company.description,
        exchange: company.displaySymbol.split(":")[0],
        type: company.type,
        logo: profile.logo,
      };

      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.symbol !== company.symbol);
        const updated = [newSearch, ...filtered].slice(0, 10);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Failed to fetch company profile:", error);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const displayedCompanies =
    debouncedQuery.length >= 2 ? searchResults : allCompanies;
  const isLoading =
    debouncedQuery.length >= 2 ? isSearchLoading : isAllCompaniesLoading;

  return (
    <div className="flex flex-col justify-center w-[90%] md:w-[60%]">
      <div className="relative">
        <Input
          className="my-10 rounded-full py-3 ps-9"
          placeholder="Search for the next investment idea..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
      {/* <div className="relative">
        <Input
          className="h-14 w-full rounded-full border-0 bg-gradient-to-r from-yellow-100/80 to-pink-100/80 px-4 text-lg placeholder:text-gray-500"
          placeholder="Search your next investment idea..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        />
      </div> */}

      {isSearchFocused && (
        <div className="mt-2 rounded-lg border border-muted bg-background shadow-lg">
          <ScrollArea className="h-[400px] w-full rounded-md border border-muted p-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {debouncedQuery.length >= 2
                  ? "Search Results"
                  : "All Companies"}
              </h2>
              {isLoading ? (
                <div className="text-center">Loading...</div>
              ) : displayedCompanies.length > 0 ? (
                displayedCompanies.map((company) => (
                  <button
                    key={company.symbol}
                    className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-gray-800"
                    onClick={() => {
                      addToRecent(company);
                      setQuery("");
                    }}
                  >
                    <div>
                      <div className="font-semibold">{company.description}</div>
                      <div className="text-sm text-gray-600">
                        {company.displaySymbol}
                      </div>
                    </div>
                    <Plus className="h-4 w-4" />
                  </button>
                ))
              ) : (
                <div className="text-center">No results found</div>
              )}
            </div>
            {/* <TabsContent value="recent" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Searches</h2>
                  {recentSearches.length > 0 && (
                    <Button variant="ghost" onClick={clearRecent}>
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((item) => (
                      <div
                        key={item.symbol}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                            <Image
                              src={item.logo || "/placeholder.svg"}
                              alt={item.name}
                              width={24}
                              height={24}
                              className="rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Image
                                src="/placeholder.svg"
                                alt={item.exchange}
                                width={16}
                                height={16}
                                className="rounded-full"
                              />
                              {item.exchange}:{item.symbol} ({item.type})
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            20 Listings
                          </span>
                          <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center">No recent searches</div>
                  )}
                </div>
              </div>
            </TabsContent> */}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
