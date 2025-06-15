"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, Star } from "lucide-react"

export function MainTabs() {
  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="converter" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Converter
      </TabsTrigger>
      <TabsTrigger value="holidays" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Holidays
      </TabsTrigger>
      <TabsTrigger value="favorites" className="flex items-center gap-2">
        <Star className="h-4 w-4" />
        Favorites
      </TabsTrigger>
    </TabsList>
  )
} 