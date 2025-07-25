import {
	pgTable,
	text,
	timestamp,
	boolean,
	uuid,
	integer,
	date,
	numeric,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified")
		.$defaultFn(() => false)
		.notNull(),
	image: text("image"),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
	updatedAt: timestamp("updated_at").$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
});

export const schema = { user, session, account, verification };

export const add_property = pgTable("add_property", {
	id: uuid("id").primaryKey().defaultRandom(),
	address: text("address").notNull(),
	country: text("country").notNull(),
	towerShip: text("tower_ship").notNull(),
	city: text("city").notNull(),
	zipCode: text("zip_code"),

	// Property Specs
	propertyType: text("property_type").notNull(), // e.g., House, Apartment
	listingType: text("listing_type").notNull(), // e.g., Rent, Sale
	bedrooms: text("bedrooms"),
	bathrooms: text("bathrooms"),
	areaSqFt: text("area_sq_ft"),
	floor: text("floor"),
	totalFloors: text("total_floors"),

	// Pricing & Finance
	price: text("price").notNull(),

	// Ownership
	// ownerName: text("owner_name"),
	// contactNumber: text("contact_number"),
	// email: text("email"),

	// Filing & Document Tracking (from your image)
	activeFilingsCount: text("active_filings_count"),
	filingHistoryCount: text("filing_history_count"),
	pendingAuthorizations: text("pending_authorizations"),
	outstandingInvoices: text("outstanding_invoices"),
	

	// Timestamps
	createAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
