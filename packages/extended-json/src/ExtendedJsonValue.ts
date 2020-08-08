export type ExtendedJsonValue =
  | undefined
  | null
  | string
  | number
  | boolean
  | Date
  | ExtendedJsonValue[]
  | ExtendedJsonRecord;

export interface ExtendedJsonRecord {
  [key: string]: ExtendedJsonValue;
}