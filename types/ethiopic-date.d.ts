declare module 'ethiopic-date' {
  function convert(date: string): string;
  function now(): string;
  export default { convert, now };
} 