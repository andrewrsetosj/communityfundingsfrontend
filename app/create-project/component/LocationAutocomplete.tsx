"use client";

import { useEffect, useRef, useState } from "react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

function formatLocation(result: NominatimResult): string {
  const a = result.address;
  const city = a.city || a.town || a.village || a.county || "";
  const state = a.state || "";
  const country = a.country || "";

  if (city && state) return `${city}, ${state}`;
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  // Fallback to first two parts of display_name
  const parts = result.display_name.split(",").map((s) => s.trim());
  return parts.slice(0, 2).join(", ");
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export default function LocationAutocomplete({
  value,
  onChange,
  onBlur,
  error,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5`,
        { headers: { "User-Agent": "CommunityFundings/1.0" } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setShowDropdown(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (result: NominatimResult) => {
    const formatted = formatLocation(result);
    setQuery(formatted);
    onChange(formatted);
    setShowDropdown(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Project Location
      </label>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search for a city"
        autoComplete="off"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
      />

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, idx) => {
            const formatted = formatLocation(result);
            return (
              <li
                key={result.place_id}
                onMouseDown={() => handleSelect(result)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                  idx === activeIndex
                    ? "bg-[#8BC34A]/10 text-[#689F38]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{formatted}</div>
                <div className="text-xs text-gray-400 truncate">{result.display_name}</div>
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
