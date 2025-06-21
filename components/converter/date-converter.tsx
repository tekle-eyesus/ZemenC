import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import etdate from "ethiopic-date"
import { format } from "date-fns"
import { EthDateTime } from "ethiopian-calendar-date-converter"
import { getHolidaysForYear } from 'kenat'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Star } from "lucide-react"



export function DateConverter() {
  const [savedDates, setSavedDates] = React.useState<any[]>([]);
  const { toast } = useToast()
  const [ethiopianDate, setEthiopianDate] = React.useState({
    day: "",
    month: "",
    year: "",
  })
  const [gregorianDate, setGregorianDate] = React.useState({
    day: "",
    month: "",
    year: "",
  })
  const [convertedDate, setConvertedDate] = React.useState("")

  // Helper to generate a unique key for a converted date
  function getDateKey(payload: any) {
    return `${payload.ethiopianYear}-${payload.ethiopianMonth}-${payload.ethiopianDay}-${payload.gregorianYear}-${payload.gregorianMonth}-${payload.gregorianDay}`;
  }

  // State to track favorite status and id
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [favoriteId, setFavoriteId] = React.useState<string | null>(null);
  const [tabsValue, setTabsValue] = React.useState("ethiopian-to-gregorian");

  // Check if the current converted date is already saved (on convertedDate or tab change)
  React.useEffect(() => {
    async function checkFavorite() {
      setIsFavorite(false);
      setFavoriteId(null);
      if (!convertedDate) return;
      let payload: any = {};
      if (tabsValue === "ethiopian-to-gregorian") {
        const day = parseInt(ethiopianDate.day);
        const month = parseInt(ethiopianDate.month);
        const year = parseInt(ethiopianDate.year);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return;
        const ethDateTime = new EthDateTime(year, month, day);
        const greDate = ethDateTime.toEuropeanDate();
        payload = {
          ethiopianDay: day,
          ethiopianMonth: month,
          ethiopianYear: year,
          gregorianDay: greDate.getDate(),
          gregorianMonth: greDate.getMonth() + 1,
          gregorianYear: greDate.getFullYear(),
        };
      } else {
        const day = parseInt(gregorianDate.day);
        const month = parseInt(gregorianDate.month);
        const year = parseInt(gregorianDate.year);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return; // Prevent NaN error
        const ethDate = EthDateTime.fromEuropeanDate(new Date(year, month - 1, day));
        payload = {
          ethiopianDay: ethDate.date,
          ethiopianMonth: ethDate.month,
          ethiopianYear: ethDate.year,
          gregorianDay: day,
          gregorianMonth: month,
          gregorianYear: year,
        };
      }
      try {
        const res = await fetch("/api/favorite-date");
        if (res.ok) {
          const data = await res.json();
          const found = data.find((fav: any) =>
            fav.ethiopianDay === payload.ethiopianDay &&
            fav.ethiopianMonth === payload.ethiopianMonth &&
            fav.ethiopianYear === payload.ethiopianYear &&
            fav.gregorianDay === payload.gregorianDay &&
            fav.gregorianMonth === payload.gregorianMonth &&
            fav.gregorianYear === payload.gregorianYear
          );
          if (found) {
            setIsFavorite(true);
            setFavoriteId(found.id);
          }
        }
      } catch { }
    }
    checkFavorite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertedDate, tabsValue]);

  const handleEthiopianToGregorian = () => {
    try {
      var day = parseInt(ethiopianDate.day)
      const month = parseInt(ethiopianDate.month)
      const year = parseInt(ethiopianDate.year)

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error("Please enter valid numbers for all fields")
      }

      if (day < 1 || day > 30) {
        throw new Error("Day must be between 1 and 30")
      }

      if (month < 1 || month > 13) {
        throw new Error("Month must be between 1 and 13")
      }

      // Convert using ethiopian-calendar-date-converter, have some issues here
      if (day != 30)
        day += 1

      const ethDateTime = new EthDateTime(year, month, day)
      const gregorianDate = ethDateTime.toEuropeanDate()
      setConvertedDate(format(gregorianDate, "EEEE, MMMM d, yyyy"))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid date",
        variant: "destructive",
      })
    }
  }

  const handleGregorianToEthiopian = () => {
    try {
      const day = parseInt(gregorianDate.day)
      const month = parseInt(gregorianDate.month)
      const year = parseInt(gregorianDate.year)

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error("Please enter valid numbers for all fields")
      }

      if (day < 1 || day > 31) {
        throw new Error("Day must be between 1 and 31")
      }

      if (month < 1 || month > 12) {
        throw new Error("Month must be between 1 and 12")
      }

      const date = new Date(year, month - 1, day)
      const ethDateTime = EthDateTime.fromEuropeanDate(date)

      const dateString = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`
      const converted = etdate.convert(dateString)
      setConvertedDate(converted)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid date",
        variant: "destructive",
      })
    }
  }


  const handleSave = async (convertedDate: string, isEthDate: Boolean) => {
    let payload: any = {};
    if (isEthDate) {
      const day = parseInt(gregorianDate.day)
      const month = parseInt(gregorianDate.month)
      const year = parseInt(gregorianDate.year)

      const ethDate = EthDateTime.fromEuropeanDate(new Date(year, month - 1, day));

      payload = {
        ethiopianDay: ethDate.date,
        ethiopianMonth: ethDate.month,
        ethiopianYear: ethDate.year,
        gregorianDay: day,
        gregorianMonth: month,
        gregorianYear: year,
        note: "",
      };
    } else {
      const day = parseInt(ethiopianDate.day)
      const month = parseInt(ethiopianDate.month)
      const year = parseInt(ethiopianDate.year)

      const ethDateTime = new EthDateTime(year, month, day)
      const greDate = ethDateTime.toEuropeanDate()

      payload = {
        ethiopianDay: day,
        ethiopianMonth: month,
        ethiopianYear: year,
        gregorianDay: greDate.getDate(),
        gregorianMonth: greDate.getMonth() + 1,
        gregorianYear: greDate.getFullYear(),
        note: "", // Optional
      };
    }
    try {
      const res = await fetch("/api/favorite-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsFavorite(true);
        const data = await res.json();
        setFavoriteId(data.id);
        toast({
          title: "Date saved",
          description: `The date has been saved to your favorites.`,
        });
      } else {
        throw new Error("Failed to save date");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save date",
        variant: "destructive",
      });
    }
  };

  // Delete logic
  const handleDelete = async () => {
    if (!favoriteId) return;
    try {
      const res = await fetch(`/api/favorite-date`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: favoriteId }),
      });
      if (res.ok) {
        setIsFavorite(false);
        setFavoriteId(null);
        toast({
          title: "Date removed",
          description: `The date has been removed from your favorites.`,
        });
      } else {
        throw new Error("Failed to remove date");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove date",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="ethiopian-to-gregorian" className="w-full">
      <TabsList className="grid grid-cols-2 w-full bg-muted">
        <TabsTrigger value="ethiopian-to-gregorian" className="data-[state=active]:bg-background">
          Ethiopian → Gregorian
        </TabsTrigger>
        <TabsTrigger value="gregorian-to-ethiopian" className="data-[state=active]:bg-background">
          Gregorian → Ethiopian
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ethiopian-to-gregorian" className="mt-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
            <div className="space-y-1 text-sm">
              <Label htmlFor="ethiopian-day">Day</Label>
              <Input
                id="ethiopian-day"
                type="number"
                min="1"
                max="30"
                value={ethiopianDate.day}
                onChange={(e) =>
                  setEthiopianDate({ ...ethiopianDate, day: e.target.value })
                }
                className="bg-background"
              />
            </div>
            <div className="space-y-1 text-sm">
              <Label htmlFor="ethiopian-month">Month</Label>
              <Input
                id="ethiopian-month"
                type="number"
                min="1"
                max="13"
                value={ethiopianDate.month}
                onChange={(e) =>
                  setEthiopianDate({ ...ethiopianDate, month: e.target.value })
                }
                className="bg-background"
              />
            </div>
            <div className="space-y-1 text-sm">
              <Label htmlFor="ethiopian-year">Year</Label>
              <Input
                id="ethiopian-year"
                type="number"
                value={ethiopianDate.year}
                onChange={(e) =>
                  setEthiopianDate({ ...ethiopianDate, year: e.target.value })
                }
                className="bg-background"
              />
            </div>
          </div>
          <Button onClick={handleEthiopianToGregorian} className="w-full h-10 text-md">
            Convert to Gregorian
          </Button>
          {convertedDate && (
            <div className="flex flex-col gap-2 justify-center items-center p-3 mt-4 w-full rounded-lg border border-border bg-muted sm:p-4 sm:flex-row sm:gap-3">
              <p className="text-base font-bold text-center break-words sm:text-lg text-muted-foreground">
                {convertedDate}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Save this date"
                      onClick={isFavorite ? handleDelete : () => handleSave(convertedDate, false)}
                      className="ml-0 sm:ml-2 mt-2 sm:mt-0"
                    >
                      <Star className={`h-6 w-6 ${isFavorite ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground"}`} />

                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Save this date
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="gregorian-to-ethiopian" className="mt-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
            <div className="space-y-1 text-sm">
              <Label htmlFor="gregorian-day">Day</Label>
              <Input
                id="gregorian-day"
                type="number"
                min="1"
                max="31"
                value={gregorianDate.day}
                onChange={(e) =>
                  setGregorianDate({ ...gregorianDate, day: e.target.value })
                }
                className="bg-background"
              />
            </div>
            <div className="space-y-1 text-sm">
              <Label htmlFor="gregorian-month">Month</Label>
              <Input
                id="gregorian-month"
                type="number"
                min="1"
                max="12"
                value={gregorianDate.month}
                onChange={(e) =>
                  setGregorianDate({ ...gregorianDate, month: e.target.value })
                }
                className="bg-background"
              />
            </div>
            <div className="space-y-1 text-sm">
              <Label htmlFor="gregorian-year">Year</Label>
              <Input
                id="gregorian-year"
                type="number"
                value={gregorianDate.year}
                onChange={(e) =>
                  setGregorianDate({ ...gregorianDate, year: e.target.value })
                }
                className="bg-background"
              />
            </div>
          </div>
          <Button onClick={handleGregorianToEthiopian} className="w-full h-10 text-md">
            Convert to Ethiopian
          </Button>
          {convertedDate && (
            <div className="flex flex-col gap-2 justify-center items-center p-3 mt-4 w-full rounded-lg border border-border bg-muted sm:p-4 sm:flex-row sm:gap-3">
              <p className="text-base font-bold text-center break-words sm:text-lg text-muted-foreground">
                {convertedDate}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Save this date"
                      onClick={isFavorite ? handleDelete : () => handleSave(convertedDate, true)}
                      className="ml-0 sm:ml-2 mt-2 sm:mt-0"
                    >
                      <Star className={`h-6 w-6 ${isFavorite ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground"}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Save this date
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}