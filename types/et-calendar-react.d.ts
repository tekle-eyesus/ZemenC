declare module 'et-calendar-react' {
  import { FC } from 'react'
  
  interface EtCalendarProps {
    value?: Date
    onChange?: (date: Date) => void
    calendarType?: boolean
    minDate?: Date
    maxDate?: Date
    disabled?: boolean
  }

  export const EtCalendar: FC<EtCalendarProps>
} 