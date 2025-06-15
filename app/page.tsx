"use client"
import { DateConverter } from "@/components/converter/date-converter"
import { AdPlaceholder } from "@/components/ads/ad-placeholder"
import { Navbar } from "@/components/layout/navbar"
import { MainTabs } from "@/components/layout/main-tabs"
import { HolidaysCalendar } from "@/components/holidays/holidays-calendar"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-primary">
              ZemenConverter
            </h1>
            <p className="text-lg text-muted-foreground">
              Convert dates between Ethiopian and Gregorian calendars
            </p>
          </header>

          <div className="mb-8">
            <AdPlaceholder />
          </div>

          <div className="mb-8">
            <Tabs defaultValue="converter" className="w-full">
              <MainTabs />
              <TabsContent value="converter" className="mt-6">
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <DateConverter />
                </div>
              </TabsContent>
              <TabsContent value="holidays" className="mt-6">
                <HolidaysCalendar />
              </TabsContent>
              <TabsContent value="favorites" className="mt-6">
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-4">Favorite Dates</h2>
                  <p className="text-muted-foreground">
                    Sign in to save and view your favorite dates.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8">
            <AdPlaceholder />
          </div>
        </div>
      </main>
    </div>
  )
} 