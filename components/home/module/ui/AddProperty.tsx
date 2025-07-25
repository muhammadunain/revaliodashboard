'use client'
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { addPropertySchema } from '@/lib/validation'
import { addProperty } from '@/lib/actions/property.action'
import { toast } from 'sonner'
import { Circle, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'


const AddProperty = () => {
const [Loading, setLoading] = useState(false)
const router = useRouter()
    const form = useForm<z.infer<typeof addPropertySchema>>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      address: "",
        country: "",
        towerShip: "",
        city: "",

    },
  })
 
async function onSubmit(values: z.infer<typeof addPropertySchema>) {
    try{
setLoading(true)
      if(!values) throw new Error("Form values are empty");
      const response = await addProperty(values)
      if(response.success&& response.data){
        form.reset();
        setLoading(false)
        router.refresh();
        toast.success(response.message || "Property added successfully");
      }else{
        toast.error(response.message || "Failed to add property");

      }
    }catch(error:any){
      toast.error(error.message || "An error occurred while adding property");
    } finally{
      setLoading(false);
    }
  }
  return (
   <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors">
      Add Property
    </Button>
  </AlertDialogTrigger>
  
  <AlertDialogContent className="sm:max-w-[500px] max-w-[95vw] mx-auto p-0 gap-0">
    <AlertDialogHeader className="px-6 pt-6 pb-4 border-b">
      <AlertDialogTitle className="text-xl font-semibold text-left">
        Add New Property
      </AlertDialogTitle>
      <p className="text-sm text-muted-foreground mt-1">
        Fill in the details below to add a new property to your portfolio.
      </p>
    </AlertDialogHeader>

    <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Property Address <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter full property address" 
                      className="w-full h-10"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Country <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Select or enter country" 
                      className="w-full h-10"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    City<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter city name" 
                      className="w-full h-10"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="towerShip"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Township/Area <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter township or area name" 
                      className="w-full h-10"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>

    <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 px-6 py-4 border-t bg-muted/30">
      <AlertDialogCancel className="w-full sm:w-auto border-input hover:bg-accent hover:text-accent-foreground">
        Cancel
      </AlertDialogCancel>
      <Button 
        type="submit" 
        onClick={form.handleSubmit(onSubmit)}
        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
      >
      {Loading? <LoaderCircle className='w-4 h-4 animate-spin'/>:"Add Property"}
      </Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default AddProperty