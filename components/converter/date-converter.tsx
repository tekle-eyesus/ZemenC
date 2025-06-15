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

export function DateConverter() {
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

  const handleEthiopianToGregorian = () => {
    try {
      const day = parseInt(ethiopianDate.day)
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

      // Convert using ethiopian-calendar-date-converter
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

      // Convert using ethiopian-calendar-date-converter
      const date = new Date(year, month - 1, day)
      const ethDateTime = EthDateTime.fromEuropeanDate(date)
      
      // Format date as MM/DD/YYYY for ethiopic-date library to get Amharic format
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

  return (
    <Tabs defaultValue="ethiopian-to-gregorian" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-muted">
        <TabsTrigger value="ethiopian-to-gregorian" className="data-[state=active]:bg-background">
          Ethiopian → Gregorian
        </TabsTrigger>
        <TabsTrigger value="gregorian-to-ethiopian" className="data-[state=active]:bg-background">
          Gregorian → Ethiopian
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ethiopian-to-gregorian" className="mt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="mt-4 rounded-lg border border-border bg-muted p-4">
              <p className="text-center text-lg font-bold text-muted-foreground">
                {convertedDate}
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="gregorian-to-ethiopian" className="mt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="mt-4 rounded-lg border border-border bg-muted p-4">
              <p className="text-center text-lg font-bold text-muted-foreground">
                {convertedDate}
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
} 