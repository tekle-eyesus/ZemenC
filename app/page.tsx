"use client"
import { DateConverter } from "@/components/converter/date-converter"
import { AdPlaceholder } from "@/components/ads/ad-placeholder"
import { Navbar } from "@/components/layout/navbar"
import { MainTabs } from "@/components/layout/main-tabs"
import { HolidaysCalendar } from "@/components/holidays/holidays-calendar"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import FavoriteDatesTable from "@/components/favorites/favorite-dates"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-2 sm:p-4 md:p-8">
        <div className="mx-auto w-full max-w-full sm:max-w-4xl">
          <header className="mb-6 sm:mb-8 text-center">
            <h1 className="mb-2 text-2xl sm:text-4xl font-bold text-primary dark:text-gray-300 break-words">
              ZemenConverter
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Convert dates between Ethiopian and Gregorian calendars
            </p>
          </header>

          <div className="mb-6 sm:mb-8">
            <AdPlaceholder />
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="overflow-x-auto">
              <Tabs defaultValue="converter" className="w-full min-w-[320px]">
                <MainTabs />
                <TabsContent value="converter" className="mt-6">
                  <div className="rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm">
                    <DateConverter />
                  </div>
                </TabsContent>
                <TabsContent value="holidays" className="mt-6">
                  <HolidaysCalendar />
                </TabsContent>
                <TabsContent value="favorites" className="mt-6">
                  <FavoriteDatesTable />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="mt-6 sm:mt-8">
            <AdPlaceholder />
          </div>
        </div>
      </main>
    </div>
  )
} 