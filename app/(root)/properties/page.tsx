import { SectionCards } from "@/components/section-cards";
import React from "react";

const Properties = () => {
	return (
		<>
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full max-w-full">
				<div className="px-4 lg:px-6">
					<SectionCards />
				</div>
			</div>
		</>
	);
};

export default Properties;
export const revalidate = 60; // Revalidate every 60 seconds