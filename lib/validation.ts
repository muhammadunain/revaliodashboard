import {  z } from "zod";

export const signUpSchema = z.object({
	name: z.string().min(3).max(20),
	email: z.string().email({
		message: "Email must be a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
	confirmPassword: z.string().min(8, {
		message: "Password does not match.",
	}),
})
 .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], 
  });

export const signInSchema = z.object({
    email: z.string().email({
		message: "Email must be a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
})


export const addPropertySchema = z.object({
	address: z.string().min(5, {
		message: "Address must be at least 5 characters long.",
	}),
	country: z.string().min(2, {
		message: "Country must be at least 2 characters long.",
	}),
	towerShip: z.string().min(2, {
		message: "Tower Ship must be at least 2 characters long.",
	}),
	city: z.string().min(2, {
		message: "City must be at least 2 characters long.",
	}),
	zipCode: z.string(),
	propertyType: z.string(),
	listingType:z.string(),
	bedrooms: z.string(),
	bathrooms: z.string(),
	areaSqFt: z.string(),
	floor: z.string(),
	totalFloors: z.string(),
	price:z.string(),
	  activeFilingsCount: z.string(),
	filingHistoryCount: z.string(),
	pendingAuthorizations:z.string(),
	outstandingInvoices:z.string()
})