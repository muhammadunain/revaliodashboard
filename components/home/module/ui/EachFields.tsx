'use client';

import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

type FormInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  colSpan?: string;
  type?:string;
};

const FormInputField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = '',
  required = false,
  colSpan = 'md:col-span-2',
  type = 'text',
}: FormInputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={colSpan}>
          <FormLabel className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
            type={type}
              placeholder={placeholder}
              className="w-full h-12"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputField;
