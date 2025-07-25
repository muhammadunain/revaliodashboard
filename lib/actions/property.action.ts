"use server"

import { db } from "@/drizzle/db";
import { add_property } from "@/drizzle/schema";
import { PropertyProps } from "@/types"

export const addProperty =  async(params:PropertyProps) => { 

    try{

        const result = await db.insert(add_property).values({
                ...params,
            }).returning();
        if(result.length ===0 || !result){
            throw new Error("Property not added successfully");
        }

        return {success: true, message: "Property added successfully",data:result}

    }catch(error){
        console.error("Error adding property:", error);
        throw new Error("Failed to add property");
    }

}


export const getProperties = async ()=>{
    try{
        const properties = await db.select().from(add_property);
        if(properties.length ===0 || !properties){
           return {success: false, message: "No properties found"}
        }
        return {success: true, message: "Properties fetched successfully", data: properties}
    }catch(error){
        console.error("Error fetching properties:", error);
        throw new Error("Failed to fetch properties");
    }
}