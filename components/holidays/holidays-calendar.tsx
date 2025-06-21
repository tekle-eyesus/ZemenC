"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getHolidaysForYear } from 'kenat';
import { EthDateTime, } from "ethiopian-calendar-date-converter"
import { format } from "date-fns"

const allTags = ["public", "christian", "muslim", "religious", "cultural", "state"]

export function HolidaysCalendar() {
  const { toast } = useToast()
  const [year, setYear] = useState(2017)
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [holidays, setHolidays] = useState<any[]>([])
  const currentEthYear = EthDateTime.now().year;
  const startYear = currentEthYear - 5;
  const endYear = currentEthYear + 5; // 5 years ahead


  {
    Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const y = startYear + i;
      return <option key={y} value={y}>{y}</option>;
    })
  }
  useEffect(() => {
    const data = getHolidaysForYear(year)
    setHolidays(data)
  }, [year])

  // Helper to generate a unique key for a holiday (should match backend logic)
  const getHolidayKey = (holiday: any) => {
    const eth = holiday.ethiopian;
    return `${eth.year}-${eth.month}-${eth.day}-${holiday.name}`;
  };

  // Fetch user's favorite dates for the selected year and set favorites state
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`/api/favorite-date?year=${year}`);
        if (res.ok) {
          const data = await res.json();
          // Map to keys for easy lookup
          setFavorites(data.map((fav: any) => `${fav.ethiopianYear}-${fav.ethiopianMonth}-${fav.ethiopianDay}-${fav.note}`));
        }
      } catch (error) {
        // Optionally show a toast
      }
    }
    fetchFavorites();
  }, [year]);

  const toggleTag = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const toggleFavorite = (key: string) => {
    const isFavorite = favorites.includes(key)
    setFavorites((prev) =>
      isFavorite ? prev.filter((k) => k !== key) : [...prev, key]
    )
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `Holiday ${isFavorite ? "removed" : "added"} successfully.`,
    })
  }

  // Save or remove favorite holiday
  const handleToggleFavorite = async (holiday: any) => {
    const key = getHolidayKey(holiday);
    const isFavorite = favorites.includes(key);
    // Prepare payload for saving
    const eth = holiday.ethiopian;
    const greg = new EthDateTime(eth.year, eth.month, eth.day).toEuropeanDate();
    const payload = {
      ethiopianDay: eth.day,
      ethiopianMonth: eth.month,
      ethiopianYear: eth.year,
      gregorianDay: greg.getDate(),
      gregorianMonth: greg.getMonth() + 1,
      gregorianYear: greg.getFullYear(),
      note: holiday.name,
    };
    try {
      if (!isFavorite) {
        // Save as favorite
        const res = await fetch("/api/favorite-date", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save favorite");
        setFavorites((prev) => [...prev, key]);
        toast({ title: "Added to favorites", description: `Holiday added successfully.` });
      } else {
        const res = await fetch("/api/favorite-date", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: holiday.name,
            isHoliday: true
          }),
        });
        if (!res.ok) throw new Error("Failed to remove favorite");
        setFavorites((prev) => prev.filter((k) => k !== key));
        toast({ title: "Removed from favorites", description: `Holiday removed successfully.` });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update favorite",
        variant: "destructive",
      });
    }
  };

  const filtered = holidays.filter((h) =>
    tagFilters.length === 0 || tagFilters.every((tag) => h.tags.includes(tag))
  )

  const convertEthiopianToGregorian = (ethiopianDate: { year: number, month: number, day: number }) => {
    const ethiopianDateObj = new EthDateTime(ethiopianDate.year, ethiopianDate.month, ethiopianDate.day)
    return ethiopianDateObj.toEuropeanDate().toString()
  }

  const convertDateFormat = (year: number, month: number, day: number) => {
    const ethDate = new EthDateTime(year, month, day)
    return ethDate.toDateString().split(",")[0]
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Ethiopian Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            {/* five years a forward and backward */}
            {Array.from({ length: endYear - startYear + 1 }, (_, i) => {
              const y = startYear + i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={tagFilters.includes(tag) ? "default" : "outline"}
              onClick={() => toggleTag(tag)}
              size="sm"
              className={
                tagFilters.includes(tag)
                  ? "dark:bg-blue-900 dark:text-white bg-black text-white border-none font-bold shadow"
                  : ""
              }
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holidays for {year} EC</CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {/* Table for desktop */}
          <div className="hidden sm:block w-full sm:min-w-[600px]">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-2 py-2 sm:px-4">Name</th>
                  <th className="px-2 py-2 sm:px-4">Ethiopian Date</th>
                  <th className="px-2 py-2 sm:px-4">Gregorian Date</th>
                  <th className="px-2 py-2 sm:px-4">Tags</th>
                  <th className="px-2 py-2 sm:px-4">Fav</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((holiday, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 sm:px-4 font-semibold max-w-[120px] truncate">
                      <TooltipProvider>
                        <Tooltip >
                          <TooltipTrigger>{holiday.name}</TooltipTrigger>
                          <TooltipContent className="max-w-xs whitespace-pre-line break-words rounded-lg shadow-lg p-3 bg-popover text-popover-foreground border border-border">{holiday.description}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-2 px-4">
                      {/* {holiday.ethiopian.year}/{holiday.ethiopian.month}/{holiday.ethiopian.day} */}
                      {convertDateFormat(holiday.ethiopian.year, holiday.ethiopian.month, holiday.ethiopian.day)}
                    </td>
                    <td className="py-2 px-4">
                      {
                        format(convertEthiopianToGregorian(holiday.ethiopian), "EEEE, MMMM d, yyyy")
                      }
                    </td>
                    <td className="flex flex-wrap gap-1 px-2 py-2 sm:px-4">
                      {holiday.tags.map((tag: string) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </td>
                    <td className="px-2 py-2 sm:px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(holiday)}
                      >
                        <Star
                          className={`h-5 w-5 ${favorites.includes(getHolidayKey(holiday))
                            ? "fill-yellow-400 text-yellow-500"
                            : "text-muted-foreground"
                            }`}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No holidays match current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Card view for mobile */}
          <div className="block sm:hidden">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No holidays match current filters.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((holiday, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-white dark:bg-muted shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{holiday.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(holiday)}
                        aria-label="Toggle favorite"
                        className="hover:bg-accent rounded-full"
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${favorites.includes(getHolidayKey(holiday))
                            ? "fill-yellow-400 text-yellow-500"
                            : "text-muted-foreground"
                            }`}
                        />
                      </Button>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">Ethiopian:</span>{" "}
                        {convertDateFormat(holiday.ethiopian.year, holiday.ethiopian.month, holiday.ethiopian.day)}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Gregorian:</span>{" "}
                        {format(
                          convertEthiopianToGregorian(holiday.ethiopian),
                          "EEEE, MMMM d, yyyy"
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {holiday.tags.map((tag: string) => (
                        <Badge
                          key={tag}

                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
