export interface Supplier {
  id: number;
  name: string;
  specifications: { [key: string]: string };
  contactEmail?: string;
  phoneNumber?: string;
  aadress?: string;
}