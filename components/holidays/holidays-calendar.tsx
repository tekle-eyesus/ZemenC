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

const allTags = ["public", "christian", "muslim", "religious", "cultural","state"]

export function HolidaysCalendar() {
  const { toast } = useToast()
  const [year, setYear] = useState(2017)
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [holidays, setHolidays] = useState<any[]>([])
  const currentEthYear =  EthDateTime.now().year;
  const startYear = currentEthYear - 5;
  const endYear = currentEthYear + 5; // 5 years ahead

// In your select:
{Array.from({ length: endYear - startYear + 1 }, (_, i) => {
  const y = startYear + i;
  return <option key={y} value={y}>{y}</option>;
})}
  useEffect(() => {
    const data = getHolidaysForYear(year )
    setHolidays(data)
  }, [year])

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

  const filtered = holidays.filter((h) =>
    tagFilters.length === 0 || tagFilters.every((tag) => h.tags.includes(tag))
  )

  const convertEthiopianToGregorian = (ethiopianDate: { year: number, month: number, day: number }) => {
    const ethiopianDateObj = new EthDateTime(ethiopianDate.year, ethiopianDate.month, ethiopianDate.day)
    return ethiopianDateObj.toEuropeanDate().toString()
  }
  
  const convertDateFormat = (year:number, month:number, day:number)=>{
    const ethDate = new EthDateTime(year,month,day)
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
            className="border rounded px-2 py-1"
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
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-2">Ethiopian Date</th>
                <th className="py-2 px-4">Gregorian Date</th>
                <th className="py-2 px-4">Tags</th>
                <th className="py-2 px-4">Fav</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((holiday, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4 font-semibold">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{holiday.name}</TooltipTrigger>
                        <TooltipContent>{holiday.description}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="py-2 px-4">
                    {/* {holiday.ethiopian.year}/{holiday.ethiopian.month}/{holiday.ethiopian.day} */}
                    {convertDateFormat(holiday.ethiopian.year, holiday.ethiopian.month,holiday.ethiopian.day)}
                  </td>
                  <td className="py-2 px-4">
                    {
                      format(convertEthiopianToGregorian(holiday.ethiopian), "EEEE, MMMM d, yyyy")
                    }
                  </td>
                  <td className="py-2 px-4 flex flex-wrap gap-1">
                    {holiday.tags.map((tag: string) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </td>
                  <td className="py-2 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(holiday.key)}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          favorites.includes(holiday.key)
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
                  <td colSpan={5} className="text-center py-4 text-muted-foreground">
                    No holidays match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  )
}
