"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { useMemo, useState } from "react";
import {
  Tag,
  Trophy,
  ArrowRight,
  Users,
  Shield,
  Globe,
  Home,
  MapPin,
  Shirt,
} from "lucide-react";

type CategorySummary = {
  name: string;
  count: number;
};

type ClubSummary = {
  name: string;
  count: number;
  league?: string;
};

function aggregateData() {
  const categoryToCount = new Map<string, number>();
  const leagueToCount = new Map<string, number>();
  const clubToCount = new Map<string, number>();
  const clubToLeague = new Map<string, string>();

  for (const product of products) {
    const category = product.category?.trim();
    if (category)
      categoryToCount.set(category, (categoryToCount.get(category) || 0) + 1);

    const league = product.league?.trim();
    if (league) leagueToCount.set(league, (leagueToCount.get(league) || 0) + 1);

    const club = product.club?.trim();
    // Filter out "Unknown Club" and empty club names
    if (club && club !== "Unknown Club" && club.length > 0) {
      clubToCount.set(club, (clubToCount.get(club) || 0) + 1);
      if (league) clubToLeague.set(club, league);
    }
  }

  const categories = Array.from(categoryToCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const leagues = Array.from(leagueToCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const clubs = Array.from(clubToCount.entries())
    .map(([name, count]) => ({ name, count, league: clubToLeague.get(name) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // compact list

  return { categories, leagues, clubs };
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "home":
      return <Home className="h-5 w-5" />;
    case "away":
      return <MapPin className="h-5 w-5" />;
    case "training":
      return <Shirt className="h-5 w-5" />;
    case "goalkeeper":
      return <Shield className="h-5 w-5" />;
    default:
      return <Tag className="h-5 w-5" />;
  }
};

export default function CategoriesPage() {
  const { categories, leagues, clubs } = aggregateData();
  const [activeTab, setActiveTab] = useState<
    "categories" | "leagues" | "clubs"
  >("categories");
  const [query, setQuery] = useState("");
  const [alphabeticalClubs, setAlphabeticalClubs] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!query) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [categories, query]);

  const filteredLeagues = useMemo(() => {
    if (!query) return leagues;
    return leagues.filter((l) =>
      l.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [leagues, query]);

  const filteredClubs = useMemo(() => {
    const base = alphabeticalClubs
      ? [...clubs].sort((a, b) => a.name.localeCompare(b.name))
      : clubs;
    if (!query) return base;
    return base.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [clubs, query, alphabeticalClubs]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <div className="relative bg-black text-white h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/cat-hero.jpg"
            alt="Categories"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Browse by category and league
          </h1>
          <p className="text-md text-gray-200 max-w-2xl mx-auto">
            Find jerseys by kit type or competition
          </p>
          <Link
            href="/products"
            className="inline-flex mt-4 items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            open catalog
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Subnav + Search */}
        <div className="flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex justify-center sm:justify-start">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              {(
                [
                  { key: "categories", label: "categories" },
                  { key: "leagues", label: "leagues" },
                  { key: "clubs", label: "clubs" },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === t.key
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Options */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`search ${activeTab}`}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Alphabetical Toggle */}
            {activeTab === "clubs" && (
              <label className="inline-flex items-center justify-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={alphabeticalClubs}
                  onChange={(e) => setAlphabeticalClubs(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                alphabetical
              </label>
            )}
          </div>
        </div>

        {/* Categories */}
        <section className={activeTab === "categories" ? "block" : "hidden"}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                categories
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {categories.length} groups
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((c) => (
              <Link
                key={c.name}
                href={`/products?category=${encodeURIComponent(c.name)}`}
                className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-900 text-white">
                  {getCategoryIcon(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{c.name}</p>
                  <p className="text-gray-500 text-sm">{c.count} items</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* Leagues */}
        <section className={activeTab === "leagues" ? "block" : "hidden"}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">leagues</h2>
            </div>
            <span className="text-sm text-gray-500">
              {leagues.length} groups
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeagues.slice(0, 9).map((l) => (
              <Link
                key={l.name}
                href={`/products?category=${encodeURIComponent(l.name)}`}
                className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-900 text-white">
                  {/* simple neutral icon per league */}
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{l.name}</p>
                  <p className="text-gray-500 text-sm">{l.count} items</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* Clubs (compact) */}
        <section className={activeTab === "clubs" ? "block" : "hidden"}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">clubs</h2>
            </div>
            <span className="text-sm text-gray-500">top {clubs.length}</span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredClubs.map((club) => (
              <li key={club.name}>
                <Link
                  href={`/products?category=${encodeURIComponent(club.name)}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <span className="text-sm font-medium text-gray-900 truncate pr-3">
                    {club.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {club.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
