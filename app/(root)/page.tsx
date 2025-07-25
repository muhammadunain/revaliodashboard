import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import React from 'react'
import data from '../../public/data.json'
import AddProperty from '@/components/home/module/ui/AddProperty'
import MessagingComponent from '@/components/home/module/ui/Message'

const Home = () => {
  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="@container/main flex flex-1 flex-col gap-2 w-full">
        {/* Header section with AddProperty button aligned to right */}
        <div className="flex justify-end items-center px-4 lg:px-6 py-4">
          <AddProperty />
        </div>
        
        {/* Main content with proper spacing and width constraints */}
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full max-w-full">
          <div className="px-4 lg:px-6">
            <SectionCards />
          </div>
          
          {/* Messaging Component Section */}
          {/* <div className="px-4 lg:px-6 w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Support & Communication</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your support tickets and communicate with our team
                </p>
              </div>
              <div >
                <MessagingComponent />
              </div>
            </div>
          </div> */}
          
          <div className="px-4 lg:px-6 w-full overflow-x-auto">
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home