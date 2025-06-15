declare module 'kenat' {
  interface Holiday {
    date: Date;
    name: string;
    type: string;
  }

  export function getHolidaysForYear(year: number): Holiday[];
} 