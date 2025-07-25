import { z } from 'zod';

export const propertyFormSchema = z.object({
  // Basic Information
  propertyId: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  township: z.string().optional(),
  county: z.string().optional(),

  // Property Details
  propertyType: z.enum(['residential', 'commercial', 'industrial', 'land', 'mixed-use']).optional(),
  subType: z.string().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 5).optional(),
  lotSize: z.number().positive().optional(),
  buildingSize: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  floors: z.number().int().min(1).optional(),
  parking: z.number().int().min(0).optional(),

  // Financial Information
  purchasePrice: z.number().positive().optional(),
  currentValue: z.number().positive().optional(),
  monthlyRent: z.number().positive().optional(),
  propertyTaxes: z.number().min(0).optional(),
  insurance: z.number().min(0).optional(),
  hoaFees: z.number().min(0).optional(),

  // Legal Information
  parcelNumber: z.string().optional(),
  legalDescription: z.string().optional(),
  deedType: z.string().optional(),
  ownershipType: z.string().optional(),
  mlsNumber: z.string().optional(),

  // Features
  heating: z.string().optional(),
  cooling: z.string().optional(),
  utilities: z.array(z.string()).optional(),
  appliances: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),

  // Condition
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  renovationYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  notes: z.string().optional(),
  description: z.string().optional(),

  // Status
  status: z.enum(['active', 'sold', 'rented', 'inactive']).default('active'),
  isRental: z.boolean().default(false),
  isOwnerOccupied: z.boolean().default(false),
  isPrimaryResidence: z.boolean().default(false),

  // Dates
  purchaseDate: z.date().optional(),
  listingDate: z.date().optional(),
  saleDate: z.date().optional(),
  lastInspectionDate: z.date().optional(),

  // Contact Information
  propertyManager: z.string().optional(),
  propertyManagerPhone: z.string().optional(),
  propertyManagerEmail: z.string().email().optional().or(z.literal('')),
});


export type PropertyFormData = z.infer<typeof propertyFormSchema>;
